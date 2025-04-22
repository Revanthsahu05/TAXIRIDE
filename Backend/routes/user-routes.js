const express=require('express')
const router=express.Router()
const {body}=require('express-validator')
const usercontroller=require('../controllers/user-controller')
const {auth}=require('../middlewares/auth-middleware')
// const {userregister}=require('../controllers/user-controller') can do named export and import like this also
router.post('/register',[
    body('email').isEmail().withMessage('Email is not valid'),
    body('fullname.firstname').isLength({min:3}).withMessage('First name must be atleast 3 characters long'),body('password').isLength({min:5}).withMessage('Password must be atleast 5 characters long')
],usercontroller.userregister);
router.post('/login',[
    body('email').isEmail().withMessage('Email is not valid'), 
    body('password').isLength({min:5}).withMessage('Password must be atleast 5 characters long')
],usercontroller.userlogin);
router.get("/profile",auth,usercontroller.profile);
router.get("/logout",auth,usercontroller.logout);
module.exports=router
