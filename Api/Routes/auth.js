const express = require("express");
const User = require("../Models/User.model");
const  throwError  = require("../Helper/error");
const bcrypt = require("bcrypt");
const route = express.Router();
const jwt = require("jsonwebtoken");
const verifyToken = require("../Helper/verifyToken");
require("dotenv").config()

route.post("/signup", async (req, res, next) => {
  const { username, email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [
        { username: username },
        { email: email },
        { phone: phone },
      ],
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

  
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const newUser = new User({ username, email, phone, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    next(error); 
  }
});
route.post("/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const validUser = await User.findOne({ email });
    if (!validUser) return next(throwError(401, "Invalid Credentials!"));

    const isValidPassword = bcrypt.compareSync(password, validUser.password);
    if (!isValidPassword) return next(throwError(401, "Invalid Credentials!"));

    const token = jwt.sign(
      { _id: validUser._id, email: validUser.email }, // Customize payload as needed
      process.env.JWT,
      { expiresIn: "7d" }
    );

    const { password: _, ...userData } = validUser._doc;

    return res.status(200).json({
      token, 
      user: userData, 
    });
  } catch (error) {
    next(error);
  }
});


route.get("/signout",verifyToken,async(req,res,next)=>{
  try {
    res.clearCookie("access_token_venture");
    res.status(200).json("User Deleted Successfully!");
  } catch (error) {
    next(error);
  }
})


module.exports = route