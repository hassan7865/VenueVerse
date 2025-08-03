import React from 'react';
import { Search, Plus, ArrowRight } from 'lucide-react';

const ShopHero = () => {
  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
  };

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-black"></div>
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=2070&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Subtle geometric shapes */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 border border-white/5 rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/6 w-64 h-64 border border-white/10 rounded-full"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-screen py-20">
          
          {/* Left Column - Text Content */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="px-4 py-2 text-sm font-medium text-white/80 border border-white/20 rounded-full backdrop-blur-sm">
                  Premium Event Solutions
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-light tracking-tight text-white leading-[0.9]">
                Elevate Your
                <span 
                  className="block font-medium mt-2"
                  style={{ color: 'white' }}
                >
                  Event Experience
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
                Curate exceptional moments with our premium collection of event decor and supplies. 
                Professional quality for discerning hosts and event planners.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6">
              <button
                onClick={() => navigate("/search_shop")}
                className="group inline-flex items-center justify-center px-8 py-4 font-medium rounded-lg transition-all duration-300 hover:scale-105"
                style={{ 
                  backgroundColor: '#313A67',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#4A5578';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#313A67';
                }}
              >
                <Search className="mr-3 w-5 h-5" />
                Browse Collection
                <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => navigate("/create_shopitem")}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-medium rounded-lg hover:border-white/50 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm hover:scale-105"
              >
                <Plus className="mr-3 w-5 h-5" />
                List Your Products
              </button>
            </div>
          </div>

          {/* Right Column - Visual Element */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              {/* Top Row */}
              <div 
                className="aspect-square rounded-2xl bg-cover bg-center shadow-2xl transform hover:scale-105 transition-all duration-500"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80')`
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-transparent to-black/30 rounded-2xl"></div>
              </div>
              
              <div 
                className="aspect-square rounded-2xl bg-cover bg-center shadow-2xl transform hover:scale-105 transition-all duration-500 mt-12"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80')`
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-transparent to-black/30 rounded-2xl"></div>
              </div>
              
              {/* Bottom Row */}
              <div 
                className="aspect-square rounded-2xl bg-cover bg-center shadow-2xl transform hover:scale-105 transition-all duration-500 -mt-12"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80')`
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-transparent to-black/30 rounded-2xl"></div>
              </div>
              
              <div 
                className="aspect-square rounded-2xl bg-cover bg-center shadow-2xl transform hover:scale-105 transition-all duration-500"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1519167758481-83f29da8fd30?auto=format&fit=crop&w=800&q=80')`
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-transparent to-black/30 rounded-2xl"></div>
              </div>
            </div>

            {/* Floating accent */}
            <div 
              className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-3xl"
              style={{ backgroundColor: '#313A67' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHero;