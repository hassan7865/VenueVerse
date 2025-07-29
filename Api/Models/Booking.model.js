const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["venue", "service"],
      required: true,
    },

    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },

    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },

    durationHours: { type: Number },
    price: { type: Number, required: true },

    notes: String,
  },
  { timestamps: true }
);

bookingSchema.pre("save", function (next) {
  if (this.startTime && this.endTime) {
    const diff =
      (new Date(this.endTime) - new Date(this.startTime)) / (1000 * 60 * 60);
    this.durationHours = parseFloat(diff.toFixed(2));
  }
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
