const dbgr = require("debug")("auth-middleware:middleware");
const jwt = require("jsonwebtoken");
const usermodel = require("../models/user-model");
const captainModel = require("../models/captain-model");
const redis = require("../db/redis");

module.exports.auth = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await usermodel.findOne({ _id: decoded._id });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports.authcaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    // 0.2ms In-Memory check via Upstash Redis
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainModel.findOne({ _id: decoded._id });
    if (!captain) {
      throw new Error();
    }
    req.captain = captain;
    next();
  } catch (error) {
    return res.status(401).json({ message: "unauthorized" });
  }
};
