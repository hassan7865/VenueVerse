import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import OfferedListing from "../Components/OfferedListing";
import VenueListing from "../Components/VenueListing";
import ServiceListing from "../Components/ServiceListing";
import { FiArrowRight, FiSearch, FiPlusCircle } from "react-icons/fi";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="font-sans antialiased text-gray-900 bg-white">
      {/* Professional Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-90 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1770&q=80')] bg-cover bg-center"></div>
        
        <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-light tracking-tight text-white leading-tight">
                  Elevate Your Events with 
                  <span className="block font-medium bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                    Premium Venues
                  </span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
                  Discover and book exceptional venues for weddings, corporate events, and special occasions. Our curated selection ensures your event stands out.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/search")}
                  className="group inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <FiSearch className="mr-2 w-5 h-5" />
                  Explore Venues
                  <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate("/create_post")}
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/20 text-white font-medium rounded-lg hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
                >
                  <FiPlusCircle className="mr-2 w-5 h-5" />
                  List Your Space
                </button>
              </div>
              
              <div className="flex items-center space-x-8 text-sm text-gray-400">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span>1000+ Venues</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                  <span>500+ Services</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                  <span>Trusted Platform</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-600 mb-6">
              <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
              Featured Collection
            </div>
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Handpicked for Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our carefully curated selection of premium venues and services, chosen for their exceptional quality and customer satisfaction.
            </p>
          </div>
          <OfferedListing />
        </div>
      </section>

      {/* Service Providers Section */}
      <section className="py-24 bg-gray-50 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-600">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Professional Services
                </div>
                <h2 className="text-4xl font-light text-gray-900 leading-tight">
                  Connect with Top 
                  <span className="block font-medium">Service Providers</span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Our platform connects you with the best catering, photography, and event planning professionals to make your event unforgettable.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-light text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Verified Providers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-gray-900">4.9★</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>
              
              <button
                onClick={() => navigate("/search?type=service")}
                className="group inline-flex items-center px-8 py-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Browse Services
                <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-20 blur-xl"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1527525443983-6e60c75fff46?auto=format&fit=crop&w=800&q=80" 
                  alt="Event services" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Listings */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-600 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Premium Services
            </div>
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive event services to make your celebration perfect, from catering to entertainment.
            </p>
          </div>
          <ServiceListing />
        </div>
      </section>

      {/* Venue Showcase */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl opacity-20 blur-xl"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80" 
                  alt="Event venue" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
            
            <div className="space-y-8 order-1 lg:order-2">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-600">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                  Venue Collection
                </div>
                <h2 className="text-4xl font-light text-gray-900 leading-tight">
                  Stunning Venues for 
                  <span className="block font-medium">Every Occasion</span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  From intimate gatherings to grand celebrations, find the perfect space that matches your vision and budget.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-light text-gray-900">1000+</div>
                  <div className="text-sm text-gray-600">Unique Venues</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-gray-900">50+</div>
                  <div className="text-sm text-gray-600">Cities Covered</div>
                </div>
              </div>
              
              <button
                onClick={() => navigate("/search?type=venue")}
                className="group inline-flex items-center px-8 py-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Explore Venues
                <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Listings */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-600 mb-6">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
              Featured Venues
            </div>
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Most Popular Venues
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our most sought-after venues for weddings, corporate events, and memorable celebrations.
            </p>
          </div>
          <VenueListing />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1770&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                Get Started Today
              </div>
              <h2 className="text-4xl lg:text-5xl font-light text-white leading-tight">
                Ready to Create Your 
                <span className="block font-medium bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                  Perfect Event?
                </span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                Join thousands of satisfied customers who found their ideal venue through our platform.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/search")}
                className="group inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Find a Venue
                <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate("/create_post")}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/20 text-white font-medium rounded-lg hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
              >
                <FiPlusCircle className="mr-2 w-5 h-5" />
                List Your Space
              </button>
            </div>
            
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center">
                <span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>
                <span className="text-white">Trusted by 10k+</span>
              </div>
              <div className="flex items-center">
                <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                <span className="text-white">24/7 Support</span>
              </div>
              <div className="flex items-center">
                <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                <span className="text-white">Secure Platform</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;