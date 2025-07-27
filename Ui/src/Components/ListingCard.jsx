import React from "react";
import { FaChartArea, FaLocationArrow } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserProfile from "../../UserProfile";
import { FaLocationDot, FaPeopleGroup } from "react-icons/fa6";

const ListingCard = ({ listing }) => {
  const currentUser = UserProfile.GetUserData();
  const navigate = useNavigate();
  const {
    area,
    venuetype,
    capacity,
    address,
    price,
    title,
    type,
    _id,
    userId,
    imgUrl,
    offer,
  } = listing;

  const discountPercentage = 20;
  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("PKR", "PKR ");
  };

  const discountPrice = offer
    ? price - (price * discountPercentage) / 100
    : price;

 

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg group cursor-pointer h-full flex flex-col min-h-[520px]">
      {/* Image Container */}
      <div
        className="relative overflow-hidden h-48 w-full rounded-t-lg flex-shrink-0"
        onClick={() => navigate(`/listing/${_id}`)}
      >
        <img
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={imgUrl[0]?.path || "/placeholder-image.jpg"}
          alt={title}
          loading="lazy"
        />

        {/* Type Badge */}
        <div className="absolute top-3 left-3 bg-white text-gray-700 text-xs font-medium px-3 py-1.5 rounded-md shadow-sm border capitalize">
          {type}
        </div>

        {/* Discount Badge */}
        {offer && (
          <div className="absolute top-3 right-3 bg-brand-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm">
            {discountPercentage}% OFF
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Title */}
        <div onClick={() => navigate(`/listing/${_id}`)} className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-brand-blue-600 transition-colors duration-200">
            {title}
          </h3>
        </div>

        {/* Information Section */}
        <div className="mb-4 min-h-[60px]">
          {type === "venue" ? (
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <FaLocationDot className="mr-3 text-brand-blue-600 flex-shrink-0" size={14} />
                <span className="line-clamp-1">{venuetype || "Venue"}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FaLocationArrow className="mr-3 text-brand-blue-600 flex-shrink-0" size={14} />
                <span className="line-clamp-1">{address || "Address not specified"}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <FaLocationArrow className="mr-3 text-brand-blue-600 flex-shrink-0" size={14} />
                <span className="line-clamp-1">{address || "Service location"}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FaLocationDot className="mr-3 text-brand-blue-600 flex-shrink-0" size={14} />
                <span className="line-clamp-1">Professional Service</span>
              </div>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="flex gap-4 mb-4 text-sm text-gray-600 min-h-[40px]">
          {type === "venue" ? (
            <>
              <div className="flex items-center">
                <FaPeopleGroup className="mr-2 text-brand-blue-600" size={14} />
                <span>{capacity || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <FaChartArea className="mr-2 text-brand-blue-600" size={14} />
                <span>{area || "N/A"} sqft</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center">
                <FaPeopleGroup className="mr-2 text-brand-blue-600" size={14} />
                <span>Available</span>
              </div>
              <div className="flex items-center">
                <FaChartArea className="mr-2 text-brand-blue-600" size={14} />
                <span>On-demand</span>
              </div>
            </>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Price Section */}
        <div className="pt-4 border-t border-gray-100 mb-4">
          {offer ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl font-semibold text-brand-blue-600">{formatPrice(discountPrice)}</span>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  {discountPercentage}% OFF
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 line-through">{formatPrice(price)}</span>
                <span className="text-green-600 font-medium">
                  Save {formatPrice(price - discountPrice)}
                </span>
              </div>
            </div>
          ) : (
            <div>
              <span className="text-xl font-semibold text-brand-blue-600">{formatPrice(price)}</span>
            </div>
          )}
        </div>

      
      
      </div>
    </div>
  );
};

export default ListingCard;
