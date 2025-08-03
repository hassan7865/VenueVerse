import React, { useEffect, useState } from "react";
import ListingCard from "../Components/ListingCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import SkletonLoading from "./SkeletonLoading";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/Url";

const OfferedListing = () => {
  const [loading, setLoading] = useState(true);
  const [offerListings, setOfferListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/post?type=all&offer=true");
        setOfferListings(res.data.listings);
      } catch (error) {
        console.error("Error fetching offer listings:", error);
        const message =
          error.response?.data?.message || "Failed to load offer listings";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const SamplePrevArrow = ({ onClick }) => (
    <div
      className="absolute top-1/2 -left-4 z-10 p-3 rounded-full bg-white/90 flex items-center justify-center cursor-pointer shadow-lg hover:bg-amber-500 hover:text-white transition-all duration-300 transform -translate-y-1/2"
      onClick={onClick}
    >
      <BsArrowLeft className="text-amber-500 text-xl group-hover:text-white" />
    </div>
  );

  const SampleNextArrow = ({ onClick }) => (
    <div
      className="absolute top-1/2 -right-4 z-10 p-3 rounded-full bg-white/90 flex items-center justify-center cursor-pointer shadow-lg hover:bg-amber-500 hover:text-white transition-all duration-300 transform -translate-y-1/2"
      onClick={onClick}
    >
      <BsArrowRight className="text-amber-500 text-xl group-hover:text-white" />
    </div>
  );

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
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          arrows: false,
          centerMode: false, // Disabled center mode
          centerPadding: "0px", // Removed padding
          variableWidth: false, // Ensure consistent width
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          arrows: false,
          centerMode: false, // Disabled center mode
          centerPadding: "0px", // Removed padding
          variableWidth: false, // Ensure consistent width
        },
      },
    ],
  };

  return (
    <section className="bg-gradient-to-b from-amber-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight relative inline-block">
            <span className="relative z-10">
              Enjoy Our{" "}
              <span className="text-amber-500">Exciting Discount</span>
            </span>
            <span className="absolute inset-x-0 bottom-1 w-1/2 h-1 bg-amber-300 opacity-30 rounded-full mx-auto z-0"></span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-medium">
            Discover exclusive deals on the best venues and services for your
            events. Save big while planning big!
          </p>
        </div>

        {/* Slider */}
        <div className="relative">
          {loading ? (
            <SkletonLoading />
          ) : (
            <div className="relative group">
              {/* Desktop/Tablet Slider */}
              <div className="hidden sm:block">
                <Slider {...settings} className="px-2">
                  {offerListings?.map((listing) => (
                    <div key={listing._id} className="px-2 py-4">
                      <ListingCard listing={listing} />
                    </div>
                  ))}
                </Slider>
              </div>

              {/* Mobile Grid Layout */}
              <div className="block sm:hidden">
                <div className="grid grid-cols-1 gap-6 px-4">
                  {offerListings?.slice(0, 3).map((listing) => (
                    <div key={listing._id} className="w-full">
                      <ListingCard listing={listing} />
                    </div>
                  ))}
                </div>
                
               
                
              </div>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/search")}
            className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-brand-blue transition-all bg-transparent border-2 border-brand-blue rounded-full group"
          >
            <span className="absolute inset-0 w-0 group-hover:w-full bg-brand-blue transition-all duration-300 ease-out z-0 rounded-full"></span>
            <span className="relative z-10 w-full text-left text-brand-blue group-hover:text-white transition-colors duration-300 ease-in-out flex items-center">
              Explore more
              <BsArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default OfferedListing;