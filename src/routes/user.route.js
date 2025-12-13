const express = require('express');
const { signup, login, forgetPassword, resetPassword, verifyOtp, sendOtp } = require('../controllers/user.controller');
const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)
router.put('/forget-password', forgetPassword)
router.put('/reset-password', resetPassword),
// router.put('/verify-otp', verifyOtp)
// router.put('/send-otp', sendOtp )


module.exports= router;