import { React, useEffect, useState } from "react";
import { AiOutlineShop, AiOutlineHome } from "react-icons/ai";
import { BsFillPlusSquareFill } from "react-icons/bs";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loading from "../Components/Loading.jsx";
import Footer from "../Components/Footer.jsx";
import UserProfile from "../../UserProfile.js";
import PostCard from "../components/PostCard.jsx";
import api from "../lib/Url.js";
import ProductCard from "../Components/Shop/ProductCard.jsx";
import { showConfirmationToast } from "../Components/DeleteComponent.jsx";

const MyListing = () => {
  const currentUser = UserProfile.GetUserData();
  const [venues, setVenues] = useState([]);
  const [shopItems, setShopItems] = useState([]);
  const [activeTab, setActiveTab] = useState("venues");
  const [venuesLoading, setVenuesLoading] = useState(false);
  const [shopItemsLoading, setShopItemsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadVenues = async () => {
    setVenuesLoading(true);
    try {
      const res = await api.get(`/post/user/${currentUser._id}`);
      setVenues(res.data);
    } catch (err) {
      const message = err.response?.data?.message || "Error loading posts";
      toast.error(message);
    } finally {
      setVenuesLoading(false);
    }
  };

  const loadShopItems = async () => {
    setShopItemsLoading(true);
    try {
      const res = await api.get(`/product/user/${currentUser._id}`);
      setShopItems(res.data);
    } catch (err) {
      const message = err.response?.data?.message || "Error loading posts";
      toast.error(message);
    } finally {
      setShopItemsLoading(false);
    }
  };

  useEffect(() => {
    loadVenues();
    loadShopItems();
  }, []);

const handlePostDelete = async (venueId, type) => {
  const isConfirmed = await showConfirmationToast({
    title: 'Delete Confirmation',
    message: `Are you sure you want to delete this ${type}? This action cannot be undone.`,
    variant: 'danger',
    confirmText: 'Yes, Delete',
    cancelText: 'Cancel',
    onConfirm: () => console.log(`Confirmed deletion of ${type}`),
    onCancel: () => console.log(`Cancelled deletion of ${type}`)
  });

  if (!isConfirmed) return;

  setLoading(true);
  const toastId = toast.loading(`Deleting ${type}...`);

  try {
    await api.delete(`/post/${venueId}`);
    toast.success(`${type} deleted successfully`);
    loadVenues();
  } catch (error) {
    console.error(`Error deleting ${type}:`, error);
    const message =
      error.response?.data?.message || `Failed to delete ${type}`;
    toast.error(message, { id: toastId });
  } finally {
    setLoading(false);
  }
};

const handleShopItemDelete = async (itemId) => {
  const isConfirmed = await showConfirmationToast({
    title: 'Delete Item',
    message: 'Are you sure you want to delete this item? This action cannot be undone.',
    variant: 'danger',
    confirmText: 'Yes, Delete',
    cancelText: 'Cancel',
    onConfirm: () => console.log('Confirmed item deletion'),
    onCancel: () => console.log('Cancelled item deletion')
  });

  if (!isConfirmed) return;

  setLoading(true);
  const toastId = toast.loading("Deleting item...");

  try {
    await api.delete(`/product/${itemId}`);
    toast.success("Item deleted successfully");
    loadShopItems();
  } catch (error) {
    console.error("Delete error:", error);
    const message = error.response?.data?.message || "Failed to delete item";
    toast.error(message, { id: toastId });
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("venues")}
              className={`px-6 py-3 font-medium text-sm flex items-center ${activeTab === "venues" ? "text-brand-blue border-b-2 border-brand-blue" : "text-gray-500 hover:text-gray-700"}`}
            >
              <AiOutlineHome className="mr-2" />
              My Venues
            </button>
            <button
              onClick={() => setActiveTab("shop")}
              className={`px-6 py-3 font-medium text-sm flex items-center ${activeTab === "shop" ? "text-brand-blue border-b-2 border-brand-blue" : "text-gray-500 hover:text-gray-700"}`}
            >
              <AiOutlineShop className="mr-2" />
              Shop Items
            </button>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {activeTab === "venues" ? (
              <>
                {venuesLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loading />
                    <p className="mt-4 text-brand-blue font-medium">
                      Loading your venues...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <button
                      onClick={() => navigate("/create_post")}
                      className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand-blue hover:bg-blue-50 transition-colors mb-6"
                    >
                      <BsFillPlusSquareFill
                        className="text-brand-blue mr-2"
                        size={20}
                      />
                      <span className="font-medium text-brand-blue">
                        Add New Venue
                      </span>
                    </button>

                    {venues?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {venues?.map((venue) => (
                          <PostCard
                            key={venue._id}
                            postInfo={{
                              post: {
                                ...venue,
                                title: venue.name,
                                description: venue.description,
                                image:
                                  venue.images?.[0] || "/default-venue.jpg",
                              },
                              handlePostDelete: handlePostDelete,
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">
                          You haven't added any venues yet.
                        </p>
                        <button
                          onClick={() => navigate("/create_post")}
                          className="mt-4 text-brand-blue font-medium hover:underline"
                        >
                          Add your first venue
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                {shopItemsLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loading />
                    <p className="mt-4 text-brand-blue font-medium">
                      Loading your shop items...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <button
                      onClick={() => navigate("/create_shopitem")}
                      className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand-blue hover:bg-blue-50 transition-colors mb-6"
                    >
                      <BsFillPlusSquareFill
                        className="text-brand-blue mr-2"
                        size={20}
                      />
                      <span className="font-medium  text-brand-blue">
                        Add New Shop Item
                      </span>
                    </button>

                    {shopItems.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {shopItems?.map((item) => (
                         <ProductCard product={item} handleShopItemDelete={handleShopItemDelete} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">
                          You haven't added any shop items yet.
                        </p>
                        <button
                          onClick={() => navigate("/create_shop_item")}
                          className="mt-4 text-brand-blue font-medium hover:underline"
                        >
                          Add your first item
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyListing;
