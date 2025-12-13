const express = require('express');
const { signup, login, forgetPassword, resetPassword, verifyOtp } = require('../controllers/user.controller');
const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)
router.put('/forget-password', forgetPassword)
router.put('/reset-password', resetPassword),
router.put('/verify-otp', verifyOtp)


module.exports= router;