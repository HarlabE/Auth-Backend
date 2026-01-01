// const express = require('express');
const bcrypt = require('bcrypt');
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const sendEmail = require('../config/email');
require('dotenv').config();
const ejs = require('ejs');
const path = require('path');

// const app = express();

const signup = async (req, res)=>{
    const {name, email, password} = req.body
    try{
        if(!name|| !email || !password){
            return res.status(400).json({message: "All fields are required"})
        }
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                message: "user already exists"
            })
        }
        const hashPassword = await bcrypt.hash(password,10)
        const otp = Math.floor(100000 * Math.random() + 90000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000 );
        const newUser = new User({
            name,
            email,
            password:hashPassword,
            otp,
            otpExpiry
        });

        await newUser.save();
        const templatePath = path.join(__dirname, '..', 'views', 'welcomeMessage.ejs');
        await ejs.renderFile(templatePath, {userName : name},function  (err, template) {
            if(err){
                console.log('error ', err)
            }
            else{
             sendEmail(
            email,
            'Welcome ',
            template
        )
            }
        })
        return res.status(201).json({
            message: "user created successfully"
        })
    }catch(e){
        console.log(e)
        res.status(500).json({
            message: "server error"
        })
    }

}

const login = async (req, res)=>{
        const {email, password} = req.body;
        try{
            if(!email || !password){
            return res.status(400).json({
                message: "Enter a valid email and password"
            })}
            const user = await User.findOne({email});
            if(!user){
             return   res.status(400).json({
                    message: "user not found"
                })}
            // if(!user.isVerified){
            //     return res.status(401).json({message: "User not verified"})
            // }

                const comparePassword = await bcrypt.compare(password, user.password)
            if(!comparePassword){

              return  res.status(401).json({
                    message:"Invalid Credentials"
                })
            }
            const token = await jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn:"1h"})
            return res.status(200).json({
                message: 'login Successful', token
            })
            
        
        }catch(e){
            console.error(e);
            res.status(500).json({ 
                message:"Server error"
            })
        }
        
}
const forgetPassword = async (req, res)=>{
    const {email} = req.body;
    try {
        if (!email) {
            return res.status(400).json({
                message:"enter a valid email"
            })
        }
        const user = await User.findOne({email});
        if(!user){
          return res.status(404).json({message: "User not found"})
        }
        const otp = Math.floor(100000 * Math.random() + 90000).toString();
        user.otp = otp;
        await user.save();
        const templatePath = path.join(__dirname, '..', 'views', 'forgetPassword.ejs');
        await ejs.renderFile(templatePath, {otp : otp} ,function  (err, template) {
            if(err){
                console.log('error ', err)
            }
            else{
             sendEmail(
            email,
            'Welcome ',
            template
        )
            }
        })
        return res.status(200).json({message:"otp sent successfully", otp});
    } catch (error) {
        console.error('Error during forget password', error)
        return res.status(500).json({message: "Server Error"})
    }
}

// const resetPassword = async (req, res)=> {
//     const {otp, newPassword } = req.body;
// try{
//     if(!otp || !newPassword){
//         return res.status(404).json({
//             message: "All fields are required"
//         })
//     }
//     const user = await User.findOne({otp});
//     if(!user){
//         return res.status(404).json({message: "User not found"})
//     }
//     if(user.otpExpiry < Date.now()){
//        return res.status(400).json({message: "Otp has Expired"}) 
//     }
//     if(user.otp !== otp){
//         return res.status(400).json({message: "Invalid otp"})
//     }
    
//     const hashPassword = await bcrypt.hash(newPassword, 10)
//     user.password = hashPassword;
//     user.otp = null;
//     user.otpExpiry = null;
//     await user.save();
//     return res.status(200).json({message: "Password reset successfully"})
// }catch(e){
//     console.error('error during reset password' , e)
//     return res.status(500).json({message: "Server error"})
// }
    
// }

// const verifyOtp = async (req, res)=>{
//     const {otp} = req.body;
//     try {
//         if(!otp){
//             return res.status(404).json({
//             message: "All fields are required"
//         })
//         }
//         const user = await User.findOne({otp});
//         if(!user){
//             return res.status(404).json({message: "User not found"})
//         }
//         const userOtpExpiry =  await user.otpExipry;
//         if(userOtpExpiry < Date.now()){
//         return res.status(400).json({message: "Otp has Expired"})
//         }
//         // user.isVerified = true;
//         user.otp=null;
//         user.otpExpiry= null;
//         await user.save();
//         return res.status(200).json({message: "User verified successfully"})

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({message: "Server error"})
//     }
// }
const resetPassword = async(req, res)=>{
    const {email} = req.body;
    try {
        if(!email){
            return res.status(400).json({
                message:"Invalid email"
            })
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: "user not found"})
        }
        const otp = Math.floor(100000 * Math.random() + 90000).toString();
        const otpExpiry = new Date(Date.now() + 30 * 60 * 1000 );
         user.otp = otp;
         user.otpExpiry =otpExpiry;
         await user.save(); 
         return res.status(200).json({message: "Otp sent successfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "server error"})
    }
}

const changeToAdmin = async(req, res)=>{
    const {email} = req.body;
    try {
        if(!email){
            return res.status(400).json({
                message:"Enter an email"
            })
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({
                message:"User not found"
            })
        }
        const role = 'admin'
        user.role = role
        await user.save();
        return res.status(200).json({email: email, role})
    } catch (error) {
        console.log(e)
        return res.status(500).json({
            message: "server error"
        })
    }
}

const getAllUsers = async (req, res)=> {
    const {userId} = req.user;
    try {
        const adminUser = await User.findById(userId);
        if(adminUser.role !== "admin"){
            // console.log(adminUser)
            return res.status(400).json({message:"You are not authorized"})
        }
        const users = await User.find().select('-password -otp -otpExpiry');
        console.log(users)
        return res.status(200).json(users)
    } catch (error) {
        console.log(`this is the error ${error}`)
        return res.status(500).json({
            message:"  Server Error"
        })
    }
}

module.exports= {signup, login, forgetPassword, resetPassword, changeToAdmin, getAllUsers /*verifyOtp, sendOtp*/}