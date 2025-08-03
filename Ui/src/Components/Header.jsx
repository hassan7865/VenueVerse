import React, { useEffect, useState } from "react";
import { BsBag, BsSearch } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineClose } from "react-icons/md";
import { FiHome, FiPlusCircle } from "react-icons/fi";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import UserProfile from "../../UserProfile";
import ProfileOption from "./ProfileOption";
import MobileMenu from "./ModileMenu";
import { ShoppingBagIcon } from "lucide-react";
import { useContext } from "react";
import { CartContext } from "../context/cart";
import { SidebarContext } from "../context/sidebar";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleSidebar } = useContext(SidebarContext);
  const { itemAmount } = useContext(CartContext);
  const [currentUser, setCurrentUser] = useState(UserProfile.GetUserData());
  const location = useLocation();

  useEffect(() => {
    const user = UserProfile.GetUserData();
    setCurrentUser(user);
    console.log(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Navigation */}
           <div className="flex items-center">
  <Link
    to="/"
    className="group flex items-center space-x-3 transition-all duration-300"
  >
    <div className="relative">
      <img src="/images.svg" className="h-8 w-8" alt="Logo" />
    </div>
    <span className="hidden sm:inline text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent tracking-tight">
      VenueVerse
    </span>
  </Link>

  <nav className="hidden md:ml-12 md:flex md:space-x-1">
    {[
      { to: "/search", icon: BsSearch, label: "Browse" },
      { to: "/create_post", icon: FiPlusCircle, label: "List Your Space" },
      { to: "/shop", icon: ShoppingBagIcon, label: "Shop" },
    ].map(({ to, icon: Icon, label }) => (
      <Link
        key={to}
        to={to}
        className="group flex items-center px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50/80 transition-all duration-200 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        <Icon className="relative w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
        <span className="relative">{label}</span>
      </Link>
    ))}
  </nav>
</div>


            {/* Search & Auth */}
            <div className="flex items-center space-x-4">
              <div
                onClick={() => toggleSidebar()}
                className="cursor-pointer flex relative"
              >
                <BsBag className="text-2xl" />
                <div className="bg-red-500 absolute -right-2 -bottom-2 text-[12px] w-[18px] h-[18px] text-white rounded-full flex justify-center items-center">
                  {itemAmount}
                </div>
              </div>

              {/* User Authentication */}
              <div className="flex items-center">
                {currentUser ? (
                  <ProfileOption user={currentUser} />
                ) : (
                  <div className="hidden md:flex items-center space-x-3">
                    <Link
                      to="/login"
                      className="relative px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-slate-900 to-slate-700 rounded-full hover:from-slate-800 hover:to-slate-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative text-white">Login</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all duration-200 border border-slate-200 hover:border-slate-300"
              >
                <div className="relative w-5 h-5">
                  <div
                    className={`absolute inset-0 transition-all duration-300 ${
                      isMobileMenuOpen
                        ? "rotate-180 opacity-100"
                        : "rotate-0 opacity-100"
                    }`}
                  >
                    {isMobileMenuOpen ? (
                      <MdOutlineClose className="w-5 h-5" />
                    ) : (
                      <HiOutlineMenuAlt3 className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <MobileMenu
          menuStatus={{
            isActiveMoblie: isMobileMenuOpen,
            setisActiveMoblie: setIsMobileMenuOpen,
          }}
        />
      )}
    </>
  );
};

export default Header;
