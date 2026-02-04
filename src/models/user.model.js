const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:true,

    },
    otp:{
        type: String
    }, 
    // isVerified:{
    //     type: Boolean,
    //     default:false
    // },
    otpExpiry:{
        type: Date,
    },
    phoneNumber:{
        type:String,
        required:true,
        unique: true,
    },
    profilePicture:{
        type: String,
        default: null
    },
    role:{
        type: String,
        
        enum: ['user', 'admin'],
        default: 'user'
    }
},{
        timestamps: true,
        versionKey: false
    }

)
const User = mongoose.model('User', userSchema)

    module.exports = User;
