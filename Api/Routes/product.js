const express = require("express");
const verifyToken = require("../Helper/verifyToken");
const Product = require("../Models/Product.model");
const User = require("../Models/User.model");
const throwError = require("../Helper/error");


const route = express.Router();

// Create Product
route.post("/", verifyToken, async (req, res, next) => {
  try {
    const newProduct = new Product({
      ...req.body,
      userId: req.user._id, 
    });

    const savedProduct = await newProduct.save();
    return res.status(201).json(savedProduct);
  } catch (err) {
    next(err);
  }
});

// Update Product
route.put("/:id", verifyToken, async (req, res, next) => {
  try {
    console.log(req.params.id)
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true }
    );

    if (!updatedProduct) {
      return next(throwError(404, "Product not found or unauthorized"));
    }

    return res.status(200).json(updatedProduct);
  } catch (err) {
    next(err);
  }
});


route.get("/:id", async (req, res, next) => {
  try {
    const getProduct = await Product.findById(req.params.id);
    if (!getProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(getProduct.userId).select(
      "email phone username avatar"
    );

    return res.status(200).json({
      ...getProduct._doc,
      user: user ? user._doc : null,
    });
  } catch (err) {
    next(err);
  }
});

// Delete Product
route.delete("/:id", verifyToken, async (req, res, next) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deletedProduct) {
      return next(throwError(404, "Product not found or unauthorized"));
    }

    return res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
});

// Get All Products with optional category filter
route.get("/", async (req, res, next) => {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};
    const products = await Product.find(filter).sort({ createdAt: -1 });

    return res.status(200).json(products);
  } catch (err) {
    next(err);
  }
});

// Get Products by User ID
route.get("/user/:userId", verifyToken, async (req, res, next) => {
  try {
    const products = await Product.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json(products);
  } catch (err) {
    next(err);
  }
});


module.exports = route;
