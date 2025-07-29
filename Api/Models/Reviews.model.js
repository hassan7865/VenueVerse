const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["product", "venue", "service"],
      required: true,
    },
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Review", reviewSchema);
