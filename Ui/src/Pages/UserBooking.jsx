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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../lib/Url";
import UserProfile from "../../UserProfile";
import Loading from "../Components/Loading";

const UserBookingsPage = () => {
  const { userId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const downloadInvoice = (booking) => {
    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(24);
      doc.setTextColor(41, 128, 185);
      doc.text("BOOKING INVOICE", 105, 25, { align: "center" });

      // Line under header
      doc.setDrawColor(41, 128, 185);
      doc.setLineWidth(0.5);
      doc.line(20, 30, 190, 30);

      // Customer Info Section
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("CUSTOMER INFORMATION", 20, 45);

      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.text(`Name: ${currentUser.username}`, 20, 55);
      doc.text(`Email: ${currentUser.email}`, 20, 62);

      // Booking Details Section
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("BOOKING DETAILS", 20, 80);

      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.text(`Booking ID: ${booking._id}`, 20, 90);
      doc.text(`Service: ${booking.post?.title || "N/A"}`, 20, 97);
      doc.text(`Date: ${formatDate(booking.startTime)}`, 20, 104);
      doc.text(
        `Time: ${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`,
        20,
        111
      );

      if (booking.post?.address) {
        doc.text(`Location: ${booking.post.address}`, 20, 118);
      }

      let yPosition = booking.post?.address ? 125 : 118;

      if (booking.notes) {
        doc.text(`Notes: ${booking.notes}`, 20, yPosition);
        yPosition += 7;
      }

      // Invoice Table
      autoTable(doc, {
        startY: yPosition + 10,
        head: [["Description", "Amount"]],
        body: [
          ["Booking Fee", "$50.00"],
          ["Tax (10%)", "$5.00"],
          ["Total", "$55.00"],
        ],
        theme: "grid",
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontSize: 12,
          fontStyle: "bold",
        },
        bodyStyles: {
          fontSize: 11,
        },
        columnStyles: {
          0: { cellWidth: 140 },
          1: { cellWidth: 40, halign: "right" },
        },
        margin: { left: 20, right: 20 },
      });

      // Footer
      const finalY = doc.lastAutoTable.finalY || yPosition + 50;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Thank you for choosing our services!", 105, finalY + 20, {
        align: "center",
      });
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()}`,
        105,
        finalY + 27,
        { align: "center" }
      );

      // Save the PDF
      doc.save(`invoice-${booking._id}.pdf`);
      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate invoice");
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

  if (bookings && bookings.length == 0) {
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
      <div className="p-12 text-center">
        <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <CalendarIcon className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Bookings Found
        </h3>
        <p className="text-gray-500">
          You haven't made any bookings yet. Start exploring our services!
        </p>
      </div>
    </div>;
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

                    <div className="flex lg:flex-col gap-3">
                      <button
                        onClick={() => downloadInvoice(booking)}
                        className="inline-flex items-center justify-center px-6 py-3 border-2 border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-brand-blue transform transition-all duration-200 hover:scale-105"
                      >
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        Download Invoice
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
