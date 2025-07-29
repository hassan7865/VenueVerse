import React from "react";
import {
  FaBath,
  FaBed,
  FaCamera,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaStar,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserProfile from "../../UserProfile";

const PostCard = ({ postInfo }) => {
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
    imgUrl,
  } = postInfo.post;

  const navigate = useNavigate();
  const currentUser = UserProfile.GetUserData();
  const discountPercent = offer
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  return (
    <div className="relative flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-md transition duration-300 border h-full">
      {/* Offer Ribbon */}
      {offer && (
        <div className="absolute top-3 right-3 z-10">
          <span className="flex items-center bg-brand-blue text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
            <FaStar className="mr-1" />
            {discountPercent}% OFF
          </span>
        </div>
      )}

      {/* Image */}
      <div
        onClick={() => navigate(`/listing/${_id}`)}
        className="relative h-48 sm:h-56 md:h-60 w-full overflow-hidden cursor-pointer"
      >
        {imgUrl?.[0] &&
        (imgUrl[0].type?.startsWith("video") ||
          /\.(mp4|webm|mov)$/i.test(imgUrl[0].path)) ? (
          <video
            src={imgUrl[0].path}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={imgUrl?.[0]?.path || "/placeholder-image.jpg"}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        )}

        <div className="absolute bottom-2 right-2 flex items-center bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          <FaCamera className="mr-1" />
          {imgUrl.length}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 flex flex-col justify-between px-4 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-4">
        <div>
          <span className="text-xs font-semibold text-brand-blue bg-blue-100 px-2 py-1 rounded-full">
            {type.toUpperCase()}
          </span>

          <div
            onClick={() => navigate(`/listing/${_id}`)}
            className="cursor-pointer mt-3"
          >
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 hover:text-brand-blue line-clamp-1 transition">
              {title}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {description}
            </p>
          </div>

          {/* Address */}
          {type === "venue" && (
            <div className="flex items-start mt-3 text-sm text-gray-600">
              <FaMapMarkerAlt className="mr-2 text-brand-blue mt-0.5" />
              <p className="line-clamp-1">{address}</p>
            </div>
          )}

          {/* Features */}
          {type === "venue" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <FaBed className="text-brand-blue" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Capacity</p>
                  <p className="text-sm font-medium text-gray-800">
                    {capacity}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <FaBath className="text-brand-blue" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Venue Type</p>
                  <p className="text-sm font-medium text-gray-800 capitalize">
                    {venuetype}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Price + Area */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div>
            <div className="flex items-baseline">
              <p className="text-lg sm:text-xl font-bold text-brand-blue">
                Rs
                {offer
                  ? discountPrice.toLocaleString()
                  : price.toLocaleString()}
              </p>
            </div>
            {offer && (
              <p className="text-xs text-gray-400 line-through">
                Rs{price.toLocaleString()}
              </p>
            )}
          </div>

          {type === "venue" && (
            <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-md text-sm text-gray-600">
              <FaRulerCombined className="mr-2 text-brand-blue" />
              {area?.toLocaleString() || 0} sqft
            </div>
          )}
        </div>

        {currentUser?._id == postInfo.post.userId && (
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/update_post/${_id}`);
              }}
              className="flex w-full sm:w-auto items-center justify-center bg-white border border-blue-600 text-brand-blue hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <FaEdit className="mr-2" />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                postInfo.handlePostDelete(_id, type);
              }}
              className="flex w-full sm:w-auto items-center justify-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <FaTrash className="mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
