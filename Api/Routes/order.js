
const Stripe = require("stripe");
const express = require("express")
const router = express.Router();



const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
router.post("/create-checkout-session", async (req, res) => {
  const { items } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map(item => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // Make sure it's an integer
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: "http://localhost:5173/shop",
      cancel_url: "http://localhost:5173/shop",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe session creation failed:", error.message);
    res.status(400).json({ error: error.message });
  }
});


module.exports = router
