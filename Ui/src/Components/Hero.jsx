import React from 'react';
import { ArrowRight, MapPin, Calendar, Users } from 'lucide-react';
import { venueImages } from '../lib/data';

const VenueHero = () => {
  const handleSearch = () => {
    console.log('Navigate to search page');
  };

  const handleListVenue = () => {
    console.log('Navigate to list venue page');
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
            width: `${infiniteImages.length * 350}px`,
            animation: 'slideLeft 80s linear infinite'
          }}>
            {infiniteImages.map((image, index) => (
              <div key={index} className="w-80 h-full flex-shrink-0 relative mx-2">
                <img
                  src={image}
                  alt="Premium Venue"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Middle row - slides left to right */}
        <div className="absolute top-1/3 left-0 w-full h-1/3 overflow-hidden opacity-95">
          <div className="flex" style={{
            width: `${infiniteImages.length * 350}px`,
            animation: 'slideRight 90s linear infinite'
          }}>
            {infiniteImages.slice(4).map((image, index) => (
              <div key={index} className="w-80 h-full flex-shrink-0 relative mx-2">
                <img
                  src={image}
                  alt="Event Decoration"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row - slides right to left */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 overflow-hidden opacity-90">
          <div className="flex" style={{
            width: `${infiniteImages.length * 350}px`,
            animation: 'slideLeft 70s linear infinite'
          }}>
            {infiniteImages.slice(8).map((image, index) => (
              <div key={index} className="w-80 h-full flex-shrink-0 relative mx-2">
                <img
                  src={image}
                  alt="Venue Setup"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Professional Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/75 via-white/60 to-white/45" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center min-h-screen py-20">
          
          {/* Centered Content */}
          <div className="w-full max-w-3xl space-y-12">
            
            {/* Main Heading */}
            <div className="space-y-8">
              <h1 className="text-6xl lg:text-7xl font-light text-gray-900 leading-[1.05] tracking-tight">
                Exceptional venues
                <span className="block font-medium" style={{ color: '#313A67' }}>
                  for extraordinary
                </span>
                <span className="block font-light text-gray-900">
                  moments
                </span>
              </h1>
              <p className="text-2xl text-gray-600 leading-relaxed font-light max-w-2xl">
                Discover curated venues and premium services that transform your vision into unforgettable experiences.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 pt-8">
              <button
                onClick={handleSearch}
                className="group flex items-center justify-center px-12 py-5 text-white font-medium text-lg rounded-xl transition-all shadow-lg hover:shadow-xl"
                style={{ backgroundColor: '#313A67' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2A2F5A'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#313A67'}
              >
                <span className="flex items-center space-x-3">
                  <span className='text-white'>Explore Venues</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button
                onClick={handleListVenue}
                className="flex items-center justify-center px-12 py-5 border-2 text-gray-700 font-medium text-lg rounded-xl hover:bg-gray-50 transition-all"
                style={{ borderColor: '#313A67' }}
              >
                List Your Space
              </button>
            </div>


          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideRight {
          0% { transform: translateX(-33.33%); }
          100% { transform: translateX(0%); }
        }
        
        @keyframes slideLeft {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </section>
  );
};

export default VenueHero;