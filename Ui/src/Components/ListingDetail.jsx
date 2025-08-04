import React, { useState } from "react";
import Slider from "react-slick";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Dialog } from "@headlessui/react";

import {
  FiArrowRight,
  FiArrowLeft,
  FiMapPin,
  FiShare2,
  FiEdit2,
  FiTrash2,
  FiUser,
  FiChevronDown,
  FiChevronUp,
  FiMail,
  FiPhone,
  FiClock,
  FiCalendar,
  FiMessageSquare,
} from "react-icons/fi";
import {
  IoPeopleOutline,
  IoLocationOutline,
  IoBookmarkOutline,
} from "react-icons/io5";
import { BsGrid1X2, BsWhatsapp } from "react-icons/bs";
import { BookIcon } from "lucide-react";
import BookingDialog from "./Booking";
import { Link } from "react-router-dom";
import MediaViewer from "./MediaViewer";
import RequestBookingDialog from "./UserBookingRequest";
import UserProfile from "../../UserProfile";

const ListingDetails = ({
  listings,
  owner,
  currentUser,
  events,
  operationalDays,
  operationalHours,
  handleUrlShare,
  handlePostDelete,
  handleStartChat,
  navigate,
  params,
}) => {
  const [isFeatureActive, setIsFeatureActive] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showBooking, setshowBooking] = useState(false);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  const {
    area,
    venuetype,
    capacity,
    address,
    description,
    discountPrice,
    offer,
    price,
    title,
    type,
    _id,
    userId,
    createdAt,
    updatedAt,
    imgUrl,
  } = listings;

  function SamplePrevArrow({ onClick }) {
    return (
      <div
        className="absolute top-1/2 left-4 z-[20] -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center cursor-pointer shadow-lg hover:bg-white transition-all"
        onClick={onClick}
      >
        <FiArrowLeft className="text-gray-700 text-lg" />
      </div>
    );
  }

  function SampleNextArrow({ onClick }) {
    return (
      <div
        className="absolute top-1/2 right-4 z-[20] -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center cursor-pointer shadow-lg hover:bg-white transition-all"
        onClick={onClick}
      >
        <FiArrowRight className="text-gray-700 text-lg" />
      </div>
    );
  }

  const settings = {
    dots: true,
    infinite: imgUrl?.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: imgUrl?.length > 1 ? <SampleNextArrow /> : null,
    prevArrow: imgUrl?.length > 1 ? <SamplePrevArrow /> : null,
    beforeChange: (current, next) => setCurrentSlide(next),
    appendDots: (dots) => (
      <div className="absolute bottom-6 w-full">
        <ul className="flex justify-center space-x-2">
          {dots.map((dot, index) => (
            <li
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? "bg-white w-4" : "bg-white/50"
              }`}
            >
              {dot}
            </li>
          ))}
        </ul>
      </div>
    ),
  };
  return (
    <div className="bg-white">
      {/* Hero Section */}

      <div className="relative bg-white">
        <Slider {...settings} className="z-[10] overflow-hidden">
          {imgUrl?.map((listing, index) => {
            const isVideo =
              listing.type?.startsWith("video") ||
              listing.path?.match(/\.(mp4|webm|mov)$/i);

            return (
              <div
                key={index}
                className="relative h-[40vh] sm:h-[50vh] md:h-[70vh] w-full bg-white"
              >
                <MediaViewer urls={imgUrl} startIndex={currentSlide}>
                  <div className="absolute inset-0 w-full h-full cursor-pointer">
                    {isVideo ? (
                      <video
                        src={listing.path}
                        className="w-full h-full object-contain bg-no-repeat"
                        autoPlay
                        muted
                        controls={false}
                        loop
                        playsInline
                      />
                    ) : (
                      <img
                        src={listing.path}
                        alt={`Listing ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                  </div>
                </MediaViewer>
              </div>
            );
          })}
        </Slider>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 z-10">
          <div className="container mx-auto max-w-7xl">
            <span className="inline-block py-1 px-3 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full text-xs font-medium uppercase tracking-wide">
              {type}
            </span>
            <h1 className="mt-3 text-xl sm:text-2xl md:text-4xl font-bold text-white capitalize">
              {title}
            </h1>
            {type === "venue" && (
              <div className="flex items-center mt-2 text-gray-200">
                <FiMapPin className="text-white mr-1.5 text-sm" />
                <span className="text-sm text-white">{address}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price & Description Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  {offer ? (
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold text-gray-900">
                        Rs {discountPrice}
                      </span>
                      <span className="ml-2 text-gray-400 line-through text-sm">
                        Rs {price}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-gray-900">
                      Rs {price}
                    </span>
                  )}
                  <div className="mt-1 text-xs text-gray-500 uppercase tracking-wide">
                   per event
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  About this {type}
                </h2>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>
            </div>

            {/* Features Section */}
            {type === "venue" && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <button
                  onClick={() => setIsFeatureActive(!isFeatureActive)}
                  className="w-full flex justify-between items-center group"
                >
                  <h2 className="text-lg font-semibold text-gray-900">
                    Venue Details
                  </h2>
                  {isFeatureActive ? (
                    <FiChevronUp className="text-gray-500 group-hover:text-gray-700 transition-colors" />
                  ) : (
                    <FiChevronDown className="text-gray-500 group-hover:text-gray-700 transition-colors" />
                  )}
                </button>

                {isFeatureActive && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <IoPeopleOutline className="text-gray-700 text-xl" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Capacity
                          </p>
                          <p className="font-medium text-gray-900">
                            {capacity} people
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <BsGrid1X2 className="text-gray-700 text-xl" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Area
                          </p>
                          <p className="font-medium text-gray-900">
                            {area} sqft
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <IoLocationOutline className="text-gray-700 text-xl" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Venue Type
                          </p>
                          <p className="font-medium text-gray-900 capitalize">
                            {venuetype}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Card Section */}
            {owner && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  About the{" "}
                  {type === "venue" ? "Venue Owner" : "Service Provider"}
                </h2>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                      {owner.avatar ? (
                        <img
                          src={owner.avatar}
                          alt="User avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiUser className="text-gray-400 text-2xl" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <Link to={`/userprofile/${userId}`}>
                      <h3 className="font-medium text-gray-900">
                        {owner.username}
                      </h3>
                    </Link>
                    {owner.email && (
                      <div className="flex items-center mt-1 text-gray-600 text-sm">
                        <FiMail className="mr-2 text-gray-400" />
                        <span>{owner.email}</span>
                      </div>
                    )}
                    {owner.phone && (
                      <div className="flex items-center mt-1 text-gray-600 text-sm">
                        <FiPhone className="mr-2 text-gray-400" />
                        <span>{owner.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={() => navigate(`/userprofile/${userId}`)}
                    className="w-full sm:w-1/2 bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center transition-colors"
                  >
                    <FiUser className="mr-2 text-lg" />
                    Visit Profile
                  </button>

                  <button
                    onClick={() => {
                      const currentUrl = window.location.href;
                      const message = `Hi, I’m interested in your listing! Here’s the link: ${currentUrl}`;
                      const url = `https://wa.me/${owner.phone}?text=${encodeURIComponent(message)}`;
                      window.open(url, "_blank");
                    }}
                    className="w-full sm:w-1/2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center transition-colors"
                  >
                    <BsWhatsapp className="mr-2 text-lg" />
                    Contact
                  </button>
                </div>
              </div>
            )}

            {/* Calendar Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Availability
                </h2>
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="text-gray-700 hover:text-gray-900 text-sm font-medium flex items-center transition"
                >
                  {showCalendar ? "Hide Calendar" : "Show Calendar"}
                  {showCalendar ? (
                    <FiChevronUp className="ml-1 h-5 w-5" />
                  ) : (
                    <FiChevronDown className="ml-1 h-5 w-5" />
                  )}
                </button>
              </div>

              {showCalendar && (
                <div className="w-full overflow-hidden rounded-lg border border-gray-200">
                  <FullCalendar
                    plugins={[timeGridPlugin, interactionPlugin]}
                    initialView="timeGridDay"
                    allDaySlot={false}
                    slotMinTime={operationalHours?.open || "00:00"}
                    slotMaxTime={
                      operationalHours?.close === "00:00"
                        ? "24:00"
                        : operationalHours?.close
                    }
                    height="auto"
                    events={events}
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "",
                    }}
                    selectable={false}
                    slotDuration="00:30:00"
                    slotLabelInterval="01:00:00"
                    dayCellDidMount={(info) => {
                      const date = info.date;
                      const dayName = date.toLocaleDateString("en-US", {
                        weekday: "long",
                      });

                      if (!operationalDays.includes(dayName)) {
                        info.el.style.backgroundColor = "#fef2f2";
                        info.el.style.opacity = "0.7";
                        info.el.style.position = "relative";

                        const label = document.createElement("div");
                        label.innerText = `${dayName} (Closed)`;
                        label.style.position = "absolute";
                        label.style.top = "5px";
                        label.style.left = "5px";
                        label.style.fontSize = "10px";
                        label.style.fontWeight = "bold";
                        label.style.color = "#b91c1c";
                        label.style.padding = "2px 4px";
                        label.style.borderRadius = "4px";

                        info.el.appendChild(label);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Action Buttons */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-6">
              {currentUser && currentUser._id === userId ? (
                <div className="space-y-3">
                  <button
                    onClick={() => navigate(`/update_post/${params.id}`)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-150 text-sm font-medium"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit Listing
                  </button>

                  <button
                    onClick={handlePostDelete}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 transition-colors duration-150 text-sm font-medium"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Delete Listing
                  </button>

                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-150 text-sm font-medium"
                  >
                    <FiUser className="w-4 h-4" />
                    View My Listings
                  </button>


                  <button
                    onClick={() => setshowBooking(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-150 text-sm font-medium"
                  >
                    <BookIcon className="w-4 h-4" />
                    Booking
                  </button>

                 
                </div>
              ) : (
                
                <div className="space-y-3">
                  <button
                    onClick={handleUrlShare}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-150 text-sm font-medium"
                  >
                    <FiShare2 className="w-4 h-4" />
                    Share This Listing
                  </button>
                   <button
                    onClick={() => setIsBookingDialogOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-150 text-sm font-medium"
                  >
                    <BookIcon className="w-4 h-4" />
                    Booking Request
                  </button>
                </div>
              )}
            </div>

            {/* Additional Info Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <FiClock className="mr-2 text-gray-500" />
                Listing Details
              </h3>
              <ul className="space-y-3">
                <li className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center text-sm">
                    <FiCalendar className="mr-2 text-gray-400" />
                    Posted On
                  </span>
                  <span className="font-medium text-gray-900 text-sm">
                    {createdAt
                      ? new Date(createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </li>
                <li className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center text-sm">
                    <FiCalendar className="mr-2 text-gray-400" />
                    Last Updated
                  </span>
                  <span className="font-medium text-gray-900 text-sm">
                    {updatedAt
                      ? new Date(updatedAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </li>
                {type === "venue" && (
                  <li className="flex justify-between py-2">
                    <span className="text-gray-600 flex items-center text-sm">
                      <IoLocationOutline className="mr-2 text-gray-400" />
                      Venue Type
                    </span>
                    <span className="font-medium text-gray-900 text-sm capitalize">
                      {venuetype}
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <BookingDialog
        isOpen={showBooking}
        closeModal={() => setshowBooking(false)}
        id={_id}
        operationHours={operationalHours}
        operationDays={operationalDays}
        price={offer ? discountPrice : price}
        type={type}
      ></BookingDialog>

      <RequestBookingDialog
        price={offer ? discountPrice : price}
        listingId={_id}
        type={type}
        isOpen={isBookingDialogOpen}
        onClose={() => setIsBookingDialogOpen(false)}
      />
    </div>
  );
};

export default ListingDetails;
