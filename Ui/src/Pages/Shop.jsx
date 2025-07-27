import React, { useState, useEffect } from "react";
import Hero from "../Components/Shop/Hero";
import ProductListingCard from "../Components/Shop/ListingProductCard";
import api from "../lib/Url";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/product");
      setProducts(res.data);
    } catch (err) {
      setError("Failed to load products. Please try again later.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Explore Our Products
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover our carefully curated collection of premium products designed to elevate your lifestyle.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-24">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                <p className="text-gray-600 font-medium">Loading products...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-24">
              <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-lg mx-auto">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Something went wrong</h3>
                <p className="text-red-700 font-medium mb-6">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <>
              {products.length > 0 ? (
                <>
                  {/* Products Count */}
                  <div className="mb-8">
                    <p className="text-gray-600 font-medium">
                      Showing {products.length} product{products.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  {/* Responsive Grid with Better Spacing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
                    {products.map((product) => (
                      <div key={product._id} className="w-full">
                        <ProductListingCard product={product} />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-24">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 max-w-lg mx-auto">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">No Products Found</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      We couldn't find any products at the moment. Our inventory might be updating or there could be a temporary issue.
                    </p>
                    <button
                      onClick={fetchProducts}
                      className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-black transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Refresh Products
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;