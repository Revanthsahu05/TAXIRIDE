const express = require('express');
const { body } = require('express-validator');
const captainController = require('../controllers/captain-controller');
const {authcaptain}=require('../middlewares/auth-middleware')
const router = express.Router();

router.post('/register', [
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('fullname.lastname').isLength({ min: 3 }).withMessage('Last name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    body('vechile.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vechile.Plate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
    body('vechile.capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('vechile.vechiletype').isIn(['Car', 'Motorcycle', 'Auto']).withMessage('Vehicle type must be car, motorcycle, or auto')
], captainController.registerCaptain);
router.post('/login', captainController.loginCaptain);
router.get('/profile',authcaptain,captainController.profile)
router.get('/logout',authcaptain, captainController.logout);
module.exports = router;