import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative h-[800px] bg-gray-100 py-20 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80" 
          alt="Party decorations showcase"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      <div className="container mx-auto flex justify-around h-full relative z-10">
        {/* Text content */}
        <div className="flex flex-col justify-center max-w-2xl">
          <div className="font-semibold flex items-center uppercase mb-4">
            <div className="w-10 h-[2px] mr-3 bg-brand-blue"></div>
            <span className="tracking-widest text-white">Event Essentials</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight  text-white">
            Everything You Need <br />
            <span className="text-brand-blue-light">For Perfect Events</span>
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-gray-100">
            Shop premium decorations, tableware, and party supplies for weddings, birthdays, and corporate events.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to={'/shop'} 
              className='px-8 py-4 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold rounded-lg text-center transition duration-300 transform hover:scale-105'
            >
              Shop Now
            </Link>
            <Link 
              to={'/collections'} 
              className='px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold rounded-lg text-center transition duration-300'
            >
              Browse Collections
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 flex flex-wrap gap-6 items-center">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-brand-blue mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white">Free Shipping Over $50</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-brand-blue mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white">1000+ Happy Customers</span>
            </div>
          </div>
        </div>

        {/* Product showcase */}
        <div className="hidden lg:flex items-center">
          <div className="relative w-80 h-80 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-white border-opacity-30">
            <img 
              src="https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Featured decoration set"
              className="w-full h-full object-cover rounded-lg"
            />
          
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;