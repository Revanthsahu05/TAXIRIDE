const nodemailer = require('nodemailer');
const dbgr = require('debug')('development:services:email-service');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
module.exports.sendOtpEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'no-reply@taxiride.com',
            to: email,
            subject: 'TaxiRide Captain Verification OTP',
            text: `Your verification code is: ${otp}. This code will expire in 10 minutes.`,
            html: `<h3>Your verification code is: <b>${otp}</b></h3><p>This code will expire in 10 minutes.</p>`
        };

        const info = await transporter.sendMail(mailOptions);
        dbgr('Message sent: %s', info.messageId);
        return info;
    } catch (err) {
        console.error('Nodemailer error:', err);
        throw new Error('Failed to send OTP email');
    }
};
