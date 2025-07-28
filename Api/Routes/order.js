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
  console.log(shippingAddress);

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
        "http://localhost:5173/shop-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/shop?canceled=true",
      metadata: {
        userId: req.user._id,
        shippingAddress: JSON.stringify(shippingAddress),
        items: JSON.stringify(items),
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe session creation failed:", error.message);
    throwError((400, error.message));
  }
});

router.post("/confirm-order", verifyToken, async (req, res, next) => {
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Payment not completed." });
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
    console.error("❌ Failed to confirm order:", err.message);
    res.status(500).json({ error: err.message });
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

module.exports = router;
