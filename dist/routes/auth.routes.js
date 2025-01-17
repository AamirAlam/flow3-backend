"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_model_1 = require("../models/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bodyValidator_1 = require("../middleware/bodyValidator");
const userSchema_1 = require("../validators/userSchema");
const otp_model_1 = require("../models/otp.model");
const email_1 = require("../utils/email");
const router = express_1.default.Router();
//  Register a new user
//  POST: /api/auth/register
//  Request body: name, email, organization, password
router.post("/register", (0, bodyValidator_1.validateBody)(userSchema_1.userRegisterBody), async (req, res) => {
    try {
        // check if user already exists
        const existingUser = await user_model_1.UserModel.findOne({ email: req.body.email });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const user = new user_model_1.UserModel(req.body);
        await user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET);
        res.status(201).json({ user, token });
    }
    catch (error) {
        res.status(401).json({ errors: [{ message: error.message }] });
    }
});
// Login a user
// POST: /api/auth/login
// Request body: email, password
router.post("/login", async (req, res) => {
    try {
        const user = await user_model_1.UserModel.findOne({ email: req.body.email });
        if (!user || !(await bcryptjs_1.default.compare(req.body.password, user.password))) {
            throw new Error("Invalid credentials");
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET);
        const userData = await user_model_1.UserModel.findById(user.id).select({ password: 0 });
        res.json({ user: userData, token });
    }
    catch (error) {
        res.status(401).json({ errors: [{ message: error.message }] });
    }
});
// Forgot password
// POST: /api/auth/forgot-password
// Request body: email
router.post("/forgot-password", (0, bodyValidator_1.validateBody)(userSchema_1.forgetPasswordBody), async (req, res) => {
    try {
        const { email } = req.body;
        const user = await user_model_1.UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Save OTP to database
        await otp_model_1.OTPModel.create({
            email,
            otp: await bcryptjs_1.default.hash(otp, 10),
        });
        // Send OTP via email
        await (0, email_1.sendOTP)(email, otp);
        res.json({ message: "OTP sent to your email" });
    }
    catch (error) {
        res.status(401).json({ errors: [{ message: error.message }] });
    }
});
// Reset password
// POST: /api/auth/reset-password
// Request body: email, otp, newPassword
router.post("/reset-password", (0, bodyValidator_1.validateBody)(userSchema_1.resetPasswordBody), async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        // Find the latest OTP for the email
        const otpDoc = await otp_model_1.OTPModel.findOne({ email }).sort({ createdAt: -1 });
        if (!otpDoc) {
            return res.status(400).json({ error: "OTP expired or not found" });
        }
        // validate if otp createdAt is longer than 5 minutes
        const currentTime = new Date();
        const otpTime = new Date(otpDoc?.createdAt);
        const timeDifference = currentTime.getTime() - otpTime.getTime();
        const minutesDifference = timeDifference / (1000 * 60);
        if (minutesDifference > 5) {
            return res.status(400).json({ error: "OTP expired" });
        }
        // Verify OTP
        if (!(await bcryptjs_1.default.compare(otp, otpDoc.otp))) {
            return res.status(400).json({ error: "Invalid OTP" });
        }
        // Update password
        const user = await user_model_1.UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.password = newPassword;
        await user.save();
        // Delete used OTP
        await otp_model_1.OTPModel.deleteOne({ _id: otpDoc._id });
        res.json({ message: "Password reset successful" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
