import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { BsPlus } from "react-icons/bs";
import { CartContext } from "../../context/cart";

const ProductListingCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const { _id, images, category, name, price, stock } = product;
  const productImages = images && images.length > 0 ? images : [];
  const firstImage = productImages.length > 0 ? productImages[0] : null;
  const hasMultipleImages = productImages.length > 1;

  // Format price with proper currency formatting
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getImageSrc = () => {
    if (!firstImage) return null;
    return typeof firstImage === 'string' ? firstImage : firstImage.url || firstImage.src;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, _id);
  };

  return (
    <Link 
      to={`/item/${_id}`}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col h-full cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex-shrink-0">
        
        {/* Product Image */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          {firstImage ? (
            <img
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
              src={getImageSrc()}
              alt={name}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-32 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm font-medium">
              No Image Available
            </div>
          )}
        </div>

        {/* Category Badge */}
        {category && (
          <div className="absolute top-4 left-4">
            <span className="inline-block bg-black/85 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wide">
              {category}
            </span>
          </div>
        )}

        {/* Multiple Images Indicator */}
        {hasMultipleImages && (
          <div className="absolute top-4 right-4">
            <span className="inline-block bg-blue-600/90 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
              +{productImages.length - 1} more
            </span>
          </div>
        )}

        {/* Stock Badge */}
        {stock > 0 && stock < 10 && (
          <div className="absolute bottom-4 left-4">
            <span className="inline-block bg-orange-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              Only {stock} left
            </span>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {stock === 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-red-600 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Product Name */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 min-h-[3.5rem]">
            {name}
          </h3>
        </div>

        {/* Price Section */}
        <div className="mb-4 flex-grow">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900 mb-1">
              {formatPrice(price)}
            </span>
            {hasMultipleImages && (
              <span className="text-sm text-gray-500">
                {productImages.length} photos available
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={stock === 0}
          className="w-full bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          aria-label={`Add ${name} to cart`}
        >
          <BsPlus className="text-xl" />
          {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>

      {/* Subtle Hover Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-10 blur-sm transition-opacity duration-300 -z-10"></div>
    </Link>
  );
};

export default ProductListingCard;