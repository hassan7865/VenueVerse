import React, { useContext, useEffect, useState } from "react";
import {  IoMdClose } from "react-icons/io";
import { FiTrash2, FiShoppingBag } from "react-icons/fi";
import CartItem from "./CartItem";
import { CartContext } from "../../context/cart";
import { SidebarContext } from "../../context/sidebar";
import UserProfile from "../../../UserProfile";
import ShippingAddressDialog from "../AddressModal";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { isOpen, handleClose } = useContext(SidebarContext);
  const { cart, clearCart, itemAmount, total } = useContext(CartContext);
  const [IsShowAddress, setIsShowAddress] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = () => {
    if (cart.length === 0) return;
    if(!UserProfile.GetUserData()){
      navigate("/login")
    }
    setIsShowAddress(true);
  };



  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={handleClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 right-0 h-full bg-white shadow-2xl z-50 
          transform transition-transform duration-300 ease-in-out
          w-full sm:w-[400px] md:w-[450px] lg:w-[500px] xl:w-[550px]
          flex flex-col
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <FiShoppingBag className="text-xl text-gray-700" />
            <div className="text-lg font-semibold text-gray-800">
              Shopping Bag ({itemAmount})
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
          >
            <IoMdClose className="text-xl text-gray-600" />
          </button>
        </div>

        {/* Main Content: Items + Footer */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <FiShoppingBag className="text-6xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              Your cart is empty
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Add some products to get started
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue transition-colors duration-200"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100%-72px)]">
            {/* Cart Items Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                {cart.map((item) => (
                  <CartItem item={item} key={item.id} />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-6">
                <div className="text-lg font-semibold text-gray-800">
                  Subtotal: Rs{parseFloat(total).toFixed(2)}
                </div>
                <button
                  onClick={clearCart}
                  className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
                  title="Clear Cart"
                >
                  <FiTrash2 className="text-lg" />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleSubmit}
                  className="w-full bg-brand-blue hover:bg-brand-blue text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Shipping Address Modal */}
      <ShippingAddressDialog
        isOpen={IsShowAddress}
        onClose={() => setIsShowAddress(false)}
        initialValues={UserProfile.GetUserData()?.shippingAddress || {}}
      />
    </>
  );
};

export default Sidebar;
