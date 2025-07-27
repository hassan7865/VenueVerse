const express = require("express");
const verifyToken = require("../Helper/verifyToken");
const User = require("../Models/User.model");
const throwError = require("../Helper/error");
const route = express.Router();

route.put("/:id", verifyToken, async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id) {
      return next(throwError(403, "You can only change your profile"));
    }

    const { username, email, phone, avatar } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }, { phone: phone }],
      _id: { $ne: req.params.id },
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return next(throwError(400, "Username already exists"));
      }
      if (existingUser.email === email) {
        return next(throwError(400, "Email already exists"));
      }
      if (existingUser.phone === phone) {
        return next(throwError(400, "Phone number already exists"));
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username,
          email,
          phone,
          avatar,
        },
      },
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

route.get("/:id", verifyToken, async (req, res, next) => {
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
