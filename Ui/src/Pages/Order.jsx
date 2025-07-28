import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Calendar,
  MapPin,
  ShoppingBag,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
} from "lucide-react";
import Loading from "../Components/Loading";
import UserProfile from "../../UserProfile";
import api from "../lib/Url";

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = UserProfile.GetUserData();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/order`);
        setOrders(response.data);
      } catch (error) {
        toast.error("Failed to fetch orders");
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAddress = (shippingAddress) => {
    if (!shippingAddress || !shippingAddress.street)
      return "No address provided";
    return `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />;
      case "processing":
        return <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />;
      case "shipped":
        return <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-brand-blue" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />;
      case "pending":
        return <Package className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />;
      default:
        return <Package className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-brand-blue/10 text-brand-blue";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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

  if (!currentUser && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-brand-blue/10 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white shadow-lg rounded-xl sm:rounded-2xl overflow-hidden">
            <div className="p-6 sm:p-12 text-center">
              <div className="bg-gray-50 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                No Orders Found
              </h3>
              <p className="text-sm sm:text-base text-gray-500">
                No orders found for this user. Start shopping to see orders here!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-brand-blue/10 py-4 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        {currentUser && (
          <div className="bg-white shadow-lg sm:shadow-xl rounded-xl sm:rounded-2xl overflow-hidden mb-6 sm:mb-8">
            <div className="bg-gradient-to-r from-brand-blue to-brand-blue/90 px-4 py-4 sm:px-8 sm:py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                    {currentUser.username || currentUser.name || "User"}'s Orders
                  </h1>
                  {currentUser.email && (
                    <p className="text-white text-sm sm:text-base lg:text-lg mt-1">
                      {currentUser.email}
                    </p>
                  )}
                </div>
                <div className="sm:block">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 sm:px-4 sm:py-2">
                    <p className="text-white/90 text-xs sm:text-sm">Total Orders</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                      {orders.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-md sm:shadow-lg rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 sm:hover:-translate-y-1"
            >
              <div className="p-4 sm:p-6 lg:p-8">
                {/* Order Header */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3 sm:mb-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </h3>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span
                            className={`text-xs sm:text-sm font-semibold px-2 py-1 sm:px-3 sm:py-1 rounded-full ${getStatusColor(order.status)}`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {order.items.length} item
                          {order.items.length > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      <div className="flex items-center text-gray-600">
                        <div className="bg-brand-blue/10 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-brand-blue" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500 font-medium">
                            Order Date
                          </p>
                          <p className="text-sm sm:text-base font-semibold">
                            {formatDate(order.orderDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <div className="bg-purple-50 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                          <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500 font-medium">
                            Last Updated
                          </p>
                          <p className="text-sm sm:text-base font-semibold">
                            {formatDate(order.updatedAt)}
                          </p>
                        </div>
                      </div>

                      {order.shippingAddress &&
                        order.shippingAddress.street && (
                          <div className="flex items-center text-gray-600 sm:col-span-2 lg:col-span-1">
                            <div className="bg-orange-50 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                                Shipping Address
                              </p>
                              <p className="text-sm sm:text-base font-semibold truncate">
                                {formatAddress(order.shippingAddress)}
                              </p>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Products Section */}
                <div className="border-t border-gray-200 pt-4 sm:pt-6">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-600" />
                    Products in this order
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {order.items.map((item, index) => (
                      <div
                        key={item.product?._id || index}
                        className="bg-gray-50 rounded-lg p-3 sm:p-4 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex items-start space-x-3">
                          {item.product?.images[0]?.url && (
                            <img
                              src={item.product.images[0].url}
                              alt={item.product.name || "Product"}
                              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1 truncate">
                              {item.product?.name || "Product Name"}
                            </h5>
                          
                            <div className="flex items-center justify-between">
                              <span className="text-xs sm:text-sm text-gray-600">
                                Qty: {item.quantity}
                              </span>
                              {item.product?.price && (
                                <span className="font-bold text-gray-900 text-xs sm:text-sm">
                                  ${item.product.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserOrdersPage;