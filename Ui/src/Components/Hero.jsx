import React from 'react';
import { ArrowRight, MapPin, Calendar, Users } from 'lucide-react';
import { venueImages } from '../lib/data';
import {useNavigate} from 'react-router-dom'

const VenueHero = () => {
  const navigate = useNavigate()
  const handleSearch = () => {
    navigate("/search")
  };

  const handleListVenue = () => {
    navigate("/create_post")
  };

 
  // Triple the array for longer seamless loop
  const infiniteImages = [...venueImages, ...venueImages, ...venueImages];

  return (
    <section className="relative min-h-screen overflow-hidden bg-white">
      
      {/* Infinite Sliding Background - Multiple Layers */}
      <div className="absolute inset-0">
        
        {/* Top row - slides right to left */}
        <div className="absolute top-0 left-0 w-full h-1/3 overflow-hidden opacity-100">
          <div className="flex" style={{
            width: `${infiniteImages.length * 400}px`,
            animation: 'slideLeft 80s linear infinite'
          }}>
            {infiniteImages.map((image, index) => (
              <div key={index} className="w-96 xl:w-[450px] 2xl:w-[500px] h-full flex-shrink-0 relative mx-2 xl:mx-3 2xl:mx-4">
                <img
                  src={image}
                  alt="Premium Venue"
                  className="w-full h-full object-cover rounded-lg xl:rounded-xl"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Middle row - slides left to right */}
        <div className="absolute top-1/3 left-0 w-full h-1/3 overflow-hidden opacity-95">
          <div className="flex" style={{
            width: `${infiniteImages.length * 400}px`,
            animation: 'slideRight 90s linear infinite'
          }}>
            {infiniteImages.slice(4).map((image, index) => (
              <div key={index} className="w-96 xl:w-[450px] 2xl:w-[500px] h-full flex-shrink-0 relative mx-2 xl:mx-3 2xl:mx-4">
                <img
                  src={image}
                  alt="Event Decoration"
                  className="w-full h-full object-cover rounded-lg xl:rounded-xl"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row - slides right to left */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 overflow-hidden opacity-90">
          <div className="flex" style={{
            width: `${infiniteImages.length * 400}px`,
            animation: 'slideLeft 70s linear infinite'
          }}>
            {infiniteImages.slice(8).map((image, index) => (
              <div key={index} className="w-96 xl:w-[450px] 2xl:w-[500px] h-full flex-shrink-0 relative mx-2 xl:mx-3 2xl:mx-4">
                <img
                  src={image}
                  alt="Venue Setup"
                  className="w-full h-full object-cover rounded-lg xl:rounded-xl"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Elegant blended overlay with brand color */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/75 via-white/40 to-transparent" />
        <div 
          className="absolute inset-0 opacity-30" 
          style={{ 
            background: `linear-gradient(135deg, rgba(49, 58, 103, 0.4) 0%, transparent 50%, rgba(49, 58, 103, 0.2) 100%)` 
          }} 
        />
        <div 
          className="absolute bottom-0 left-0 right-0 h-32 xl:h-40 2xl:h-48" 
          style={{ 
            background: `linear-gradient(to top, rgba(49, 58, 103, 0.1), transparent)` 
          }} 
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl xl:max-w-8xl 2xl:max-w-[1600px] mx-auto px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center min-h-screen py-20 xl:py-24 2xl:py-32">
          
          {/* Centered Content */}
          <div className="w-full max-w-3xl xl:max-w-4xl 2xl:max-w-5xl space-y-12 xl:space-y-16 2xl:space-y-20">
            
            {/* Main Heading */}
            <div className="space-y-8 xl:space-y-10 2xl:space-y-12">
              <h1 className="text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-light text-gray-900 leading-[1.05] tracking-tight">
                Exceptional venues
                <span className="block font-medium" style={{ color: '#313A67' }}>
                  for extraordinary
                </span>
                <span className="block font-light text-gray-900">
                  moments
                </span>
              </h1>
              <p className="text-2xl xl:text-3xl 2xl:text-4xl text-gray-700 leading-relaxed font-light max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
                Discover curated venues and premium services that transform your vision into unforgettable experiences.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 xl:gap-8 pt-8 xl:pt-12">
              <button
                onClick={handleSearch}
                className="group flex items-center justify-center px-12 xl:px-16 2xl:px-20 py-5 xl:py-6 2xl:py-7 text-white font-medium text-lg xl:text-xl 2xl:text-2xl rounded-xl xl:rounded-2xl transition-all shadow-lg hover:shadow-xl"
                style={{ backgroundColor: '#313A67' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2A2F5A'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#313A67'}
              >
                <span className="flex items-center space-x-3 xl:space-x-4">
                  <span className='text-white'>Explore Venues</span>
                  <ArrowRight className="w-6 h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button
                onClick={handleListVenue}
                className="flex items-center justify-center px-12 xl:px-16 2xl:px-20 py-5 xl:py-6 2xl:py-7 border-2 text-gray-700 font-medium text-lg xl:text-xl 2xl:text-2xl rounded-xl xl:rounded-2xl hover:bg-gray-50 transition-all"
                style={{ borderColor: '#313A67' }}
              >
                List Your Space
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Custom CSS for animations - Responsive */}
      <style jsx>{`
        @keyframes slideRight {
          0% { transform: translateX(-33.33%); }
          100% { transform: translateX(0%); }
        }
        
        @keyframes slideLeft {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }

        /* Larger screen optimizations */
        @media (min-width: 1280px) {
          .flex[style*="slideLeft"], .flex[style*="slideRight"] {
            width: ${infiniteImages.length * 450}px !important;
          }
        }

        @media (min-width: 1536px) {
          .flex[style*="slideLeft"], .flex[style*="slideRight"] {
            width: ${infiniteImages.length * 500}px !important;
          }
        }

        /* Ultra-wide screen support */
        @media (min-width: 1920px) {
          .flex[style*="slideLeft"], .flex[style*="slideRight"] {
            width: ${infiniteImages.length * 550}px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default VenueHero;