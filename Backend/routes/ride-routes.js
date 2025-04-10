const express=require('express')
const ridecontroller=require('../controllers/ride-controller')
const router=express.Router()
const auth=require('../middlewares/auth-middleware')
const {body}=require('express-validator')
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

module.exports=router