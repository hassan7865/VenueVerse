import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';
import UserProfile from '../../UserProfile';
import toast from 'react-hot-toast';
import { List } from 'lucide-react';
import { MdInventory2 } from 'react-icons/md';

const ProfileOption = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogOut =  () => {
    try {
      UserProfile.DeleteUser();
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (err) {
      toast.error(message);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button 
        className="flex items-center focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Profile menu"
      >
        <img 
          className="h-8 w-8 rounded-full object-cover border border-gray-200"
          src={user.avatar || '/default-avatar.png'} 
          alt="Profile"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default-avatar.png';
          }}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
          <Link 
            to="/profile" 
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <FaUser className="mr-3 text-gray-500" />
            Profile
          </Link>

           <Link 
            to="/mylisting" 
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <MdInventory2 className="mr-3 text-gray-500" />
            My Listing
          </Link>
          
          <button
            onClick={() => {
              handleLogOut();
              setIsOpen(false);
            }}
            className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100"
          >
            <FaSignOutAlt className="mr-3 text-gray-500" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileOption;