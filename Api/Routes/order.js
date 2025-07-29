const Stripe = require("stripe");
const express = require("express");
const Product = require("../Models/Product.model");
const orderModel = require("../Models/order.model");
const router = express.Router();
const bodyParser = require("body-parser");
const throwError = require("../Helper/error");
const verifyToken = require("../Helper/verifyToken");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
router.post("/create-checkout-session", verifyToken, async (req, res) => {
  const { items, shippingAddress } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url:
        "https://venueverse-cyan.vercel.app/shop-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://venueverse-cyan.vercel.app/shop?canceled=true",
      metadata: {
        userId: req.user._id,
        shippingAddress: JSON.stringify(shippingAddress),
        items: JSON.stringify(items),
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe session creation failed:", error.message);
    next(err);
  }
});

router.post("/confirm-order", verifyToken, async (req, res, next) => {
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return next(throwError(400, "Payment not completed."));
    }

    const userId = session.metadata.userId;
    const shippingAddress = JSON.parse(session.metadata.shippingAddress);
    const itemsFromClient = JSON.parse(session.metadata.items);

    let totalAmount = 0;
    const items = [];

    for (const item of itemsFromClient) {
      const product = await Product.findById(item.id);
      if (!product) continue;

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      items.push({
        product: product._id,
        quantity: item.quantity,
      });
    }

    const newOrder = new orderModel({
      user: userId,
      items,
      shippingAddress,
      totalAmount,
      status: "processing",
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Failed to confirm order:", err.message);
    next(err);
  }
});

router.get("/", verifyToken, async (req, res, next) => {
  try {
    const orders = await orderModel
      .find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product");

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
});

router.get("/paginated", verifyToken, async (req, res, next) => {
  try {
    const sellerId = req.user._id;

    // Pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Step 1: Get all product IDs for this seller
    const products = await Product.find({ userId: sellerId }, "_id");
    const productIds = products.map((p) => p._id);

    // Step 2: Find orders that include these products
    const filter = { "items.product": { $in: productIds } };

    // Total count (for pagination metadata)
    const total = await orderModel.countDocuments(filter);

    // Step 3: Paginated orders
    const orders = await orderModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username email phone")
      .populate("items.product")
      .exec();

    res.status(200).json({
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalOrders: total,
      orders,
    });
  } catch (err) {
    next(err);
  }
});

router.put("/status/:orderId", async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return next(throwError(400, "Order status is required."));
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      next(throwError(404, "Order not found"));
    }

    res.status(200).json({
      message: "Order status updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
