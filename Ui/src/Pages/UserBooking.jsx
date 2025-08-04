import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  DownloadIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  FileTextIcon,
} from "lucide-react";
import api from "../lib/Url";
import UserProfile from "../../UserProfile";
import Loading from "../Components/Loading";

const UserBookingsPage = () => {
  const { userId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const currentUser = UserProfile.GetUserData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/booking/by-user/${currentUser._id}`);
        setBookings(res.data);
      } catch (error) {
        toast.error("Failed to fetch data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const downloadInvoice = async (bookingId) => {
    try {
      setDownloadingId(bookingId);

      const res = await api.get(`/booking/${bookingId}/invoice`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${bookingId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download invoice.");
      console.error(error);
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loading />
        <p className="mt-4 text-brand-blue font-medium">
          Loading your bookings...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-8">
          <div className="bg-brand-blue px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {currentUser.username}'s Bookings
                </h1>
                <p className="text-blue-100 mt-1 text-lg">
                  {currentUser.email}
                </p>
              </div>
              <div className="hidden sm:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-white/90 text-sm">Total Bookings</p>
                  <p className="text-2xl font-bold text-white">
                    {bookings?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {bookings && bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <div
                key={booking._id}
                className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {booking.post?.title || "Untitled Booking"}
                        </h3>
                        <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                          #{index + 1}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center text-gray-600">
                          <div className="bg-blue-50 p-2 rounded-lg mr-3">
                            <CalendarIcon className="h-5 w-5 text-brand-blue" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-medium">
                              Date
                            </p>
                            <p className="font-semibold">
                              {formatDate(booking.startTime)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <div className="bg-green-50 p-2 rounded-lg mr-3">
                            <ClockIcon className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-medium">
                              Time
                            </p>
                            <p className="font-semibold">
                              {formatTime(booking.startTime)} -{" "}
                              {formatTime(booking.endTime)}
                            </p>
                          </div>
                        </div>

                        {booking.post?.address && (
                          <div className="flex items-center text-gray-600 md:col-span-2">
                            <div className="bg-purple-50 p-2 rounded-lg mr-3">
                              <MapPinIcon className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 font-medium">
                                Location
                              </p>
                              <p className="font-semibold">
                                {booking.post.address}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {booking.notes && (
                        <div className="bg-gray-50 rounded-lg p-4 mt-4">
                          <div className="flex items-start">
                            <div className="bg-amber-50 p-2 rounded-lg mr-3">
                              <FileTextIcon className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 font-medium mb-1">
                                Notes
                              </p>
                              <p className="text-gray-700">{booking.notes}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Download Invoice Button */}
                    <div className="mt-4 lg:mt-0">
                      <button
                        onClick={() => downloadInvoice(booking._id)}
                        disabled={downloadingId === booking._id}
                        className="flex items-center px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        {downloadingId === booking._id
                          ? "Downloading..."
                          : "Download Invoice"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
              <div className="p-12 text-center">
                <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Bookings Found
                </h3>
                <p className="text-gray-500">
                  You haven't made any bookings yet. Start exploring our
                  services!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserBookingsPage;
