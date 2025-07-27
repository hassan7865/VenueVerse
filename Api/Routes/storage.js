const express = require("express");
const route = express.Router();
const multer = require("multer");
const { v2 } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const throwError = require("../Helper/error");
const  verifyToken  = require("../Helper/verifyToken");
require("dotenv").config()
v2.config({
  cloud_name:'dzndd6axl',
  api_key:'823422853274815',
  api_secret:'pPqYWSzdo4IaXhoRA8jsQIVzRC0',
});
const storage = new CloudinaryStorage({
  cloudinary: v2,
  params: {
    folder: "VenueVenture",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});
const upload = multer({ storage });
route.post('/upload', upload.array('images', 10), (req, res) => {
  if (req.files && req.files.length > 0) {
    return res.status(200).json({
      message: 'Images uploaded successfully',
      images: req.files,
    });
  } else {
    res.status(400).json({ error: 'Image upload failed' });
  }
});

route.delete("/delete",verifyToken,async(req,res)=>{

  try {
    const {public_id} = req.body
    const result = await v2.uploader.destroy(public_id);
    if (result.result === "ok") {
     return  res.status(200).json({ message: "Image deleted successfully" });
    } else {
      throwError(400,"Failed to delete image")
    }
  } catch (error) {
    throwError(error)
  }
})


module.exports = route