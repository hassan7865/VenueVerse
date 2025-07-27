import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaShoppingCart,
  FaStar,
  FaTag,
  FaBox,
  FaEdit,
  FaTrash,
  FaHeart,
} from "react-icons/fa";
import { FaBoxesStacked } from "react-icons/fa6";
import api from "../lib/Url";
import Loading from "../Components/Loading";
import UserProfile from "../../UserProfile";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  const addToCart = (product, productId) => {
    console.log("Added to cart:", product, productId);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/product/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
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
  } = product;

  const formatPrice = (amount) => `Rs ${amount.toLocaleString()}`;

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

  return (
    <section className="pt-8 pb-12 lg:py-16 min-h-screen">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-brand-blue hover:text-brand-blue mb-8 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Products
        </button>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Image Section */}
          <div className="flex-1 relative">
            <img
              className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-lg"
              src={images[selectedImageIndex]?.url || "/no-image.jpg"}
              alt={images[selectedImageIndex]?.alt || name}
            />

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto mt-4">
                {images.map((image, index) => (
                  <img
                    key={index}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition-all ${
                      selectedImageIndex === index
                        ? "ring-2 ring-blue-600 ring-offset-2"
                        : "hover:opacity-80"
                    }`}
                    src={image.url}
                    alt={image.alt || `${name} view ${index + 1}`}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex-1 lg:max-w-lg">
            <span className="text-xs font-semibold text-brand-blue bg-blue-100 px-3 py-1 rounded-full uppercase">
              {category}
            </span>

            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-4 mb-4">
              {name}
            </h1>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold text-brand-blue">
                  {formatPrice(price)}
                </span>
              </div>
            </div>

            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-6 ${stockStatus.bgColor} ${stockStatus.color}`}
            >
              <FaBoxesStacked className="mr-2" />
              {stockStatus.text} • {stock} units available
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
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
                  <p className="text-xs text-gray-500">Availability</p>
                  <p className={`text-sm font-medium ${stockStatus.color}`}>
                    {stockStatus.text}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                {currentUser._id != product.userId && (
                  <button
                    onClick={() => addToCart(product, product._id)}
                    disabled={stock === 0}
                    className={`flex-1 flex items-center justify-center py-3 px-6 rounded-lg font-medium transition-colors ${
                      stock === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-brand-blue hover:bg-brand-blue text-white"
                    }`}
                  >
                    <FaShoppingCart className="mr-2" />
                    {stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => navigate(`/update_shopitem/${product._id}`)}
                  className="flex-1 flex items-center justify-center bg-white border border-blue-600 text-brand-blue hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  <FaEdit className="mr-2" />
                  Edit Product
                </button>
                <button
                  onClick={() => console.log("Delete product:", product._id)}
                  className="flex-1 flex items-center justify-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  <FaTrash className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
