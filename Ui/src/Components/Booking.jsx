import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import toast from "react-hot-toast";
import { TrashIcon, X, Loader2, MailIcon, PhoneIcon } from "lucide-react";
import { BsPencilSquare } from "react-icons/bs";
import { useForm, Controller } from "react-hook-form";
import api from "../lib/Url";

const BookingDialog = ({
  isOpen,
  closeModal,
  id,
  operationHours,
  type,
  operationDays,
  price,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingEvents, setIsFetchingEvents] = useState(false);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null); // Track which booking is being deleted

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user: null,
      startTime: new Date(),
      endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
      notes: "",
      price: price,
    },
  });

  // Watch user value to handle Select component
  const selectedUser = watch("user");

  // Check if selected day is operational
  const isOperationalDay = () => {
    const dayName = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    return operationDays?.includes(dayName);
  };

  // Helper function to combine date and time
  const combineDateAndTime = (date, time) => {
    const combined = new Date(date);
    combined.setHours(time.getHours());
    combined.setMinutes(time.getMinutes());
    combined.setSeconds(0);
    combined.setMilliseconds(0);
    return combined;
  };

  // Helper function to update time fields when date changes
  const updateTimeFieldsForDate = (newDate) => {
    const currentStartTime = watch("startTime");
    const currentEndTime = watch("endTime");

    if (currentStartTime) {
      const newStartTime = combineDateAndTime(newDate, currentStartTime);
      setValue("startTime", newStartTime);
    }

    if (currentEndTime) {
      const newEndTime = combineDateAndTime(newDate, currentEndTime);
      setValue("endTime", newEndTime);
    }
  };

  // Fetch events for selected date
  const fetchEvents = async () => {
    try {
      setIsFetchingEvents(true);
      const dateStr = selectedDate.toLocaleDateString("en-CA");
      const res = await api.get(
        `/booking/by-date?date=${dateStr}&postId=${id}&type=${type}`
      );
      setEvents(res.data);
    } catch (error) {
      toast.error("Failed to fetch events");
      console.error(error);
    } finally {
      setIsFetchingEvents(false);
    }
  };

  // Search users by email
  const searchUsers = async (inputValue) => {
    try {
      if (inputValue.length < 3) return;
      setIsSearchingUsers(true);
      const res = await api.get(`/user/search?email=${inputValue}`);
      setUsers(
        res.data.map((user) => ({
          value: user._id,
          label: `${user.username} (${user.email})`,
        }))
      );
    } catch (error) {
      toast.error("Failed to search users");
      console.error(error);
    } finally {
      setIsSearchingUsers(false);
    }
  };

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Update the time fields to reflect the new date
    updateTimeFieldsForDate(date);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      // Ensure the start and end times have the correct date
      const startTime = combineDateAndTime(selectedDate, data.startTime);
      const endTime = combineDateAndTime(selectedDate, data.endTime);

      const bookingData = {
        userId: data.user.value,
        type,
        venueId: type === "venue" ? id : undefined,
        serviceId: type === "service" ? id : undefined,
        startTime,
        endTime,
        notes: data.notes,
        price: data.price,
      };

      if (isEditing && currentBooking) {
        await api.put(`/booking/${currentBooking._id}`, bookingData);
        toast.success("Booking updated successfully");
      } else {
        await api.post("/booking/create", bookingData);
        toast.success("Booking created successfully");
      }

      resetForm();
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save booking");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    // Set times to current selected date
    const startTime = combineDateAndTime(selectedDate, now);
    const endTime = combineDateAndTime(selectedDate, oneHourLater);

    reset({
      user: null,
      startTime,
      endTime,
      notes: "",
      price: 0,
    });
    setIsEditing(false);
    setCurrentBooking(null);
  };

  // Edit booking
  const handleEdit = (booking) => {
    setCurrentBooking(booking);
    setIsEditing(true);

    const bookingDate = new Date(booking.startTime);
    const startTime = new Date(booking.startTime);
    const endTime = new Date(booking.endTime);

    // Set the calendar date to match the booking date
    setSelectedDate(bookingDate);

    setValue("user", {
      value: booking.user._id,
      label: `${booking.user.username} (${booking.user.email})`,
    });
    setValue("startTime", startTime);
    setValue("endTime", endTime);
    setValue("notes", booking.notes);
    setValue("price", booking.price || 0);
  };

  // Delete booking
  const handleDelete = async (bookingId) => {
    try {
      setIsDeleting(bookingId);
      await api.delete(`/booking/${bookingId}`);
      toast.success("Booking deleted successfully");
      fetchEvents();
    } catch (error) {
      toast.error("Failed to delete booking");
      console.error(error);
    } finally {
      setIsDeleting(null);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    if (isOpen) {
      fetchEvents();
      // Reset form with current selected date when dialog opens
      if (!isEditing) {
        resetForm();
      }
    }
  }, [selectedDate, isOpen]);

  const parseTime = (timeStr) => {
    if (timeStr) {
      const [hours, minutes] = timeStr?.split(":").map(Number);
      return new Date(0, 0, 0, hours, minutes);
    }
  };

  const minTime = parseTime(operationHours.open);
  const maxTime =
    operationHours.close === "00:00"
      ? new Date(0, 0, 1, 0, 0)
      : parseTime(operationHours.close);

  const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" });

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={closeModal}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 sticky top-0 z-10 bg-white">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {isEditing ? "Edit Booking" : "Create New Booking"}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => {
                      closeModal();
                      resetForm();
                    }}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row">
                  {/* Left Column - Calendar and Events */}
                  <div className="w-full lg:w-1/2 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
                    {/* Calendar */}
                    <div className="mb-6">
                      <div className="flex justify-center">
                        <DatePicker
                          selected={selectedDate}
                          onChange={handleDateChange}
                          inline
                          className="border rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Events List */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Events on{" "}
                        {selectedDate
                          .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                          .replace(/\//g, "/")}
                      </h4>

                      <div className="max-h-64 overflow-y-auto pr-2">
                        {isFetchingEvents ? (
                          <div className="flex items-center justify-center h-32">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                          </div>
                        ) : events.length > 0 ? (
                          <div className="space-y-2">
                            {events.map((event) => (
                              <div
                                key={event._id}
                                className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-colors"
                              >
                                <div className="flex justify-between items-start gap-3">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-600 truncate mb-1 flex items-center gap-2">
                                      <MailIcon className="h-4 w-4 text-gray-400" />
                                      {event.user.email}
                                    </p>
                                    <p className="text-sm text-gray-600 truncate mb-1 flex items-center gap-2">
                                      <PhoneIcon className="h-4 w-4 text-gray-400" />
                                      {event.user.phone}
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 mb-2">
                                      {formatTime(event.startTime)} -{" "}
                                      {formatTime(event.endTime)}
                                    </p>
                                    {event.notes && (
                                      <p className="text-sm text-gray-600 break-words">
                                        {event.notes}
                                      </p>
                                    )}
                                  </div>

                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleEdit(event)}
                                      className="text-brand-blue hover:text-brand-blue p-1 rounded hover:bg-blue-50"
                                      title="Edit booking"
                                      disabled={isDeleting === event._id}
                                    >
                                      <BsPencilSquare className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(event._id)}
                                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                                      title="Delete booking"
                                      disabled={isDeleting === event._id}
                                    >
                                      {isDeleting === event._id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <TrashIcon className="h-4 w-4" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-32">
                            <p className="text-sm text-gray-500">
                              No events scheduled for this date
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Booking Form or Not Operational Message */}
                  <div className="w-full lg:w-1/2 p-4 sm:p-6">
                    {isOperationalDay() ? (
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                      >
                        {/* User Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select User
                            <span className="text-red-500">*</span>
                          </label>
                          <Controller
                            name="user"
                            control={control}
                            rules={{ required: "User selection is required" }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={users}
                                onInputChange={(inputValue) => {
                                  if (inputValue.length > 2) {
                                    searchUsers(inputValue);
                                  }
                                }}
                                placeholder={
                                  isSearchingUsers
                                    ? "Searching users..."
                                    : "Search by email..."
                                }
                                isClearable
                                isLoading={isSearchingUsers}
                                loadingMessage={() => "Searching users..."}
                                className="text-sm text-black"
                              />
                            )}
                          />
                          {errors.user && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.user.message}
                            </p>
                          )}
                        </div>

                        {/* Time Selection */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Time
                              <span className="text-red-500">*</span>
                            </label>
                            <Controller
                              name="startTime"
                              control={control}
                              rules={{ required: "Start time is required" }}
                              render={({ field }) => (
                                <DatePicker
                                  selected={field.value}
                                  onChange={(time) => {
                                    // Combine selected date with the time
                                    const combinedDateTime = combineDateAndTime(
                                      selectedDate,
                                      time
                                    );
                                    field.onChange(combinedDateTime);
                                  }}
                                  showTimeSelect
                                  showTimeSelectOnly
                                  timeIntervals={30}
                                  timeCaption="Time"
                                  minTime={minTime}
                                  maxTime={maxTime}
                                  dateFormat="h:mm aa"
                                  className="border rounded-md p-2 w-full text-sm"
                                />
                              )}
                            />
                            {errors.startTime && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.startTime.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Time
                              <span className="text-red-500">*</span>
                            </label>
                            <Controller
                              name="endTime"
                              control={control}
                              rules={{
                                required: "End time is required",
                                validate: (value) => {
                                  const startTime = watch("startTime");
                                  return (
                                    value > startTime ||
                                    "End time must be after start time"
                                  );
                                },
                              }}
                              render={({ field }) => (
                                <DatePicker
                                  selected={field.value}
                                  onChange={(time) => {
                                    // Combine selected date with the time
                                    const combinedDateTime = combineDateAndTime(
                                      selectedDate,
                                      time
                                    );
                                    field.onChange(combinedDateTime);
                                  }}
                                  showTimeSelect
                                  showTimeSelectOnly
                                  timeIntervals={15}
                                  timeCaption="Time"
                                  dateFormat="h:mm aa"
                                  minTime={minTime}
                                  maxTime={maxTime}
                                  className="border rounded-md p-2 w-full text-sm"
                                />
                              )}
                            />
                            {errors.endTime && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.endTime.message}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Price */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price
                            <span className="text-red-500">*</span>
                          </label>
                          <Controller
                            name="price"
                            control={control}
                            rules={{
                              required: "Price is required",
                              min: {
                                value: 0,
                                message: "Price must be a positive number",
                              },
                            }}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="number"
                                min="0"
                                step="0.01"
                                className="border rounded-md p-2 w-full bg-white border-gray-300 text-black text-sm resize-none"
                                placeholder="Enter the Price of Booking"
                              />
                            )}
                          />
                          {errors.price && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.price.message}
                            </p>
                          )}
                        </div>

                        {/* Notes */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes
                          </label>
                          <Controller
                            name="notes"
                            control={control}
                            render={({ field }) => (
                              <textarea
                                {...field}
                                rows={3}
                                className="border rounded-md p-2 w-full bg-white border-gray-300 text-black text-sm resize-none"
                                placeholder="Add any additional notes..."
                              />
                            )}
                          />
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
                          <button
                            type="button"
                            onClick={() => {
                              closeModal();
                              resetForm();
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            disabled={isLoading}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center min-w-32"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                {isEditing ? "Updating..." : "Creating..."}
                              </>
                            ) : isEditing ? (
                              "Update Booking"
                            ) : (
                              "Create Booking"
                            )}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 w-full">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <X className="h-5 w-5 text-red-500" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-red-700">
                                {dayName} is not an operational day. Please
                                select a different date.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-8">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Operational Days:
                          </h4>
                          <ul className="list-disc pl-5 text-sm text-gray-700">
                            {operationDays?.map((day, index) => (
                              <li key={index}>{day}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BookingDialog;
