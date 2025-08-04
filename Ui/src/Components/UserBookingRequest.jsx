import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { XCircle, ClipboardList, Clock, MapPin, Banknote } from "lucide-react";
import api from "../lib/Url";
import UserProfile from "../../UserProfile";
import toast from "react-hot-toast";
import Loading from "./Loading";

const RequestBookingDialog = ({ listingId, isOpen, onClose, type, price }) => {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [operationalDays, setOperationalDays] = useState([]);
  const [operationalHours, setOperationalHours] = useState({
    start: 9,
    end: 17,
  });
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!listingId) return;

      setLoading(true);
      try {
        const [listingRes, calendarRes] = await Promise.all([
          api.get(`/post/${listingId}`),
          api.get(`/booking/calendar?type=${type}&id=${listingId}`),
        ]);

        setListing(listingRes.data);

        const { operationDays, operationHours, events } = calendarRes.data;

        // Convert day names to numbers (0=Sunday, 1=Monday, etc.)
        const dayNameToNumber = {
          Sunday: 0,
          Monday: 1,
          Tuesday: 2,
          Wednesday: 3,
          Thursday: 4,
          Friday: 5,
          Saturday: 6,
        };

        const convertedDays =
          operationDays
            ?.map((day) => dayNameToNumber[day])
            .filter((d) => d !== undefined) || [];
        setOperationalDays(convertedDays);

        // Convert time strings to hours (e.g., "11:00" -> 11)
        const parseTimeToHour = (timeStr) => {
          if (!timeStr) return null;
          const [hours] = timeStr.split(":");
          return parseInt(hours, 10);
        };

        const startHour = parseTimeToHour(operationHours?.open);
        const endHour = parseTimeToHour(operationHours?.close);

        setOperationalHours({
          start: startHour !== null ? startHour : 9,
          end:
            endHour !== null
              ? endHour === 23 && operationHours?.close === "23:59"
                ? 24
                : endHour + 1
              : 17,
        });

        const formattedBookedSlots =
          events?.flatMap((event) => {
            const slots = [];
            const start = new Date(event.start);
            const end = new Date(event.end);

            let current = new Date(start);
            while (current <= end) {
              slots.push(new Date(current));
              current = new Date(current.getTime() + 30 * 60000);
            }

            return slots;
          }) || [];

        setBookedSlots(formattedBookedSlots);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [listingId, isOpen, type]);

  const isOperationalDay = (dateToCheck) => {
    const day = dateToCheck.getDay();
    return operationalDays.length === 0 || operationalDays.includes(day);
  };

  const generateTimeOptions = () => {
    const options = [];
    for (
      let hour = operationalHours.start;
      hour < operationalHours.end;
      hour++
    ) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const displayTime = new Date();
        displayTime.setHours(hour, minute);
        const displayStr = displayTime.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        options.push({ value: timeStr, display: displayStr });
      }
    }
    return options;
  };

  const isTimeSlotAvailable = (timeStr) => {
    if (!timeStr) return true;

    const [hours, minutes] = timeStr.split(":").map(Number);
    const checkTime = new Date(date);
    checkTime.setHours(hours, minutes, 0, 0);

    return !bookedSlots.some((booked) => {
      const bookedTime = new Date(booked);
      return bookedTime.getTime() === checkTime.getTime();
    });
  };

  const isRangeValid = () => {
    if (!startTime || !endTime) return false;

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    return endMinutes > startMinutes;
  };

  const isRangeAvailable = () => {
    if (!startTime || !endTime || !isRangeValid()) return false;

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    // Check every 30-minute slot in the range
    let currentHour = startHour;
    let currentMinute = startMinute;

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMinute < endMinute)
    ) {
      const timeStr = `${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;
      if (!isTimeSlotAvailable(timeStr)) {
        return false;
      }

      currentMinute += 30;
      if (currentMinute >= 60) {
        currentMinute = 0;
        currentHour++;
      }
    }

    return true;
  };

  const handleDateChange = (newDate) => {
    if (newDate) {
      setDate(new Date(newDate));
      setStartTime("");
      setEndTime("");
    }
  };

  const getDuration = () => {
    if (!startTime || !endTime || !isRangeValid()) return "";

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const durationMinutes =
      endHour * 60 + endMinute - (startHour * 60 + startMinute);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    return `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m` : ""}`;
  };

  const formatTimeTo12Hour = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":").map(Number);
    const displayTime = new Date();
    displayTime.setHours(hours, minutes);
    return displayTime.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSubmit = async () => {
    if (!startTime || !endTime) {
      toast.error("Please select both start and end times");
      return;
    }

    if (!isRangeValid()) {
      toast.error("End time must be after start time");
      return;
    }

    if (!isRangeAvailable()) {
      toast.error("Selected time range conflicts with existing bookings");
      return;
    }

    try {
      setLoading(true);

      // Create start and end datetime objects
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      const startDateTime = new Date(date);
      startDateTime.setHours(startHour, startMinute, 0, 0);

      const endDateTime = new Date(date);
      endDateTime.setHours(endHour, endMinute, 0, 0);

      await api.post("/booking/create", {
        userId: UserProfile.GetUserData()._id,
        type,
        venueId: type === "venue" ? listingId : undefined,
        serviceId: type === "service" ? listingId : undefined,
        startTime: startDateTime,
        endTime: endDateTime,
        notes: notes.trim(),
        price: price,
      });

      toast.success("Booking successful!");
      setStartTime("");
      setEndTime("");
      setNotes("");
      onClose();
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const tileDisabled = ({ date: tileDate, view }) => {
    if (view !== "month") return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(tileDate);
    checkDate.setHours(0, 0, 0, 0);

    return checkDate < today;
  };

  const tileClassName = ({ date: tileDate, view }) => {
    if (view !== "month") return "";

    const isSelected = tileDate.toDateString() === date.toDateString();
    const isToday = tileDate.toDateString() === new Date().toDateString();
    const isNonOperational =
      operationalDays.length > 0 &&
      !operationalDays.includes(tileDate.getDay());
    const isPast = tileDate < new Date().setHours(0, 0, 0, 0);

    let classes = "";
    if (isSelected) classes += " selected-date";
    if (isToday) classes += " today-date";
    if (isNonOperational && !isPast) classes += " non-operational-date";

    return classes;
  };

  const tileContent = ({ date: tileDate, view }) => {
    if (view !== "month") return null;

    const isNonOperational =
      operationalDays.length > 0 &&
      !operationalDays.includes(tileDate.getDay());
    const isPast = tileDate < new Date().setHours(0, 0, 0, 0);

    if (isNonOperational && !isPast) {
      return <div className="closed-banner">CLOSED</div>;
    }

    return null;
  };

  const getEndTimeOptions = () => {
    const options = generateTimeOptions();
    if (!startTime) return options;

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const startMinutes = startHour * 60 + startMinute;

    return options.filter((option) => {
      const [optionHour, optionMinute] = option.value.split(":").map(Number);
      const optionMinutes = optionHour * 60 + optionMinute;
      
      // End time must be after start time AND the slot must be available
      return optionMinutes > startMinutes && isTimeSlotAvailable(option.value);
    });
  };

  const timeOptions = generateTimeOptions();
  const endTimeOptions = getEndTimeOptions();

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
        <Dialog.Panel className="w-full max-w-5xl mx-auto rounded-lg bg-white shadow-xl max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 rounded-t-lg">
            <Dialog.Title className="text-lg sm:text-xl font-bold text-gray-900">
              Book {listing?.title || "this listing"}
            </Dialog.Title>
          </div>

          {loading ? (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <Loading />
                <p className="font-heading text-slate-900 text-lg sm:text-2xl mt-4">
                  Loading...
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Calendar Section */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Select Date
                  </h3>
                  <div className="calendar-wrapper w-full">
                    <Calendar
                      onChange={handleDateChange}
                      value={date}
                      tileDisabled={tileDisabled}
                      tileClassName={tileClassName}
                      tileContent={tileContent}
                      className="custom-calendar w-full"
                      minDetail="month"
                      minDate={new Date()}
                      selectRange={false}
                      showNeighboringMonth={false}
                      locale="en-US"
                    />
                  </div>
                </div>

                {/* Time Range Section */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Select Time Range
                  </h3>
                  <div className="text-sm text-gray-600 mb-3">
                    {date.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>

                  {!isOperationalDay(date) ? (
                    <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
                      <div className="text-red-600 space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <XCircle className="w-6 h-6" />
                          <p className="font-medium text-lg">
                            Not available on this day
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">
                          Available days:{" "}
                          {operationalDays.length
                            ? operationalDays
                                .map(
                                  (d) =>
                                    [
                                      "Sun",
                                      "Mon",
                                      "Tue",
                                      "Wed",
                                      "Thu",
                                      "Fri",
                                      "Sat",
                                    ][d]
                                )
                                .join(", ")
                            : "All days"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Start Time */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Start Time
                        </label>
                        <select
                          value={startTime}
                          onChange={(e) => {
                            setStartTime(e.target.value);
                            if (endTime && e.target.value >= endTime) {
                              setEndTime("");
                            }
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                        >
                          <option value="">Select start time</option>
                          {timeOptions.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                              disabled={!isTimeSlotAvailable(option.value)}
                            >
                              {option.display}{" "}
                              {!isTimeSlotAvailable(option.value)
                                ? "(Booked)"
                                : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* End Time */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          End Time
                        </label>
                        <select
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          disabled={!startTime}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">Select end time</option>
                          {endTimeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.display}
                            </option>
                          ))}
                        </select>
                        {!startTime && (
                          <p className="text-xs text-gray-500">
                            Please select a start time first
                          </p>
                        )}
                        {startTime && endTimeOptions.length === 0 && (
                          <p className="text-xs text-red-500">
                            No available end times after the selected start time
                          </p>
                        )}
                      </div>

                      {/* Range Validation */}
                      {startTime && endTime && (
                        <div className="mt-4">
                          {!isRangeValid() ? (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-red-700 text-sm">
                                End time must be after start time
                              </p>
                            </div>
                          ) : !isRangeAvailable() ? (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-red-700 text-sm">
                                This time range conflicts with existing
                                bookings
                              </p>
                            </div>
                          ) : (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-green-700 text-sm font-medium">
                                Time range is available
                              </p>
                              <p className="text-green-600 text-xs mt-1">
                                Duration: {getDuration()}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Price Display */}
                      {price && startTime && endTime && isRangeValid() && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2">
                                <Banknote className="w-4 h-4 text-blue-700" />
                                <p className="text-blue-700 text-sm font-medium">
                                  Total Price
                                </p>
                              </div>
                              <p className="text-blue-600 text-xs">
                                Duration: {getDuration()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-blue-900 text-xl font-bold">
                                Rs {price}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Notes Section */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Additional Notes (Optional)
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add any special requests or notes for your booking..."
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 resize-none"
                          maxLength={500}
                        />
                        <p className="text-xs text-gray-500 text-right">
                          {notes.length}/500 characters
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Summary Card */}
              {startTime && endTime && isRangeValid() && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <ClipboardList className="w-5 h-5 text-gray-900" />
                    <h4 className="font-semibold text-gray-900">
                      Booking Summary
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">Date:</span>
                      </div>
                      <p className="ml-6">
                        {date.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <div className="flex items-center gap-2 mb-1 mt-2">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">Time:</span>
                      </div>
                      <p className="ml-6">
                        {formatTimeTo12Hour(startTime)} -{" "}
                        {formatTimeTo12Hour(endTime)}
                      </p>
                      <p className="ml-6 mt-1">
                        <span className="font-medium">Duration:</span>{" "}
                        {getDuration()}
                      </p>
                    </div>
                    <div>
                      {price && (
                        <div className="flex items-center gap-2 mb-1">
                          <Banknote className="w-4 h-4 text-green-700" />
                          <span className="font-medium text-green-700">
                            Total:
                          </span>
                          <span className="text-lg font-bold text-green-700">
                            Rs {price}
                          </span>
                        </div>
                      )}
                      {notes && (
                        <p className="mt-2">
                          <span className="font-medium">Notes:</span>{" "}
                          {notes.substring(0, 50)}
                          {notes.length > 50 ? "..." : ""}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-3 sm:gap-4 items-center text-xs sm:text-sm bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex gap-2 items-center">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 rounded-sm"></div>
                    <span className="text-gray-700">Selected date</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-600 rounded-sm"></div>
                    <span className="text-gray-700">Today</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="w-6 h-3 sm:w-8 sm:h-4 bg-red-600 text-white text-xs rounded-sm flex items-center justify-center font-bold">
                      <span style={{ fontSize: "8px" }}>CLOSED</span>
                    </div>
                    <span className="text-gray-700">Closed days</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 pt-6 border-t border-gray-200 mt-6">
                <div className="text-sm text-gray-600 order-2 sm:order-1">
                  {startTime && endTime && isRangeValid() ? (
                    <div className="space-y-1">
                      <span className="font-medium text-green-600">
                        {date.toLocaleDateString()} • {" "}
                        {formatTimeTo12Hour(startTime)} -{" "}
                        {formatTimeTo12Hour(endTime)}
                      </span>
                      {price && (
                        <div className="text-lg font-bold text-green-700">
                          Total: Rs {price}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span>Select date and time range to continue</span>
                  )}
                </div>

                <div className="flex gap-3 w-full sm:w-auto order-1 sm:order-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={
                      !startTime ||
                      !endTime ||
                      !isRangeValid() ||
                      !isRangeAvailable() ||
                      loading
                    }
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed font-medium transition-colors"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="opacity-25"
                          ></circle>
                          <path
                            fill="currentColor"
                            className="opacity-75"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Booking...
                      </span>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default RequestBookingDialog;