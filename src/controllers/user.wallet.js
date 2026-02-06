
const User = require('./../models/user.model')
const wallet = require('./../models/user.wallet');
const mongoose = require("mongoose");
const Flutterwave = require("flutterwave-node-v3");
const axios = require("axios");

const createWallet= async (req, res)=>{
    try{
        const {userId} = req.user;
        const {phoneNumber, currency} = req.body;
        if(!userId){
            return res.status(400).json({message: 'User ID is required'});
        }
        const existingUser = await User.findById(userId)
         if(!existingUser){
            return res.status(400).json({
                message: "user not found"
            })
            
        } const normalizePhone = phoneNumber.replace(/^(\+234|0)/, '');
         existingUser.phoneNumber = phoneNumber;
        await existingUser.save();
       
        const newWallet = new wallet({
            userId: userId,
            balance: 0,
            accountNo: normalizePhone,
            currency:currency,
        })
        await newWallet.save();
        return res.status(200).json({
            message: 'wallet crreated successfully', wallet: newWallet
        })
    }catch(e){

        console.error('Error creating wallet', e);
        return res.status(500).json({
            message:'INternal server error'
        })
    }
}
const getAllWallets = async(req, res)=>{
    try{
        const {userId} = req.user;
        if(!userId){
            return res.status(400).json({message: 'User ID is required'});
        }
        const wallets = await wallet.find({userId}).populate('userId', 'name email phoneNumber');
        return res.status(200).json({wallets});
    }catch(e){
        console.error('Error fetching wallets', e);
        return res.status(500).json({
            message:'Internal server error'
        })
    }
}


// Transer Funds Between Wallets (Safe without Replica Set)
const transferFunds = async (req, res) => {
  const { accountNumberFrom, accountNumberTo, amount } = req.body;
  const { userId } = req.user;

  if (!userId) {
    return res.status(400).json({ message: "User Must Be Logged In" });
  }

  if (!accountNumberFrom || !accountNumberTo || !amount) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: "Amount must be greater than zero" });
  }

  if (accountNumberFrom === accountNumberTo) {
    return res.status(400).json({ message: "Cannot transfer to the same account" });
  }

  try {
    // Step 1: Check if both wallets exist
    const senderWallet = await wallet.findOne({ accountNo: accountNumberFrom });
    const receiverWallet = await wallet.findOne({ accountNo: accountNumberTo });

    if (!senderWallet) {
      return res.status(404).json({ message: "Sender wallet not found" });
    }

    if (!receiverWallet) {
      return res.status(404).json({ message: "Receiver wallet not found" });
    }

    if (senderWallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // Step 2: Atomic debit from sender (with balance check in query)
    // This ensures we only debit if balance is STILL sufficient
    const debitResult = await wallet.findOneAndUpdate(
      { 
        accountNo: accountNumberFrom,
        balance: { $gte: amount }  // Only update if balance is enough (prevents race condition)
      },
      { $inc: { balance: -amount } },
      { new: true }
    );

    // If debit failed (someone else spent the money first!)
    if (!debitResult) {
      return res.status(400).json({ message: "Insufficient funds or wallet changed" });
    }

    // Step 3: Credit receiver (this should always succeed)
    const creditResult = await wallet.findOneAndUpdate(
      { accountNo: accountNumberTo },
      { $inc: { balance: amount } },
      { new: true }
    );

    if (!creditResult) {
      await wallet.updateOne(
        { accountNo: accountNumberFrom },
        { $inc: { balance: amount } } 
      );
      return res.status(500).json({ message: "Transfer failed, funds returned" });
    }

    return res.status(200).json({ 
      message: "Transfer successful",
      details: {
        from: accountNumberFrom,
        to: accountNumberTo,
        amount: amount
      }
    });

  } catch (e) {
    console.error("Error during fund transfer:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const createRedirectUrl = async (req, res) => {
    const { userId } = req.user;
    const {amount, currency, redirectUrl} = req.body;
    if(!userId){
        return res.status(400).json({message: "User Must Be Logged In"})
    }
    if(!amount || !currency || !redirectUrl){
        return res.status(400).json({message: "All fields are required"})
}
    try {

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        const txRef = `harlab-wallet-${Date.now()}-${userId}`;

        const flw = new Flutterwave(process.env.FLUTTERWAVE_PUBLIC_KEY, process.env.FLUTTERWAVE_SECRET_KEY);


            const payload = {
      tx_ref: txRef,
      amount: amount,
      currency: currency,
      redirect_url: redirectUrl,
      customer: {
        email: user.email,
        phonenumber: user.phoneNumber,
        name: user.name,
      },
      customizations: {
        title: "Wallet Funding",
        description: "Fund your wallet",
      },
    };
    const response = await axios.post("https://api.flutterwave.com/v3/payments", payload, {
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        contentType: "application/json",
      }, 

    });
    return res.status(200).json({message: "Redirect URL created successfully", link: response.data.data.link, txRef: txRef})
    }catch(e){
        console.error("Error creating redirect url", e);
        return res.status(500).json({message: "Internal server error"})
}
}
module.exports = { createWallet, getAllWallets, transferFunds, createRedirectUrl }