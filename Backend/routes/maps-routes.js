const express=require('express')
const router=express.Router()
const auth=require('../middlewares/auth-middleware')
const mapcontroller=require('../controllers/map-controller')
const {query}=require('express-validator')
router.get('/get-coordinates',
    query('address').isString().isLength({min:3}),auth.auth,mapcontroller.getcoordinates)
router.get('/get-distance-time',query('origin').isString().isLength({min:3}),query('destination').isString().isLength({min:3}),auth.auth,mapcontroller.getdisttime)
router.get('/get-suggestions',query('input').isString().isLength({min:3}),auth.auth,mapcontroller.getSuggestions)
module.exports = router;