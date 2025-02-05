const dbgr = require("debug")("auth-middleware:middleware");
const jwt = require("jsonwebtoken");
const usermodel = require("../models/user-model");
const BlacklistToken = require("../models/blacklisttoken-model");
const captainModel = require("../models/captain-model");
module.exports.auth = async (req, res, next) => {
    // if (process.env.NODE_ENV === "development") {
    //   return next(); no need postman handles it self
    // }
  let token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  const isblacklisted=await BlacklistToken.findOne({token});
  if (!token || isblacklisted) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
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
module.exports.authcaptain= async(req,res,next)=>{
   let token=req.cookies.token || req.headers.authorization?.split(" ")[1];
   if(!token){
      return res.status(401).json({message:"unauthorized"})
   }
   try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    const captain=await captainModel.findOne({_id:decoded._id})
    if(!captain){
      throw new Error()
      }
    req.captain=captain
    next()
   }catch(error){
    return res.status(401).json({message:"unauthorized"})
   }
}
