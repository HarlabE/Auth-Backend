const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true,
    },
    walletId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'wallet',
        required: true,
    },
    referenceNo:{
        type:String,
        required: true,
        unique: true,
    },
    type:{
        type: String,
        enum:['credit', 'debit', 'transfer'],
        required: true 
    },
    amount:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
        currency:{
            type: String,
            required: true,
            default:'NGN',
        },
    balanceBefore:{
        type: mongoose.Schema.Types.Decimal128,
        required:true,
    },
    balanceAfter:{
        type: mongoose.Schema.Types.Decimal128,
        required:true,
    },
    description:{
        type:String,
        default: ''
    },
    status:{
        type:String,
        enum:['pending', 'success', 'failed'],
        default: 'pending',
    },
    
},{
    timestamps: true,
    versionKey:false
});

const transaction = mongoose.model('transacrion', transactionSchema);

module.exports = transaction;