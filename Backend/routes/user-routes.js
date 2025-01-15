const express=require('express')
const router=express.Router()
const {body}=require('express-validator')
const usercontroller=require('../controllers/user-controller')
// const {userregister}=require('../controllers/user-controller') can do named export and import like this also
router.post('/register',[
    body('email').isEmail().withMessage('Email is not valid'),
    body('fullname.firstname').isLength({min:3}).withMessage('First name must be atleast 3 characters long')
],usercontroller.userregister);
router.get("/",(req,res)=>{
    res.send('User accessed')
})
module.exports=router
