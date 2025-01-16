"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTP = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
const sendOTP = async (email, otp) => {
    try {
        console.log("Sending email to", { email, from: process.env.SMTP_FROM });
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: email,
            subject: "Flow3 password Reset OTP",
            text: `Your OTP for password reset is: ${otp}. This OTP will expire in 5 minutes.`,
            html: `
              <h1>Password Reset OTP</h1>
              <p>Your OTP for password reset is: <strong>${otp}</strong></p>
              <p>This OTP will expire in 5 minutes.</p>
            `,
        };
        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.error("Error sending email", error);
        throw new Error("Error sending email");
    }
};
exports.sendOTP = sendOTP;
