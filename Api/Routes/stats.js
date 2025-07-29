const express = require('express');
const User = require('../Models/User.model');
const throwError = require('../Helper/error');
const orderModel = require('../Models/order.model');
const post = require('../Models/Post.model');
const Booking = require('../Models/Booking.model');
const Product = require('../Models/Product.model'); // You forgot to import this
const verifyToken = require('../Helper/verifyToken');
const router = express.Router();

router.get('/',verifyToken, async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return next(throwError(400, 'userId is required'));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(throwError(404, 'User not found'));
    }

    // Parse startDate and endDate from query or use defaults (current month)
    const now = new Date();
    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : new Date(now.getFullYear(), now.getMonth(), 1);

    const endDate = req.query.endDate
      ? new Date(req.query.endDate)
      : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // 1. Get all product IDs owned by this user
    const products = await Product.find({ userId }, '_id');
    const productIds = products.map(p => p._id);

    // 2. Get orders for those products in date range
    const orders = await orderModel.find({
      createdAt: { $gte: startDate, $lte: endDate },
      'items.product': { $in: productIds }
    });

    // 3. Get all post IDs owned by this user
    const posts = await post.find({userId }, '_id');
    const postIds = posts.map(p => p._id);

    // 4. Get bookings that reference those posts (venue or service)
    const bookings = await Booking.find({
      createdAt: { $gte: startDate, $lte: endDate },
      $or: [
        { venueId: { $in: postIds } },
        { serviceId: { $in: postIds } }
      ]
    });

    // 5. Calculate stats
    const totalBookings = bookings.length;
    const totalOrders = orders.length;

    const bookingRevenue = bookings.reduce((sum, b) => sum + (b.price || 0), 0);
    const orderRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    res.status(200).json({
      stats: {
        totalBookings,
        totalOrders,
        totalRevenue: bookingRevenue + orderRevenue,
        bookingRevenue,
        orderRevenue,
        range: {
          startDate,
          endDate
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
