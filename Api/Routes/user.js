const express = require("express");
const verifyToken = require("../Helper/verifyToken");
const User = require("../Models/User.model");
const throwError = require("../Helper/error");
const route = express.Router();

route.put("/:id", verifyToken, async (req, res, next) => {
  try {
    if (req.params.id !== req.user._id) {
      return next(throwError(403, "You can only change your profile"));
    }

    const updates = req.body;

    if (updates.username || updates.email || updates.phone) {
      const existingUser = await User.findOne({
        $or: [
          ...(updates.username ? [{ username: updates.username }] : []),
          ...(updates.email ? [{ email: updates.email }] : []),
          ...(updates.phone ? [{ phone: updates.phone }] : []),
        ],
        _id: { $ne: req.params.id },
      });

      if (existingUser) {
        if (existingUser.username === updates.username) {
          return next(throwError(400, "Username already exists"));
        }
        if (existingUser.email === updates.email) {
          return next(throwError(400, "Email already exists"));
        }
        if (existingUser.phone === updates.phone) {
          return next(throwError(400, "Phone number already exists"));
        }
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return next(throwError(404, "User not found"));
    }

    const { password, ...rest } = updatedUser.toObject();
    return res.status(200).json(rest);
  } catch (err) {
    next(err);
  }
});

route.get("/search", verifyToken, async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      return next(throwError(400, "Email query parameter is required"));
    }

    const users = await User.find({
      email: { $regex: email, $options: "i" },
    }).select("-password");

    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

route.get("/:id", async (req, res, next) => {
  try {
    const  userId = req.params.id;

    if (!userId) {
      return next(throwError(400, "userId query parameter is required"));
    }

    const user = await User.findById(userId);

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = route;
