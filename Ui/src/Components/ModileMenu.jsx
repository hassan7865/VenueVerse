import React, { useEffect } from "react";
import {
  FaHome,
  FaUser,
  FaSignInAlt,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserProfile from "../../UserProfile";
import api from "../lib/Url";
import toast from "react-hot-toast";
import { IoIosBookmarks } from "react-icons/io";

const MobileMenu = ({ menuStatus }) => {
  const currentUser = UserProfile.GetUserData();
  const { isActiveMoblie, setisActiveMoblie } = menuStatus;
  const navigate = useNavigate();

  const close = () => setisActiveMoblie(false);

  useEffect(() => {
    if (isActiveMoblie) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isActiveMoblie]);

  const handleLogOut = async () => {
    try {
      await api.get("/auth/signout");
      UserProfile.DeleteUser();
      navigate("/login");
      close();
      toast.success("Logged out", { position: "top-right" });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error", {
        position: "top-right",
      });
    }
  };

  const items = currentUser
    ? [
        { label: "Home", path: "/home", icon: FaHome },
        { label: "Profile", path: "/profile", icon: FaUser },
        { label: "Booking", path: "/booking", icon: IoIosBookmarks },
        { label: "Log Out", action: handleLogOut, icon: FaSignOutAlt },
      ]
    : [
        { label: "Home", path: "/home", icon: FaHome },
        { label: "Login", path: "/login", icon: FaSignInAlt },
      ];

  if (!isActiveMoblie) return null;

  return (
    <>
      {/* Professional Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all duration-300"
        onClick={close}
      />

      {/* Sleek Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-xl flex flex-col transition-transform duration-300 animate-slide-in">
        {/* Minimalist Header */}
        <div className="px-8 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-900 tracking-tight">
              Navigation
            </h2>
            <button
              onClick={close}
              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              <FaTimes className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Clean User Info */}
        {currentUser && (
          <div className="px-8 py-5 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <FaUser className="w-4 h-4 text-gray-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentUser.name || currentUser.email}
                </p>
                <p className="text-xs text-gray-500">Account holder</p>
              </div>
            </div>
          </div>
        )}

        {/* Professional Menu Items */}
        <nav className="flex-1 py-6">
          {items.map(({ label, path, icon: Icon, action }) => (
            <button
              key={label}
              onClick={
                action
                  ? action
                  : () => {
                      navigate(path);
                      close();
                    }
              }
              className="w-full flex items-center gap-4 px-8 py-4 text-left hover:bg-gray-50 transition-colors duration-200 border-l-4 border-transparent hover:border-gray-900"
            >
              <Icon className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 font-medium">{label}</span>
            </button>
          ))}
        </nav>

        {/* Professional Footer */}
        <div className="px-8 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} VenueBooking Inc.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default MobileMenu;
