const dbgr = require("debug")("development:controllers:user-controller");
const usermodel = require("../models/user-model");  
const { createuser } = require("../services/user-services");
const { validationResult } = require("express-validator");
const BlacklistToken = require("../models/blacklisttoken-model");
module.exports.userregister = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullname, password, email } = req.body;
  const { firstname, lastname } = fullname;
  const hashedpassword=await usermodel.hashpassword(password);
//   dbgr(req.body);
  const {user,token}=await createuser({firstname,lastname,password:hashedpassword,email});
   res.status(201).json({ user,token });
    // res.send("User registered");
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
    user.password=undefined;
    const token = await user.generateAuthToken(); 
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24*3600000, // 24 hour
    });

    res.status(200).json({ user, token });
  } catch (error) {
    dbgr("Error in user login:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports.profile = async (req, res, next) => {
  res.status(200).json({ user: req.user });
}
module.exports.logout = async (req, res, next) => {
   res.clearCookie("token");
     const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  BlacklistToken.create({ token });
  res.status(200).json({ message: "Logged out successfully" })
}