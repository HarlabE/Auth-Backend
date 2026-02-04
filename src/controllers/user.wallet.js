
const User = require('./../models/user.model')
const wallet = require('./../models/user.wallet');

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
module.exports = {createWallet,getAllWallets}