const dbgr = require("debug")("development:controllers:user-controller");
const usermodel = require("../models/user-model");
const { createuser } = require("../services/user-services");
const { validationResult } = require("express-validator");
const BlacklistToken = require("../models/blacklisttoken-model");
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

    const token = user.generateAuthToken();

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 3600000,
    });

    res.status(201).json({ user, token });

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
    const token = await user.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 3600000, // 24 hour
    });

    res.status(201).json({ user, token });
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
    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }
    res.clearCookie("token");
    await BlacklistToken.create({ token });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports.googleCallback = async (req, res) => {
  try {
    const user = req.user;
    const token = await user.generateAuthToken();

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 3600000,
    });

    // Redirect to frontend with token (optional, but good for type indication)
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/google-callback?token=${token}&type=user`);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};