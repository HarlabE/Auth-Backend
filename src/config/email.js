const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

const sendEmail = async(to, subject, html, text)=>{
    const fallbackText = text || html.replace(/<[^>]*>?/gm, '');
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text: fallbackText,
        html,
    };
    await transporter.sendMail(mailOptions)

};

module.exports = sendEmail;