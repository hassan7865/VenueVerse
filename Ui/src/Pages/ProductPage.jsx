import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaShoppingCart,
  FaStar,
  FaTag,
  FaBox,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { FaBoxesStacked } from "react-icons/fa6";
import Loading from "../Components/Loading";
import UserProfile from "../../UserProfile";
import api from "../lib/Url";
import ReviewComponent from "../Components/Reviews";
import MediaViewer from "../Components/MediaViewer";
import { CartContext } from "../context/cart";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviews, setreviews] = useState([]);
  const [product, setProduct] = useState(null);
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          api.get(`/product/${id}`),
          api.get(`/review?type=product&sourceId=${id}`),
        ]);

        setProduct(productRes.data);
        setreviews(reviewsRes.data.reviews);
      } catch (err) {
        console.error("Failed to load product or reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const currentUser = UserProfile.GetUserData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loading />
          <p className="font-heading text-slate-900 text-lg sm:text-2xl mt-4">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  const {
    name = "Unnamed Product",
    price = 0,
    description = "No description",
    images = [],
    category = "Uncategorized",
    stock = 0,
    user = {},
  } = product;

  const formatPrice = (amount) => `Rs ${amount.toLocaleString()}`;

    const { addToCart } = useContext(CartContext);

  const getStockStatus = () => {
    if (stock === 0)
      return {
        text: "Out of Stock",
        color: "text-red-600",
        bgColor: "bg-red-50",
      };
    if (stock <= 5)
      return {
        text: "Low Stock",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      };
    return {
      text: "In Stock",
      color: "text-green-600",
      bgColor: "bg-green-50",
    };
  };

  const stockStatus = getStockStatus();
  const isOwner = currentUser?._id === product.userId;

  return (
    <>
      <section className="pt-6 pb-12 lg:py-16 min-h-screen overflow-y-auto">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Back Button - Adjusted for mobile */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-brand-blue hover:text-brand-blue mb-6 sm:mb-8 transition-colors text-sm sm:text-base"
          >
            <FaArrowLeft className="mr-2" />
            Back to Products
          </button>

          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12">
            {/* Image Section - Mobile first */}
            <div className="w-full lg:flex-1">
              {/* Main Image */}
              <MediaViewer url={images[selectedImageIndex]?.url}>
                 <div className="relative aspect-square w-full sm:h-96 lg:h-[500px]">
                <img
                  className="w-full h-full object-cover rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg"
                  src={images[selectedImageIndex]?.url || "/no-image.jpg"}
                  alt={images[selectedImageIndex]?.alt || name}
                />
              </div>
              </MediaViewer>
             

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex gap-2 sm:gap-3 overflow-x-auto mt-3 sm:mt-4 pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all ${
                        selectedImageIndex === index
                          ? "ring-2 ring-brand-blue ring-offset-2"
                          : "hover:opacity-80"
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        className="w-full h-full object-cover"
                        src={image.url}
                        alt={image.alt || `${name} view ${index + 1}`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="w-full lg:flex-1 lg:max-w-lg">
              {/* Category Tag */}
              <span className="text-xs sm:text-sm font-semibold text-brand-blue bg-blue-100 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full uppercase">
                {category}
              </span>

              {/* Product Title */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-3 sm:mt-4 mb-3 sm:mb-4">
                {name}
              </h1>

              {/* Price */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <span className="text-2xl sm:text-3xl font-bold text-brand-blue">
                    {formatPrice(price)}
                  </span>
                </div>
              </div>

              {/* Stock Status */}
              <div
                className={`inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 ${stockStatus.bgColor} ${stockStatus.color}`}
              >
                <FaBoxesStacked className="mr-1 sm:mr-2" />
                {stockStatus.text} • {stock} units available
              </div>

              {/* Info Cards - Stack on mobile, grid on larger screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex items-center space-x-2 sm:space-x-3 bg-gray-50 rounded-lg p-2 sm:p-3">
                  <div className="p-1.5 sm:p-2 bg-blue-100 rounded-full">
                    <FaTag className="text-brand-blue text-sm sm:text-base" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="text-xs sm:text-sm font-medium text-gray-800 capitalize">
                      {category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 bg-gray-50 rounded-lg p-2 sm:p-3">
                  <div className="p-1.5 sm:p-2 bg-blue-100 rounded-full">
                    <FaBox className="text-brand-blue text-sm sm:text-base" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Availability</p>
                    <p
                      className={`text-xs sm:text-sm font-medium ${stockStatus.color}`}
                    >
                      {stockStatus.text}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                  Description
                </h3>
                <div className="max-h-32 sm:max-h-40 overflow-y-auto pr-2">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                    {description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 sm:space-y-4">
                {!isOwner && (
                  <button
                    onClick={() => addToCart(product, product._id)}
                    disabled={stock === 0}
                    className={`w-full flex items-center justify-center py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                      stock === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-brand-blue hover:bg-brand-blue/90 text-white"
                    }`}
                  >
                    <FaShoppingCart className="mr-2" />
                    {stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                )}
              </div>

              {/* Seller Info - Only show if user exists */}
              {user && (
                <div className="mt-8 sm:mt-10 border-t pt-4 sm:pt-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Seller Information
                  </h3>
                  <div className="flex items-center gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-lg shadow-sm">
                    <img
                      src={user.avatar || "/default-profile.png"}
                      alt={user.username || "Seller"}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {user.username || "Unknown Seller"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email || "No Email"}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/userprofile/${user._id}`)}
                      className="text-xs sm:text-sm text-brand-blue border border-blue-600 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full hover:bg-blue-50 transition-colors whitespace-nowrap"
                    >
                      Visit Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <ReviewComponent
        sourceId={id}
        type="product"
        existingReviews={reviews || []}

      />
    </>
  );
};

export default ProductDetails;
