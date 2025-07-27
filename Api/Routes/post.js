const express = require("express");
const verifyToken = require("../Helper/verifyToken");
const post = require("../Models/Post.model");
const User = require("../Models/User.model");
const throwError = require("../Helper/error");
const route = express.Router();

route.post("/save", verifyToken, async (req, res, next) => {
  try {
    const newPost = new post({
      ...req.body,
      userId: req.user._id,
    });
    const savedPost = await newPost.save();
    return res.status(201).json(savedPost);
  } catch (err) {
    next(err);
  }
});

route.get("/:id", async (req, res, next) => {
  try {
    const getPost = await post.findById(req.params.id);
    if (!getPost) {
      return throwError(400,"Post not found" );
    }

    const user = await User.findById(getPost.userId).select(
      "email phone username avatar"
    );

    return res.status(200).json({
      ...getPost._doc,
      user: user ? user._doc : null,
    });
  } catch (err) {
    next(err);
  }
});
route.get("/user/:id", verifyToken, async (req, res, next) => {
  try {
    const getPost = await post.find({ userId: req.params.id });
    return res.status(200).json(getPost);
  } catch (err) {
    next(err);
  }
});

route.put("/:id", verifyToken, async (req, res, next) => {
  try {
    const updatePost = await post.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    return res.status(200).json(updatePost);
  } catch (err) {
    next(err);
  }
});

route.delete("/:id", verifyToken, async (req, res, next) => {
  try {
    await post.findByIdAndDelete(req.params.id);
    return res.status(200).json("Post Deleted Successfully");
  } catch (err) {
    next(err);
  }
});

route.get("/", async (req, res, next) => {
  try {
    const searchTerm = req.query.searchTerm || "";
    const type = req.query.type || "";
    const offer = req.query.offer === "true";
    const capacity = parseInt(req.query.capacity) || null;
    const venuetype = req.query.venuetype || "";
    const page = parseInt(req.query.page) || 1;

    const query = {
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { address: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ],
    };

    // Additional filters
    if (type && type !== "all") {
      query.type = type;
    }

    if (offer === true) {
      query.offer = true;
    }

    if (capacity) {
      query.capacity = { $gte: capacity, $lte: capacity + 50 };
    }

    if (venuetype) {
      query.venuetype = venuetype;
    }

    const limit = 10;
    const skip = (page - 1) * limit;

    const listings = await post.find(query).skip(skip).limit(limit);
    const total = await post.countDocuments(query);

    return res.status(200).json({
      listings,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error("Error in search route:", err);
    next(err);
  }
});

module.exports = route;
