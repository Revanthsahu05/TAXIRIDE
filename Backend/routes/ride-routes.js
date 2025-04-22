const express=require('express')
const ridecontroller=require('../controllers/ride-controller')
const router=express.Router()
const auth=require('../middlewares/auth-middleware')
const {body,query}=require('express-validator')
router.post(
  "/create",auth.auth,
  body("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("invalid pickup location"),
  body("drop")
    .isString()
    .isLength({ min: 3 })
    .withMessage("invalid drop location"),
  body("vechiletype").isString().isIn(["car", "motorcycle", "auto"]).withMessage("invalid vechile type"),ridecontroller.createride
);
router.get(
  "/fare",
  auth.auth,
  query("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("invalid pickup location"),
  query("drop")
    .isString()
    .isLength({ min: 3 })
    .withMessage("invalid drop location"),
  ridecontroller.getfare
);
router.post("/confirmride",auth.authcaptain,body("rideid").isMongoId().withMessage("invalid ride id"),ridecontroller.confirmride)
router.get("/startride",auth.authcaptain,query("rideid").isMongoId().withMessage('invalid ride id'),query('otp').isLength({min:6}).withMessage('invalid otp'),ridecontroller.startride)
module.exports=router