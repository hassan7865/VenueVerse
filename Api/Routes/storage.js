const express = require("express");
const route = express.Router();
const multer = require("multer");
const { v2 } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const throwError = require("../Helper/error");
const verifyToken = require("../Helper/verifyToken");
require("dotenv").config();

v2.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDINARYAPIKEY,
  api_secret: process.env.CLOUDINARYAPISECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: v2,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video/");
    return {
      folder: "VenueVenture",
      resource_type: isVideo ? "video" : "image",
      allowed_formats: isVideo
        ? ["mp4", "mov", "avi", "webm"]
        : ["jpg", "jpeg", "png"],
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB limit
  },
});

route.post("/upload", upload.array("images", 10), (req, res) => {
  if (req.files && req.files.length > 0) {
    return res.status(200).json({
      message: "Files uploaded successfully",
      images: req.files,
    });
  } else {
    res.status(400).json({ error: "Upload failed" });
  }
});

route.delete("/delete", verifyToken, async (req, res) => {
  try {
    const { public_id, type = "image" } = req.body;

    const result = await v2.uploader.destroy(public_id, {
      resource_type: type === "video" ? "video" : "image",
    });

    if (result.result === "ok") {
      return res.status(200).json({ message: "File deleted successfully" });
    } else {
      throwError(400, "Failed to delete file");
    }
  } catch (error) {
    throwError(error);
  }
});

module.exports = route;
