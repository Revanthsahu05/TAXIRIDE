const dbgr = require("debug")("development:controllers:user-controller");
const usermodel = require("../models/user-model");
const { createuser } = require("../services/user-services");
const { validationResult } = require("express-validator");
const redis = require("../db/redis");
const pendingUserModel = require('../models/pending-user-model');
const { sendOtpEmail } = require('../services/email-service');
const { generateOtp } = require('../utils/generateOtp');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports.userregister = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { fullname, password, email } = req.body;
    const { firstname, lastname } = fullname;

    const exist = await usermodel.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const pendingExist = await pendingUserModel.findOne({ email });
    if (pendingExist) {
      await pendingUserModel.deleteOne({ email });
    }
    const hashedpassword = await usermodel.hashpassword(password);
    // Generate a 6-digit OTP using secure generator
    const otp = generateOtp();

    // Hash the OTP before saving
    const otpHash = await bcrypt.hash(otp, 10);

    console.log("👉 Register Request Received:", email);
    const pendingUser = new pendingUserModel({
      fullname: {
        firstname: fullname.firstname,
        lastname: fullname.lastname
      },
      email,
      password: hashedpassword, // Ensure this is the hashed password
      otpHash: otpHash
    });

    await pendingUser.save();
    console.log("👉 Pending User Saved DB");

    // Send the plain OTP via email
    try {
      await sendOtpEmail(email, otp);
      console.log("👉 Email Sent Successfully");
    } catch (msgError) {
      console.warn("⚠️ Email failed to send (Check credentials).");
    }

    console.log(`\n🔑 DEV MODE OTP (${email}): ${otp} \n`);

    res.status(200).json({ message: 'OTP sent to your email', email });
    console.log("👉 Response Sent 200");
  } catch (error) {
    console.error("❌ Controller Error:", error);
    if (error.message === 'User already exists') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

module.exports.verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const pendingUser = await pendingUserModel.findOne({ email });

    if (!pendingUser) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const isMatch = await bcrypt.compare(otp, pendingUser.otpHash);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP is valid, proceed to create the actual user
    const user = await usermodel.create({
      fullname: pendingUser.fullname,
      email: pendingUser.email,
      password: pendingUser.password // Already hashed
    });

    await pendingUserModel.deleteOne({ email });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Store refresh token in Redis for 7 days (604800 seconds)
    await redis.set(`refresh_token:${user._id}`, refreshToken, { ex: 7 * 24 * 3600 });

    res.cookie("token", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 mins
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 3600 * 1000, // 7 days
    });

    res.status(201).json({ user, token: accessToken, refreshToken });

  } catch (error) {
    next(error);
  }
};
module.exports.userlogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await usermodel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    dbgr(`Logging in user: ${email}`);
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    user.password = undefined;

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Store refresh token in Redis for 7 days
    await redis.set(`refresh_token:${user._id}`, refreshToken, { ex: 7 * 24 * 3600 });

    res.cookie("token", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 mins
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 3600 * 1000, // 7 days
    });

    res.status(200).json({ user, token: accessToken, refreshToken });
  } catch (error) {
    dbgr("Error in user login:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports.profile = async (req, res, next) => {
  try {
    res.status(200).json({ user: req.user });
  }
  catch (err) {
    dbgr("Error in user profile:", err.message);
  }
}
module.exports.logout = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (token) {
      let remainingTime = 900; // 15 minutes default
      try {
        const decoded = jwt.decode(token);
        if (decoded && decoded.exp) {
          const nowInSec = Math.floor(Date.now() / 1000);
          remainingTime = Math.max(decoded.exp - nowInSec, 1);
        }
      } catch (e) {}

      // Blacklist access token in Redis until its expiration
      await redis.set(`blacklist:${token}`, "1", { ex: remainingTime });
    }

    if (req.user?._id) {
      // Invalidate refresh token in Redis
      await redis.del(`refresh_token:${req.user._id}`);
    }

    res.clearCookie("token");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    const refreshSecret = process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET + "_refresh");
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, refreshSecret);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    // Verify token exists in Redis
    const savedToken = await redis.get(`refresh_token:${decoded._id}`);
    if (!savedToken || savedToken !== refreshToken) {
      return res.status(401).json({ message: "Refresh token revoked or expired" });
    }

    const user = await usermodel.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    // Rotate refresh token in Redis for 7 days
    await redis.set(`refresh_token:${user._id}`, newRefreshToken, { ex: 7 * 24 * 3600 });

    res.cookie("token", newAccessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 3600 * 1000,
    });

    return res.status(200).json({ token: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    next(error);
  }
};

module.exports.googleCallback = async (req, res) => {
  try {
    const user = req.user;
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await redis.set(`refresh_token:${user._id}`, refreshToken, { ex: 7 * 24 * 3600 });

    res.cookie("token", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 3600 * 1000,
    });

    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/google-callback?status=success&type=user`);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};