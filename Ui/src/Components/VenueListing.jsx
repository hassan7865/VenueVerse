import React, { useEffect, useState } from "react";
import ListingCard from "../Components/ListingCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { BsArrowRight, BsArrowLeft, BsSearch } from "react-icons/bs";
import SkletonLoading from "./SkeletonLoading";
import { useNavigate } from "react-router-dom";
import api from "../lib/Url";
import toast from "react-hot-toast";

const VenueListing = () => {
  const [loading, setLoading] = useState(true);
  const [venueListing, setvenueListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/post?type=venue");
        setvenueListings(res.data.listings);
      } catch (error) {
        console.error("Error fetching venue listings:", error);
        const message =
          error.response?.data?.message || "Failed to load venue listings";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Custom Arrow Components
  const SamplePrevArrow = ({ onClick }) => {
    return (
      <div
        className="absolute top-1/2 -left-4 z-10 p-3 rounded-full bg-white/90 flex items-center justify-center cursor-pointer shadow-lg hover:bg-brand-blue hover:text-white transition-all duration-300 transform -translate-y-1/2"
        onClick={onClick}
      >
        <BsArrowLeft className="text-brand-blue text-xl group-hover:text-white" />
      </div>
    );
  };

  const SampleNextArrow = ({ onClick }) => {
    return (
      <div
        className="absolute top-1/2 -right-4 z-10 p-3 rounded-full bg-white/90 flex items-center justify-center cursor-pointer shadow-lg hover:bg-brand-blue hover:text-white transition-all duration-300 transform -translate-y-1/2"
        onClick={onClick}
      >
        <BsArrowRight className="text-brand-blue text-xl group-hover:text-white" />
      </div>
    );
  };
const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  responsive: [
    {
      breakpoint: 1280,
      settings: { 
        slidesToShow: 3 
      },
    },
    {
      breakpoint: 1024,
      settings: { 
        slidesToShow: 2 
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        arrows: false,
        centerMode: true,
        centerPadding: "40px",
      },
    },
  ],
};
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-14">
          <h2 className="relative inline-block text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            <span className="relative z-10">
              Explore Our{" "}
              <span className="text-brand-blue">Venue Collection</span>
            </span>
            <span className="absolute left-1/2 bottom-0 w-2/3 h-2 bg-brand-blue/20 -translate-x-1/2 rounded-full -z-10"></span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Discover stunning spaces perfect for{" "}
            <span className="font-medium text-brand-blue">weddings</span>,
            <span className="font-medium text-brand-blue"> conferences</span>,
            and{" "}
            <span className="font-medium text-brand-blue">
              special celebrations
            </span>
            . Your ideal venue awaits!
          </p>
        </div>

        {/* Search CTA */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div
            className="flex items-center bg-white rounded-full shadow-md px-6 py-3 border border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-300 group"
            onClick={() => navigate("/search")}
          >
            <BsSearch className="text-gray-400 group-hover:text-brand-blue transition-colors duration-200 mr-3 text-lg" />
            <span className="text-gray-500 group-hover:text-brand-blue transition-colors duration-200">
              Search venues by location, capacity, or amenities...
            </span>
          </div>
        </div>

        {/* Listings Section */}
        <div className="mb-12 relative">
          {loading ? (
            <SkletonLoading />
          ) : (
            <div className="relative group">
              <Slider {...settings} className="px-2">
                {venueListing?.map((listing) => (
                  <div key={listing._id} className="px-2 py-4">
                    <ListingCard listing={listing} />
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </div>

        {/* View More Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/search")}
            className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-brand-blue transition-all bg-transparent border-2 border-brand-blue rounded-full group"
          >
            <span className="absolute inset-0 w-0 group-hover:w-full bg-brand-blue transition-all duration-300 ease-out z-0 rounded-full"></span>
            <span className="relative z-10 w-full text-left text-brand-blue group-hover:text-white transition-colors duration-300 ease-in-out flex items-center">
              View All Venues
              <BsArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default VenueListing;
