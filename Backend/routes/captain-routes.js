const express = require('express');
const { body } = require('express-validator');
const passport = require('passport'); // Add passport
const captainController = require('../controllers/captain-controller');
const { authcaptain } = require('../middlewares/auth-middleware')
const router = express.Router();

// Google Auth Routes
router.get('/auth/google', passport.authenticate('google-captain', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google-captain', { session: false, failureRedirect: '/captain-login' }),
    captainController.googleCallback
);

router.post('/register', [
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('fullname.lastname').isLength({ min: 3 }).withMessage('Last name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
], captainController.registerCaptain);

router.post('/verify-otp', [
    body('email').isEmail().withMessage('Email is not valid'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
], captainController.verifyOtp);


router.post('/login', [
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
], captainController.loginCaptain);

router.post('/vehicle-info', authcaptain, [
    body('color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('Plate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('vechiletype').isIn(['Car', 'Motorcycle', 'Auto']).withMessage('Vehicle type must be car, motorcycle, or auto')
], captainController.updateVehicleInfo);

router.get('/profile', authcaptain, captainController.profile)
router.get('/logout', authcaptain, captainController.logout);
module.exports = router;