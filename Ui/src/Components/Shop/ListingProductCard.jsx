import React, {  useContext, useState } from "react";
import { Plus, Image } from 'lucide-react';
import { CartContext } from "../../context/cart";
import { useNavigate } from "react-router-dom";

const ProductListingCard = ({ product }) => {
 const { addToCart } = useContext(CartContext);
  const navigate = useNavigate()

  const { _id, images, category, name, price, stock } = product;

  const productImages = images && images.length > 0 ? images : [];
  const firstImage = productImages.length > 0 ? productImages[0] : null;
  const hasMultipleImages = productImages.length > 1;

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
    <div
      onClick={()=>navigate(`/item/${_id}`)}
      className="group relative flex flex-col h-[420px] rounded-xl overflow-hidden border border-gray-150 hover:border-gray-250 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
    >
      {/* Image Section - Fixed Height */}
      <div className="relative h-52 bg-gradient-to-br from-gray-25 to-gray-75 overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 flex items-center justify-center p-6">
          {firstImage ? (
            <img
              src={getImageSrc()}
              alt={name}
              className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400 text-sm font-medium rounded-lg">
              <Image className="w-8 h-8 mb-2" />
              <span>No Image Available</span>
            </div>
          )}
        </div>

        {/* Category Badge - More Professional */}
        {category && (
          <div className="absolute top-3 left-3">
            <span className="bg-slate-800/95 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-md uppercase shadow-sm tracking-wider border border-slate-700/50">
              {category}
            </span>
          </div>
        )}

        {/* Multiple Images Badge - Refined */}
        {hasMultipleImages && (
          <div className="absolute top-3 right-3">
            <span className="bg-blue-600 text-white text-xs font-medium px-2.5 py-1.5 rounded-md shadow-sm flex items-center gap-1">
              <Image className="w-3 h-3" />
              +{productImages.length - 1}
            </span>
          </div>
        )}

        {/* Stock Warning - More Subtle */}
        {stock > 0 && stock < 10 && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-amber-500 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm">
              Only {stock} left
            </span>
          </div>
        )}

        {/* Out of Stock Overlay - Professional */}
        {stock === 0 && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-slate-800 text-white font-medium text-sm px-6 py-2.5 rounded-lg shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info Section - Fixed Height Structure */}
      <div className="flex flex-col p-6 flex-1 min-h-0">
        {/* Product Name - Fixed Height Container */}
        <div className="h-14 mb-3">
          <h3 className="text-lg font-semibold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 overflow-hidden">
            {name}
          </h3>
        </div>

        {/* Price and Photos Info - Fixed Height */}
        <div className="mb-4 h-12 flex flex-col justify-start">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">{formatPrice(price)}</span>
          {hasMultipleImages && (
            <p className="text-sm text-slate-500 mt-1 font-medium">{productImages.length} photos available</p>
          )}
        </div>

        {/* Professional Button Design - Fixed at Bottom */}
        <div className="mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={`w-full py-3.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              stock === 0 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 text-white hover:shadow-md hover:scale-[1.01] active:scale-[0.99] focus:ring-slate-500'
            }`}
            aria-label={`Add ${name} to cart`}
          >
            <Plus className="w-4 h-4" />
            {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Subtle Enhancement Ring */}
      <div className="absolute inset-0 rounded-xl ring-1 ring-slate-900/5 group-hover:ring-slate-900/10 transition-all duration-300 pointer-events-none" />
    </div>
  );
};

export default ProductListingCard