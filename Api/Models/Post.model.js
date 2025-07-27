const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      required: true,
      type: String,
    },
    description: {
      required: true,
      type: String,
    },
    type:{
      type:String,
        required:true,
        enum: ["service","venue"] 
    },
    address: {
      type: String,
    },
    area: {
      type: Number,
    },
    capacity:{
      type:Number
    },
    offer: {
      type: Boolean,
      required: true,
    },
    venuetype:{
      type:String
    },
    price: {
      required: true,
      type: Number,
    },
    discountPrice: {
      type: Number,
    },
    imgUrl: {
      type: Array,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
     operationDays: [String],
    operationHours: {
      open: String, // "09:00"
      close: String,   // "18:00"
    },
  },
  { timestamps: true }
);

const post = mongoose.model("Post",postSchema );

module.exports = post
