const dbgr = require("debug")("development:controllers:user-controller");
const usermodel = require("../models/user-model");  
const { createuser } = require("../services/user-services");
const { validationResult } = require("express-validator");
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
