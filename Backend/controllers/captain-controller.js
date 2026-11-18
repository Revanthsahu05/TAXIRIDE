const { validationResult } = require("express-validator");
const Captain = require("../models/captain-model");
const PendingCaptain = require("../models/pending-captain-model");
const redis = require("../db/redis");
const { createcaptain } = require("../services/captain-services");
const { sendOtpEmail } = require("../services/email-service");
const dbgr = require("debug")("development:controllers:captain-controller");
const jwt = require("jsonwebtoken");
const { generateOtp } = require('../utils/generateOtp');
const bcrypt = require('bcrypt');
module.exports.registerCaptain = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { fullname, email, password } = req.body;
    const { firstname, lastname } = fullname;

    const exist = await Captain.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Captain already exists" });
    }

    const pendingExist = await PendingCaptain.findOne({ email });
    if (pendingExist) {
      await PendingCaptain.deleteOne({ email });
    }

    const hashedpassword = await Captain.hashpassword(password);
    // Generate secure OTP
    const otp = generateOtp();
    // Hash OTP
    const otpHash = await bcrypt.hash(otp, 10);

    const pendingCaptain = await PendingCaptain.create({
      fullname: {
        firstname,
        lastname
      },
      email,
      password: hashedpassword,
      otpHash // Store hash
    });

    try {
      await sendOtpEmail(email, otp);
    } catch (msgError) {
      console.warn("⚠️ Email failed to send (Check credentials).");
    }

    // For development convenience, logging OTP
    console.log(`\n🔑 DEV MODE OTP (${email}): ${otp} \n`);

    return res.status(201).json({ message: "OTP sent to email", email });
  } catch (error) {
    next(error);
  }
};

module.exports.verifyOtp = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp } = req.body;

    const pendingCaptain = await PendingCaptain.findOne({ email });

    if (!pendingCaptain) {
      return res.status(400).json({ message: "Invalid or expired OTP session" });
    }

    const isMatch = await bcrypt.compare(otp, pendingCaptain.otpHash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is correct
    const { firstname, lastname } = pendingCaptain.fullname;
    const password = pendingCaptain.password; // Already hashed

    const newCaptain = new Captain({
      fullname: {
        firstname,
        lastname
      },
      email,
      password, // This is already hashed
      status: 'active'
    });

    const captain = await newCaptain.save();

    // Remove pending record
    await PendingCaptain.deleteOne({ _id: pendingCaptain._id });

    const accessToken = captain.generateAccessToken();
    const refreshToken = captain.generateRefreshToken();

    // Store refresh token in Redis for 7 days
    await redis.set(`refresh_token:${captain._id}`, refreshToken, { ex: 7 * 24 * 3600 });

    res.cookie("token", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 mins
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 3600 * 1000, // 7 days
    });

    return res.status(201).json({ captain, token: accessToken, refreshToken });

  } catch (error) {
    next(error);
  }
};
module.exports.loginCaptain = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const captain = await Captain.findOne({ email }).select("+password");
    if (!captain) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    captain.status = "active";
    await captain.save();
    captain.password = undefined;

    const accessToken = captain.generateAccessToken();
    const refreshToken = captain.generateRefreshToken();

    // Store refresh token in Redis for 7 days
    await redis.set(`refresh_token:${captain._id}`, refreshToken, { ex: 7 * 24 * 3600 });

    res.cookie("token", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 mins
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 3600 * 1000, // 7 days
    });

    return res.status(200).json({ captain, token: accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};
module.exports.logout = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (token) {
      let remainingTime = 900;
      try {
        const decoded = jwt.decode(token);
        if (decoded && decoded.exp) {
          const nowInSec = Math.floor(Date.now() / 1000);
          remainingTime = Math.max(decoded.exp - nowInSec, 1);
        }
      } catch (e) {}

      // Blacklist access token in Redis
      await redis.set(`blacklist:${token}`, "1", { ex: remainingTime });
    }

    const captain = req.captain;
    if (captain) {
      captain.status = "inactive";
      await captain.save();
      // Remove refresh token from Redis
      await redis.del(`refresh_token:${captain._id}`);
    }

    res.clearCookie("token");
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logged out successfully" });
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

    const captain = await Captain.findById(decoded._id);
    if (!captain) {
      return res.status(401).json({ message: "Captain not found" });
    }

    const newAccessToken = captain.generateAccessToken();
    const newRefreshToken = captain.generateRefreshToken();

    // Rotate refresh token in Redis for 7 days
    await redis.set(`refresh_token:${captain._id}`, newRefreshToken, { ex: 7 * 24 * 3600 });

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
module.exports.profile = async (req, res, next) => {
  try {
    return res.status(200).json({ captain: req.captain });
  } catch (error) {
    dbgr(error.message);
  }
};

module.exports.updateVehicleInfo = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { color, Plate, capacity, vechiletype } = req.body;
    const captainId = req.captain._id;

    const updatedCaptain = await Captain.findByIdAndUpdate(
      captainId,
      {
        vechile: {
          color,
          Plate,
          capacity,
          vechiletype,
        },
      },
      { new: true }
    );

    return res.status(200).json({ captain: updatedCaptain });
  } catch (error) {
    next(error);
  }
};

module.exports.googleCallback = async (req, res) => {
  try {
    console.log("[CAPTAIN-CONTROLLER] Callback hit. User object keys:", Object.keys(req.user || {}));
    const captain = req.user; // Passport stores the authenticated entity in req.user by default

    if (!captain) {
      console.error("[CAPTAIN-CONTROLLER] No captain found in req.user");
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Ensure status is active on login
    if (captain.status !== 'active') {
      captain.status = 'active';
      await captain.save();
    }

    const accessToken = captain.generateAccessToken();
    const refreshToken = captain.generateRefreshToken();

    await redis.set(`refresh_token:${captain._id}`, refreshToken, { ex: 7 * 24 * 3600 });

    res.cookie("token", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 3600 * 1000,
    });

    // Redirect to frontend with token
    // Redirect to frontend without token (secure handoff via cookie)
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/google-callback?status=success&type=captain`);
  } catch (error) {
    console.error("[CAPTAIN-CONTROLLER] Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
