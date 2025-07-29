const express = require("express");
const router = express.Router();
const throwError = require("../Helper/error");
const verifyToken = require("../Helper/verifyToken");
const ReviewsModel = require("../Models/Reviews.model");

router.post("/", verifyToken, async (req, res, next) => {
  try {
    const { type, sourceId, rating, comment } = req.body;

    if (!type || !sourceId || !rating || !comment) {
      return next(throwError(400, "Missing required fields"));
    }

    const review = new ReviewsModel({
      type,
      sourceId,
      rating,
      comment,
      userId: req.user._id,
    });
    await review.save();

    const populatedReview = await ReviewsModel.findById(review._id)
      .populate("userId", "username email avatar")
      .lean();

    // Format to match GET return format
    const { userId, ...rest } = populatedReview;
    const formattedReview = {
      ...rest,
      user: userId,
    };

    res
      .status(201)
      .json({ success: true, message: "Review created", review:formattedReview });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const { type, sourceId } = req.query;

    if (!type || !sourceId) {
      return next(throwError(400, "type and sourceId are required"));
    }

    const reviews = await ReviewsModel.find({ type, sourceId })
      .populate("userId", "username email avatar")
      .sort({ createdAt: -1 })
      .lean(); // Convert Mongoose docs to plain objects

    // Flatten userId into user and remove userId
    const formattedReviews = reviews.map((review) => {
      const { userId, ...rest } = review;
      return {
        ...rest,
        user: userId, // move populated user to 'user' field
      };
    });

    res.status(200).json({ success: true, reviews: formattedReviews });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
