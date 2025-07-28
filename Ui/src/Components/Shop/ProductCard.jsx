import React from "react";
import {
  FaTag,
  FaBox,
  FaStar,
  FaShoppingCart,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { FaBoxesStacked } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import UserProfile from "../../../UserProfile";

const ProductCard = ({ product, handleShopItemDelete }) => {
  const {
    name,
    description,
    price,
    category,
    images,
    stock,
    isFeatured,
    _id,
    userId,
  } = product;

  const navigate = useNavigate();
  const currentUser = UserProfile.GetUserData();

  return (
    <div
      onClick={() => {
        navigate(`/item/${_id}`);
      }}
      className="relative flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-md transition duration-300 border h-full"
    >
      {/* Image */}
      <div className="relative h-48 sm:h-56 md:h-60 w-full overflow-hidden cursor-pointer">
        <img
          src={images[0]?.url || "/placeholder-image.jpg"}
          alt={images[0]?.alt || name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute bottom-2 right-2 flex items-center bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          <FaBox className="mr-1" />
          {images.length}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 flex flex-col justify-between px-4 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-4">
        <div>
          <span className="text-xs font-semibold text-brand-blue bg-blue-100 px-2 py-1 rounded-full">
            {category.toUpperCase()}
          </span>

          <div
            onClick={() => navigate(`/product/${_id}`)}
            className="cursor-pointer mt-3"
          >
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 hover:text-brand-blue line-clamp-1 transition">
              {name}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {description}
            </p>
          </div>

          {/* Stock Status */}
          <div className="flex items-start mt-3 text-sm text-gray-600">
            <FaBoxesStacked className="mr-2 text-brand-blue mt-0.5" />
            <p className="line-clamp-1">{stock} units available</p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <FaTag className="text-brand-blue" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm font-medium text-gray-800 capitalize">
                  {category}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <FaBox className="text-brand-blue" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Stock</p>
                <p
                  className={`text-sm font-medium ${stock === 0 ? "text-red-600" : stock <= 5 ? "text-orange-600" : "text-green-600"}`}
                >
                  {stock === 0
                    ? "Out of Stock"
                    : stock <= 5
                      ? "Low Stock"
                      : "In Stock"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Price + Featured */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div>
            <div className="flex items-baseline">
              <p className="text-lg sm:text-xl font-bold text-brand-blue">
                Rs{price.toLocaleString()}
              </p>
            </div>
          </div>

          {isFeatured && (
            <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-md text-sm text-gray-600">
              <FaStar className="mr-2 text-brand-blue" />
              Featured
            </div>
          )}
        </div>
        {currentUser?._id == userId && (
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/update_shopitem/${_id}`);
              }}
              className="flex w-full sm:w-auto items-center justify-center bg-white border border-blue-600 text-brand-blue hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <FaEdit className="mr-2" />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShopItemDelete(_id)
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

export default ProductCard;
