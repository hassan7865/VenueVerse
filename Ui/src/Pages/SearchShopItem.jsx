import React, { useEffect, useRef, useState } from "react";
import { BsSearch, BsFilter, BsXLg } from "react-icons/bs";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { LuSearchX } from "react-icons/lu";
import api from "../lib/Url";
import toast from "react-hot-toast";
import { useMediaQuery } from "react-responsive";
import ProductListingCard from "../Components/Shop/ListingProductCard";
import Loading from "../Components/Loading";

const ShopSearch = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const scrollRef = useRef();

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const EventDecorCategories = [
    "Lighting & Effects",
    "Floral Decoration",
    "Table Decoration",
    "Dining Setup",
    "Other",
  ];

  const [filters, setFilters] = useState({
    searchTerm: "",
    category: "all",
    sortBy: "newest", // newest, price-low-high, price-high-low
    inStock: false,
  });

  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      searchTerm: searchTerm,
    }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilters({
      searchTerm: "",
      category: "all",
      sortBy: "newest",
      inStock: false,
    });
    setPagination({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const searchParam = filters.searchTerm || "";
        const categoryParam = filters.category || "all";
        const sortByParam = filters.sortBy || "newest";
        const inStockParam = filters.inStock ? "true" : "false";
        const pageParam = pagination.currentPage || 1;

        const queryParams = new URLSearchParams({
          searchTerm: searchParam,
          category: categoryParam,
          sortBy: sortByParam,
          inStock: inStockParam,
          page: pageParam.toString(),
        });

        const url = `/product?${queryParams.toString()}`;

        const res = await api.get(url);

        setProducts(res.data.products || []);
        setPagination({
          currentPage: res.data.currentPage || 1,
          totalPages: res.data.totalPages || 1,
          totalItems: res.data.total || 0,
        });
      } catch (error) {
        console.error("Error in fetching products:", error);
        toast.error(error.response?.data?.message || "Error fetching products");
        setProducts([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, pagination.currentPage]);

  const handleFilterChange = (name, value) => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreviousPage = () => {
    if (pagination.currentPage > 1) {
      setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  };

  const handlePageSelect = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [products, pagination.currentPage]);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = isMobile ? 3 : 5;
    let startPage = Math.max(
      1,
      pagination.currentPage - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(
      pagination.totalPages,
      startPage + maxVisiblePages - 1
    );

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <>
      <section className="min-h-screen bg-gray-50" ref={scrollRef}>
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          {/* Mobile Filter Button */}
          {isMobile && (
            <div className="sticky top-0 z-10 bg-white py-3 border-b border-gray-200 flex justify-between items-center px-4">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-lg"
              >
                <BsFilter className="text-lg" />
                <span>Filters</span>
              </button>
              <div className="text-sm text-gray-600">
                {pagination.totalItems} results
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row min-h-screen">
            {/* Sidebar - Filter Panel */}
            <div
              className={`${showMobileFilters ? "block" : "hidden"} md:block w-full md:w-80 bg-white border-r border-gray-200 flex-shrink-0 md:sticky md:top-0 md:h-screen`}
            >
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <BsFilter className="mr-2 text-lg text-gray-600" />
                    Filters
                  </h2>
                  {isMobile && (
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <BsXLg className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Filters Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                  {/* Search Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Products
                    </label>
                    <form onSubmit={handleSubmit} className="relative">
                      <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 text-sm"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-brand-blue transition-colors"
                      >
                        <BsSearch className="w-4 h-4" />
                      </button>
                    </form>
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Categories
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center cursor-pointer group">
                        <input
                          className="w-4 h-4 text-brand-blue border-gray-300 rounded focus:ring-blue-500"
                          type="radio"
                          name="category"
                          value="all"
                          onChange={(e) =>
                            handleFilterChange(e.target.name, e.target.value)
                          }
                          checked={filters.category === "all"}
                        />
                        <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                          All Categories
                        </span>
                      </label>
                      {EventDecorCategories.map((category) => (
                        <label
                          key={category}
                          className="flex items-center cursor-pointer group"
                        >
                          <input
                            className="w-4 h-4 text-brand-blue border-gray-300 rounded focus:ring-blue-500"
                            type="radio"
                            name="category"
                            value={category}
                            onChange={(e) =>
                              handleFilterChange(e.target.name, e.target.value)
                            }
                            checked={filters.category === category}
                          />
                          <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                            {category}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select
                      name="sortBy"
                      value={filters.sortBy}
                      onChange={(e) =>
                        handleFilterChange(e.target.name, e.target.value)
                      }
                      className="w-full py-2.5 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 text-sm"
                    >
                      <option value="newest">Newest Arrivals</option>
                      <option value="price-low-high">Price: Low to High</option>
                      <option value="price-high-low">Price: High to Low</option>
                    </select>
                  </div>

                  {/* In Stock Only */}
                  <div className="pt-2">
                    <label className="flex items-center cursor-pointer group">
                      <input
                        className="w-4 h-4 text-brand-blue border-gray-300 rounded focus:ring-blue-500"
                        type="checkbox"
                        name="inStock"
                        checked={filters.inStock}
                        onChange={(e) =>
                          handleFilterChange(e.target.name, e.target.checked)
                        }
                      />
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                        In Stock Only
                      </span>
                    </label>
                  </div>
                </div>

                {/* Clear Filters Button */}
                <div className="px-6 py-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:overflow-y-auto md:h-screen">
              {loading ? (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <Loading />
                    <p className="font-heading text-slate-900 text-lg sm:text-2xl mt-4">
                      Loading...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  {products.length > 0 ? (
                    <>
                      {/* Results Header */}
                      <div className="px-6 py-4 md:px-8 md:py-6 bg-white border-b border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <h1 className="text-xl font-semibold text-gray-900">
                              Product Results
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                              Showing {products.length} of{" "}
                              {pagination.totalItems} products
                            </p>
                          </div>
                          {!isMobile && (
                            <div className="mt-2 md:mt-0 text-sm text-gray-600">
                              Page {pagination.currentPage} of{" "}
                              {pagination.totalPages}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Products Grid */}
                      <div className="p-4 sm:p-6 md:p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                          {products.map((product) => (
                            <ProductListingCard
                              key={product._id}
                              product={product}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Pagination */}
                      {pagination.totalPages > 1 && (
                        <div className="px-6 py-4 md:px-8 md:py-6 bg-white border-t border-gray-200">
                          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                            <div className="text-sm text-gray-700">
                              Showing page {pagination.currentPage} of{" "}
                              {pagination.totalPages}
                            </div>
                            <nav className="flex items-center space-x-1">
                              {/* Previous Button */}
                              <button
                                onClick={handlePreviousPage}
                                disabled={
                                  pagination.currentPage <= 1 || loading
                                }
                                className={`p-2 rounded-md ${pagination.currentPage <= 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
                              >
                                <FaAngleLeft className="w-5 h-5" />
                              </button>

                              {/* Page Numbers */}
                              {getPageNumbers().map((page) => (
                                <button
                                  key={page}
                                  onClick={() => handlePageSelect(page)}
                                  className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium ${pagination.currentPage === page ? "bg-brand-blue text-white" : "text-gray-700 hover:bg-gray-100"}`}
                                >
                                  {page}
                                </button>
                              ))}

                              {/* Next Button */}
                              <button
                                onClick={handleNextPage}
                                disabled={
                                  pagination.currentPage >=
                                    pagination.totalPages || loading
                                }
                                className={`p-2 rounded-md ${pagination.currentPage >= pagination.totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
                              >
                                <FaAngleRight className="w-5 h-5" />
                              </button>
                            </nav>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center p-6">
                      <div className="text-center max-w-md">
                        <div className="w-20 h-20 mx-auto mb-4 text-gray-400">
                          <LuSearchX className="w-full h-full" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-3">
                          No products found
                        </h3>
                        <p className="text-gray-500 mb-6">
                          Try adjusting your search or filters to find what
                          you're looking for.
                        </p>
                        <button
                          onClick={clearSearch}
                          className="inline-flex items-center px-5 py-2.5 bg-brand-blue text-white font-medium rounded-lg hover:bg-brand-blue transition-colors"
                        >
                          Clear All Filters
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopSearch;
