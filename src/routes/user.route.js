const express = require('express');
const { signup, login, forgetPassword, resetPassword, changeToAdmin, getAllUsers } = require('../controllers/user.controller');
const { isAuth } = require('../config/auth');
const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)
router.put('/forget-password', forgetPassword)
router.put('/reset-password', resetPassword),
router.put('/change-role', changeToAdmin),
router.get('/get-users',isAuth, getAllUsers)
// router.put('/verify-otp', verifyOtp)
// router.put('/send-otp', sendOtp )


module.exports= router;