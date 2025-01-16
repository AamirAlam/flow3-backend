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
exports.default = router;
