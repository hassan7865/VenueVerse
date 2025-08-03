import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductListingCard from "../Components/Shop/ListingProductCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
  FiArrowRight,
  FiSearch,
  FiPlusCircle,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import api from "../lib/Url";
import Loading from "../Components/Loading";
import EventHero from "../Components/Shop/Hero";
import ShopHero from "../Components/Shop/Hero";

const EventDecorCategories = [
  "Lighting & Effects",
  "Floral Decoration",
  "Table Decoration",
  "Dining Setup",
  "Other",
];

// Custom Arrow Components for Slider
const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110 -ml-6"
  >
    <FiChevronLeft className="w-5 h-5 text-gray-700" />
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110 -mr-6"
  >
    <FiChevronRight className="w-5 h-5 text-gray-700" />
  </button>
);

const Shop = () => {
  const navigate = useNavigate();
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState({});

  // Slider settings
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Fetch products for all categories
  const fetchAllCategories = async () => {
    setLoading(true);
    try {
      const promises = EventDecorCategories.map((category) =>
        fetchProductsByCategory(category)
      );
      await Promise.all(promises);
    } catch (err) {
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products for a specific category
  const fetchProductsByCategory = async (category) => {
    try {
      setCategoryLoading((prev) => ({ ...prev, [category]: true }));
      const res = await api.get("/product", { params: { category } });
      setCategoryProducts((prev) => ({
        ...prev,
        [category]: res.data.products,
      }));
    } catch (err) {
      console.error(`Error fetching ${category} products:`, err);
      setCategoryProducts((prev) => ({
        ...prev,
        [category]: [],
      }));
    } finally {
      setCategoryLoading((prev) => ({ ...prev, [category]: false }));
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const CategoryIcon = ({ category }) => {
    const iconMap = {
      "Lighting & Effects": (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      "Floral Decoration": (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2m-4-4V5m0 4h4m-4 0H3"
          />
        </svg>
      ),
      "Table Decoration": (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
      "Dining Setup": (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
          />
        </svg>
      ),
      Other: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    };
    return iconMap[category] || iconMap["Other"];
  };

  const LoadingSpinner = ({ text = "Loading..." }) => (
    <div className="flex flex-col items-center justify-center py-12">
      <Loading />
      <p className="mt-4 text-brand-blue font-medium">{text}</p>
    </div>
  );

  return (
    <div className="font-sans antialiased text-gray-900 bg-white">
      {/* Hero Section */}
      <ShopHero />

      {/* Category Sections */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-20 py-16">
          {EventDecorCategories.map((category) => (
            <section key={category} className="bg-white">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Category Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <CategoryIcon category={category} />
                    </div>
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">
                        {category}
                      </h2>
                      {categoryProducts[category]?.length > 0 && (
                        <p className="text-gray-600 text-sm mt-1">
                          {categoryProducts[category].length} products available
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Products Slider */}
                {categoryLoading[category] ? (
                  <LoadingSpinner text={`Loading ${category}...`} />
                ) : categoryProducts[category]?.length > 0 ? (
                  <div className="relative">
                    <Slider {...sliderSettings}>
                      {categoryProducts[category].map((product) => (
                        <div key={product._id} className="px-3">
                          <ProductListingCard product={product} />
                        </div>
                      ))}
                    </Slider>

                    {/* View More Button */}
                    <div className="flex justify-center mt-8">
                      <button
                        onClick={() => navigate(`/search_shop`)}
                        className="group inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        View More {category}
                        <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-gray-200 rounded-full">
                        <CategoryIcon category={category} />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-600 mb-2">
                          No products available
                        </p>
                        <p className="text-gray-500 text-sm">
                          Be the first to list products in {category}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate("/create_post")}
                        className="mt-4 inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <FiPlusCircle className="mr-2 w-4 h-4" />
                        List Product
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-gray-50 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-600">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Become a Seller
                </div>
                <h2 className="text-4xl font-light text-gray-900 leading-tight">
                  Join Our
                  <span className="block font-medium">Premium Marketplace</span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  List your event decor products on our platform and reach
                  thousands of customers looking for quality items.
                </p>
              </div>

              <button
                onClick={() => navigate("/create_post")}
                className="group inline-flex items-center px-8 py-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Selling
                <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-20 blur-xl"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] bg-gray-200">
                <img
                  src="https://www.reveriesocial.com/wp-content/uploads/2024/01/Bold-Color-Maximalist.webp"
                  alt="Selling products"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1770&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-brand-blue "></div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                Get Started Today
              </div>
              <h2 className="text-4xl lg:text-5xl font-light text-white leading-tight">
                Ready to Elevate Your
                <span className="block font-medium bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                  Event Decor?
                </span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                Browse our collection or join as a seller to be part of our
                premium marketplace.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/search_shop")}
                className="group inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Browse Products
                <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate("/create_shopitem")}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/20 text-white font-medium rounded-lg hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
              >
                <FiPlusCircle className="mr-2 w-5 h-5" />
                List Your Products
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;
