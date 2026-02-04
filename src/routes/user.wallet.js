const express = require('express');
const { isAuth } = require('../config/auth');
const { createWallet, getAllWallets } = require('../controllers/user.wallet');
const router = express.Router();

router.post('/create-wallet', isAuth, createWallet);
router.get('/all-wallets', isAuth, getAllWallets);

module.exports = router