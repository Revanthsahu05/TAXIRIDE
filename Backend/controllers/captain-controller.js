const { validationResult } = require("express-validator");
const Captain = require("../models/captain-model");
const BlacklistToken = require("../models/blacklisttoken-model");
const { createcaptain } = require("../services/captain-services");
const dbgr = require("debug")("development:controllers:captain-controller");
const jwt = require("jsonwebtoken");
module.exports.registerCaptain = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { fullname, email, password, vechile } = req.body;
    const { vechiletype, color, Plate, capacity } = vechile;
    const { firstname, lastname } = fullname;
    const hashedpassword = await Captain.hashpassword(password);
    dbgr(
      firstname,
      lastname,
      email,
      password,
      vechiletype,
      color,
      Plate,
      capacity
    );
    const exist = await Captain.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Captain already exists" });
    }
    const { captain, token } = await createcaptain({
      firstname,
      lastname,
      email,
      password: hashedpassword,
      vechiletype,
      color,
      Plate,
      capacity,
    });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 3600000,
    });

    return res.status(201).json({ captain, token });
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
    captain.password = undefined;
    const token = await captain.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 3600000,
    });
    return res.status(200).json({ captain, token });
  } catch (error) {
    next(error);
  }
};
module.exports.logout = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }
    res.clearCookie("token");
    await BlacklistToken.create({ token });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
module.exports.profile = async (req, res, next) => {
  try {
    return res.status(200).json({ captain: req.captain });
  } catch (error) {
    dbgr(error.message)
  }
};