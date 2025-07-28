import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import toast from "react-hot-toast";
import { TrashIcon, X } from "lucide-react";
import { BsPencilSquare } from "react-icons/bs";
import api from "../lib/Url";

const BookingDialog = ({ isOpen, closeModal, id, operationHours, type, operationDays }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    startTime: new Date(),
    endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
    notes: "",
  });

  // Check if selected day is operational
  const isOperationalDay = () => {
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    console.log(dayName,operationDays)
    return operationDays?.includes(dayName);
  };

  // Fetch events for selected date
  const fetchEvents = async () => {
    try {
      const dateStr = selectedDate.toLocaleDateString("en-CA");
      const res = await api.get(
        `/booking/by-date?date=${dateStr}&postId=${id}&type=${type}`
      );
      setEvents(res.data);
    } catch (error) {
      toast.error("Failed to fetch events");
      console.error(error);
    }
  };

  // Search users by email
  const searchUsers = async (inputValue) => {
    try {
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
    }
  };

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle time changes
  const handleTimeChange = (date, field) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
  };

  // Handle user selection
  const handleUserChange = (selectedOption) => {
    console.log(selectedOption)
    setSelectedUser(selectedOption);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }

    try {
      const bookingData = {
        userId: selectedUser.value,
        type,
        venueId: type == "venue" ? id : undefined,
        serviceId: type == 'service' ? id : undefined,
        startTime: formData.startTime,
        endTime: formData.endTime,
        notes: formData.notes,
      };

      if (isEditing && currentBooking) {
        await api.put(`/booking/${currentBooking._id}`, bookingData);
        toast.success("Booking updated successfully");
      } else {
        // Create new booking
        await api.post("/booking/create", bookingData);
        toast.success("Booking created successfully");
      }

      // Reset form and refresh events
      resetForm();
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save booking");
      console.error(error);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      startTime: new Date(),
      endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
      notes: "",
    });
    setSelectedUser(null);
    setIsEditing(false);
    setCurrentBooking(null);
  };

  // Edit booking
  const handleEdit = (booking) => {
    setCurrentBooking(booking);
    setIsEditing(true);
    setSelectedUser({
      value: booking.user._id,
      label: `${booking.user.username} (${booking.user.email})`,
    });
    setFormData({
      startTime: new Date(booking.startTime),
      endTime: new Date(booking.endTime),
      notes: booking.notes,
    });
  };

  // Delete booking
  const handleDelete = async (bookingId) => {
    try {
      await api.delete(`/booking/${bookingId}`);
      toast.success("Booking deleted successfully");
      fetchEvents();
    } catch (error) {
      toast.error("Failed to delete booking");
      console.error(error);
    }
  };

  // Format time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    if (isOpen) {
      fetchEvents();
    }
  }, [selectedDate, isOpen]);

  // Debounce user search
  useEffect(() => {
    if (searchInput.length > 2) {
      const timer = setTimeout(() => {
        searchUsers(searchInput);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [searchInput]);

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

  const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

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
                        {events.length > 0 ? (
                          <div className="space-y-2">
                            {events.map((event) => (
                              <div
                                key={event.id}
                                className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-colors"
                              >
                                <div className="flex justify-between items-start gap-3">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-600 truncate mb-1">
                                      {event.user.email}
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
                                    >
                                      <BsPencilSquare className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(event._id)}
                                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                                      title="Delete booking"
                                    >
                                      <TrashIcon className="h-4 w-4" />
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
                      <form onSubmit={handleSubmit} className="space-y-4">
                        {/* User Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select User
                          </label>
                          <Select
                            options={users}
                            value={selectedUser}
                            onChange={handleUserChange}
                            onInputChange={setSearchInput}
                            placeholder="Search by email..."
                            isClearable
                            required
                            className="text-sm"
                          />
                        </div>

                        {/* Time Selection */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Time
                            </label>
                            <DatePicker
                              selected={formData.startTime}
                              onChange={(date) =>
                                handleTimeChange(date, "startTime")
                              }
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={15}
                              timeCaption="Time"
                              minTime={minTime}
                              maxTime={maxTime}
                              dateFormat="h:mm aa"
                              className="border rounded-md p-2 w-full text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Time
                            </label>
                            <DatePicker
                              selected={formData.endTime}
                              onChange={(date) =>
                                handleTimeChange(date, "endTime")
                              }
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={15}
                              timeCaption="Time"
                              dateFormat="h:mm aa"
                              minTime={minTime}
                              maxTime={maxTime}
                              className="border rounded-md p-2 w-full text-sm"
                              required
                            />
                          </div>
                        </div>

                        {/* Notes */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes
                          </label>
                          <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={3}
                            className="border rounded-md p-2 w-full bg-white border-gray-300 text-black text-sm resize-none"
                            placeholder="Add any additional notes..."
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
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                          >
                            {isEditing ? "Update Booking" : "Create Booking"}
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
                                {dayName} is not an operational day. Please select a different date.
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