import React, { useState, useEffect } from "react";
import {
  FiCalendar,
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
} from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../lib/Url";
import OrdersTable from "../Components/OrdersTable";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalOrders: 0,
    totalRevenue: 0,
    bookingRevenue: 0,
    orderRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date(),
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { startDate, endDate } = dateRange;
      const res = await api.get("/stats", {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      console.log(res.data);
      setStats(res.data.stats);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PKR",
    }).format(amount);
  };

  const cardData = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: <FiCalendar className="w-5 h-5 text-blue-500" />,
      color: "bg-blue-100",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <FiShoppingBag className="w-5 h-5 text-purple-500" />,
      color: "bg-purple-100",
    },
    {
      title: "Booking Revenue",
      value: formatCurrency(stats.bookingRevenue),
      icon: <FiDollarSign className="w-5 h-5 text-green-500" />,
      color: "bg-green-100",
    },
    {
      title: "Order Revenue",
      value: formatCurrency(stats.orderRevenue),
      icon: <FiDollarSign className="w-5 h-5 text-orange-500" />,
      color: "bg-orange-100",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: <FiTrendingUp className="w-5 h-5 text-indigo-500" />,
      color: "bg-indigo-100",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <DatePicker
            selected={dateRange.startDate}
            onChange={(date) => setDateRange({ ...dateRange, startDate: date })}
            selectsStart
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            className="border rounded-md p-2 text-sm w-full"
            placeholderText="Start Date"
          />
          <DatePicker
            selected={dateRange.endDate}
            onChange={(date) => setDateRange({ ...dateRange, endDate: date })}
            selectsEnd
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            minDate={dateRange.startDate}
            className="border rounded-md p-2 text-sm w-full"
            placeholderText="End Date"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {cardData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-full ${item.color}`}>
                  {item.icon}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500">
                  {item.title}
                </h3>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <OrdersTable />
    </div>
  );
};

export default Dashboard;
