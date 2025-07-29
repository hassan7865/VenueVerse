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
      return next(throwError(404,"Product not found" ));
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


route.get("/", async (req, res, next) => {
  try {
    const {
      searchTerm,
      category,
      sortBy,
      inStock,
      hasOffer,
      page = 1,
      limit = 12
    } = req.query;

    const matchStage = {};

    // Search filters
    if (searchTerm) {
      matchStage.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    if (category && category !== 'all') {
      matchStage.category = category;
    }

    if (inStock === 'true') {
      matchStage.stock = { $gt: 0 };
    }

    if (hasOffer === 'true') {
      matchStage.offer = true;
    }

    const sortOption = {};
    if (sortBy === 'price-low-high') {
      sortOption.effectivePrice = 1;
    } else if (sortBy === 'price-high-low') {
      sortOption.effectivePrice = -1;
    } else {
      sortOption.createdAt = -1; // default sort
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const lim = parseInt(limit);

    const products = await Product.aggregate([
      { $match: matchStage },

      // Add a computed field for sorting
      {
        $addFields: {
          effectivePrice: {
            $cond: {
              if: { $and: [ { $eq: ["$offer", true] }, { $ifNull: ["$discountedPrice", false] } ] },
              then: "$discountedPrice",
              else: "$price"
            }
          }
        }
      },

      { $sort: sortOption },
      { $skip: skip },
      { $limit: lim },

      // Optionally remove the helper field before returning
      {
        $project: {
          effectivePrice: 0
        }
      }
    ]);

    const total = await Product.countDocuments(matchStage);
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      products,
      currentPage: parseInt(page),
      totalPages,
      total
    });

  } catch (err) {
    next(err);
  }
});


route.get("/user/:userId", async (req, res, next) => {
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
