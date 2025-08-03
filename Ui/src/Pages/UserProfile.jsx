import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  User,
  MapPin,
  Calendar,
  Star,
  Edit3,
  Plus,
  Grid3X3,
  Briefcase,
  Home,
  Package,
  ChevronRight,
  Users,
  Mail,
  Phone,
} from "lucide-react";
import api from "../lib/Url";
import UserProfile from "../../UserProfile";
import toast from "react-hot-toast";
import ProductCard from "../Components/Shop/ProductCard";
import Loading from "../Components/Loading";
import PostCard from "../Components/Postcard";

const UserProfileCatalogue = () => {
  const { userId } = useParams();
  const currentUser = UserProfile.GetUserData();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [shopItems, setShopItems] = useState([]);
  const [services, setServices] = useState([]);
  const [venues, setVenues] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        // Fetch user profile data
        const userResponse = await api.get(`/user/${userId}`);
        setUserData(userResponse.data);

        // Fetch all listings in parallel
        const [shopResponse, postResponse] = await Promise.all([
          api.get(`/product/user/${userId}`),
          api.get(`/post/user/${userId}`),
        ]);

        setShopItems(shopResponse.data);

        // Filter posts by type
        const allPosts = postResponse.data || [];
        const services = allPosts.filter((post) => post.type === "service");
        const venues = allPosts.filter((post) => post.type === "venue");

        setServices(services);
        setVenues(venues);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to load data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

 

  if (isLoading) {
    return (
       <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loading />
          <p className="font-heading text-slate-900 text-lg sm:text-2xl mt-4">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
            <User className="w-8 h-8 text-slate-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900">User Not Found</h3>
            <p className="text-slate-600">The requested user profile could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  const isCurrentUser = currentUser && currentUser._id == userId
  const totalListings = shopItems.length + services.length + venues.length;

  const stats = [
    { label: "Products", value: shopItems.length, icon: Package, color: "text-brand-blue" },
    { label: "Services", value: services.length, icon: Briefcase, color: "text-green-600" },
    { label: "Venues", value: venues.length, icon: Home, color: "text-purple-600" },
    { label: "Total", value: totalListings, icon: Grid3X3, color: "text-slate-600" },
  ];

  const tabs = [
    { id: "all", label: "All", count: totalListings },
    { id: "products", label: "Products", count: shopItems.length },
    { id: "services", label: "Services", count: services.length },
    { id: "venues", label: "Venues", count: venues.length },
  ];

  const getFilteredItems = () => {
    switch (activeTab) {
      case "products":
        return { items: shopItems, type: "shop" };
      case "services":
        return { items: services, type: "service" };
      case "venues":
        return { items: venues, type: "venue" };
      default:
        return {
          items: [
            ...shopItems.map(item => ({ ...item, itemType: "shop" })),
            ...services.map(item => ({ ...item, itemType: "service" })),
            ...venues.map(item => ({ ...item, itemType: "venue" }))
          ],
          type: "mixed"
        };
    }
  };

  const { items, type } = getFilteredItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="pt-8 pb-6">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
            {/* Cover Section */}
            <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute bottom-4 right-6">
                {isCurrentUser && (
                  <Link
                    to="/profile"
                    className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
                {/* Avatar */}
                <div className="relative -mt-16 mb-4 sm:mb-0">
                  <div className="w-32 h-32 rounded-2xl bg-white p-1 shadow-xl">
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
                      {userData.profilePicture ? (
                        <img
                          src={userData.profilePicture}
                          alt={`${userData.username}'s profile`}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <span className="text-4xl font-bold text-slate-600">
                          {userData.username.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* User Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <h1 className="text-3xl font-bold text-slate-900 truncate">
                        {userData.username}
                      </h1>
                      <p className="text-slate-600 max-w-md">
                        {userData.bio || "Welcome to my profile! Explore my collection of products and services."}
                      </p>
                      
                      {/* Contact Info */}
                      <div className="flex flex-wrap items-center gap-4 pt-2">
                        {userData.email && (
                          <div className="flex items-center text-sm text-slate-500">
                            <Mail className="w-4 h-4 mr-2" />
                            <span>{userData.email}</span>
                          </div>
                        )}
                        {userData.phone && (
                          <div className="flex items-center text-sm text-slate-500">
                            <Phone className="w-4 h-4 mr-2" />
                            <span>{userData.phone}</span>
                          </div>
                        )}
                       
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className={`p-2 rounded-lg bg-slate-50 ${stat.color}`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="pb-8">
          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-1 mb-6">
            <nav className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content Grid */}
          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => {
                const itemType = item.itemType || type;
                
                if (itemType === "shop") {
                  return (
                   <ProductCard product={item} />
                  );
                } else {
                  return (
                    <PostCard
                            key={item._id}
                            postInfo={{
                              post: {
                                ...item,
                                title: item.name,
                                description: item.description,
                                image:
                                  item.images?.[0] || "/default-venue.jpg",
                              },
                            }}
                          />
                  );
                }
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 p-12">
              <div className="text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Grid3X3 className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {activeTab === "all" ? "No listings yet" : `No ${activeTab} found`}
                </h3>
                <p className="text-slate-600 mb-6">
                  {isCurrentUser
                    ? `Start building your ${activeTab === "all" ? "portfolio" : activeTab} collection and showcase your offerings to potential clients.`
                    : `This user hasn't added any ${activeTab === "all" ? "listings" : activeTab} yet. Check back later!`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileCatalogue;