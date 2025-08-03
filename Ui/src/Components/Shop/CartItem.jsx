import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { IoMdAdd, IoMdClose, IoMdRemove } from "react-icons/io";
import { CartContext } from "../../context/cart";

const CartItem = ({ item }) => {
  const { removeFromCart, increaseAmount, decreaseAmount } = useContext(CartContext);

  const { _id, name, images, price, discountPrice, offer, category, stock, amount } = item;

  // Calculate the effective price (based on offer)
  const effectivePrice = offer && discountPrice ? discountPrice : price;

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="w-20 h-20 flex-shrink-0">
        <Link to={`/product/${_id}`} className="block w-full h-full">
          <img
            className="w-full h-full object-cover rounded-lg border border-gray-200"
            src={images?.[0]?.url || "/placeholder-image.jpg"}
            alt={name}
            onError={(e) => (e.target.src = "/placeholder-image.jpg")}
          />
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 pr-2">
            <Link
              to={`/product/${_id}`}
              className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-tight"
            >
              {name}
            </Link>
            {category && (
              <p className="text-xs text-gray-500 mt-1 capitalize">{category}</p>
            )}
          </div>

          <button
            onClick={() => removeFromCart(_id)}
            className="p-1 rounded-full hover:bg-red-50 transition-colors duration-200 group"
            aria-label="Remove item"
          >
            <IoMdClose className="text-lg text-gray-400 group-hover:text-red-500" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity controls */}
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => decreaseAmount(_id)}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
              disabled={amount <= 1}
            >
              <IoMdRemove className="text-sm text-gray-600" />
            </button>

            <div className="w-10 h-8 flex items-center justify-center text-sm font-medium bg-gray-50 border-x border-gray-300">
              {amount}
            </div>

            <button
              onClick={() => increaseAmount(_id)}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
              disabled={stock && amount >= stock}
            >
              <IoMdAdd className="text-sm text-gray-600" />
            </button>
          </div>

          {/* Price section */}
          <div className="flex flex-col items-end text-sm">
            {offer && discountPrice ? (
              <>
                <span className="text-gray-500 line-through">Rs {parseFloat(price).toFixed(2)}</span>
                <span className="text-green-600 font-semibold">
                  Rs {parseFloat(discountPrice * amount).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-gray-800 font-semibold">
                Rs {parseFloat(price * amount).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {stock && stock <= 5 && (
          <div className="mt-2">
            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              Only {stock} left in stock
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItem;
