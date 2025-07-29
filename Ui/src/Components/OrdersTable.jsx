import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  FiEdit,
  FiChevronLeft,
  FiChevronRight,
  FiLoader,
  FiEye,
  FiX,
} from "react-icons/fi";
import api from "../lib/Url";
import toast from "react-hot-toast";
import Loading from "./Loading";

const OrdersTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalPages: 1,
    totalOrders: 0,
  });

  // Status options
  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const { page, limit } = pagination;
      const res = await api.get(`/order/paginated`, {
        params: {
          page,
          limit,
        },
      });

      setOrders(res.data.orders);
      setPagination({
        page: res.data.page,
        limit: res.data.limit,
        totalPages: res.data.totalPages,
        totalOrders: res.data.totalOrders,
      });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pagination.page]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setIsUpdating(true);

      await api.put(`/order/status/${orderId}/`, { status: newStatus });

      await fetchOrders();
      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsOpen(true);
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Recent Orders
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center">
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <Loading />
                      <p className="font-heading text-slate-900 text-lg sm:text-2xl mt-4">
                        Loading...
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.orderNumber || order._id.slice(-6)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.orderDate || order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.user?.username || "Guest"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => viewOrderDetails(order)}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View {order.items.length} items
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "PKR",
                    }).format(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      disabled={isUpdating}
                      className={`block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-sm ${
                        order.status === "pending"
                          ? "bg-yellow-50 text-yellow-800 ring-yellow-300"
                          : order.status === "processing"
                            ? "bg-blue-50 text-blue-800 ring-blue-300"
                            : order.status === "shipped"
                              ? "bg-indigo-50 text-indigo-800 ring-indigo-300"
                              : order.status === "delivered"
                                ? "bg-green-50 text-green-800 ring-green-300"
                                : "bg-red-50 text-red-800 ring-red-300"
                      } ring-1 ring-inset focus:ring-2 focus:ring-offset-2`}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => viewOrderDetails(order)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="View details"
                    >
                      <FiEye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        // Handle edit action
                      }}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      title="Edit order"
                    >
                      <FiEdit className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-[100]"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center border-b p-4">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900"
                    >
                      Order #
                      {selectedOrder?.orderNumber ||
                        selectedOrder?._id.slice(-6)}
                    </Dialog.Title>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => setIsOpen(false)}
                    >
                      <FiX className="h-6 w-6" />
                    </button>
                  </div>

                  {selectedOrder && (
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Customer Information
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="text-gray-600">Name:</span>{" "}
                              {selectedOrder.user?.username || "Guest"}
                            </p>
                            <p>
                              <span className="text-gray-600">Email:</span>{" "}
                              {selectedOrder.user?.email || "N/A"}
                            </p>
                            <p>
                              <span className="text-gray-600">Phone:</span>{" "}
                              {selectedOrder.user?.phone || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Order Information
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="text-gray-600">Date:</span>{" "}
                              {formatDate(
                                selectedOrder.orderDate ||
                                  selectedOrder.createdAt
                              )}
                            </p>
                            <p>
                              <span className="text-gray-600">Status:</span>
                              <span
                                className={`ml-1 px-2 py-1 rounded-full text-xs ${
                                  selectedOrder.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : selectedOrder.status === "processing"
                                      ? "bg-blue-100 text-blue-800"
                                      : selectedOrder.status === "shipped"
                                        ? "bg-indigo-100 text-indigo-800"
                                        : selectedOrder.status === "delivered"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                }`}
                              >
                                {selectedOrder.status}
                              </span>
                            </p>
                            <p>
                              <span className="text-gray-600">Total:</span>
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "PKR",
                              }).format(selectedOrder.totalAmount)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Shipping Address
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          {selectedOrder.shippingAddress ? (
                            <>
                              <p>{selectedOrder.shippingAddress.street}</p>
                              <p>
                                {selectedOrder.shippingAddress.city},{" "}
                                {selectedOrder.shippingAddress.state}
                              </p>
                              <p>{selectedOrder.shippingAddress.postalCode}</p>
                            </>
                          ) : (
                            <p className="text-gray-500">
                              No shipping address provided
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          Order Items ({selectedOrder.items.length})
                        </h4>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Product
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Quantity
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Price
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Subtotal
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {selectedOrder.items.map((item, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                                    <div className="flex items-center">
                                      {item.product?.images[0]?.url && (
                                        <img
                                          src={item.product.images[0]?.url}
                                          alt={item.product.name}
                                          className="w-10 h-10 rounded-md object-cover mr-3"
                                        />
                                      )}
                                      <div>
                                        <p className="font-medium text-gray-900">
                                          {item.product?.name ||
                                            "Unknown Product"}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {item.quantity}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {item.product?.price
                                      ? new Intl.NumberFormat("en-US", {
                                          style: "currency",
                                          currency: "PKR",
                                        }).format(item.product.price)
                                      : "N/A"}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {new Intl.NumberFormat("en-US", {
                                      style: "currency",
                                      currency: "PKR",
                                    }).format(
                                      (item.product?.price || 0) * item.quantity
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t p-4 flex justify-end">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(
              pagination.page * pagination.limit,
              pagination.totalOrders
            )}{" "}
            of {pagination.totalOrders} orders
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1 || isLoading}
              className={`p-2 rounded-md ${pagination.page === 1 || isLoading ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  disabled={isLoading}
                  className={`w-10 h-10 rounded-md flex items-center justify-center ${
                    pagination.page === page
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages || isLoading}
              className={`p-2 rounded-md ${pagination.page === pagination.totalPages || isLoading ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
