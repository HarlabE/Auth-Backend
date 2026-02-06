const express = require('express');
const { isAuth } = require('../config/auth');
const { createWallet, getAllWallets, transferFunds, createRedirectUrl } = require('../controllers/user.wallet');
const router = express.Router();

router.post('/create-wallet', isAuth, createWallet);
router.get('/all-wallets', isAuth, getAllWallets);
router.post('/transfer-funds', isAuth, transferFunds);
router.post('/create-payment-link', isAuth, createRedirectUrl);

module.exports = router