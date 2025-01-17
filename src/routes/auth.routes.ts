import express from "express";
import { UserModel } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateBody } from "../middleware/bodyValidator";
import {
  forgetPasswordBody,
  resetPasswordBody,
  userRegisterBody,
} from "../validators/userSchema";
import { OTPModel } from "../models/otp.model";
import { sendOTP } from "../utils/email";

const router = express.Router();

//  Register a new user
//  POST: /api/auth/register
//  Request body: name, email, organization, password
router.post(
  "/register",
  validateBody(userRegisterBody),
  async (req: any, res: any) => {
    try {
      // check if user already exists
      const existingUser = await UserModel.findOne({ email: req.body.email });
      if (existingUser) {
        throw new Error("User already exists");
      }

      const user = new UserModel(req.body);
      await user.save();
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
      res.status(201).json({ user, token });
    } catch (error: any) {
      res.status(401).json({ errors: [{ message: error.message }] });
    }
  }
);

// Login a user
// POST: /api/auth/login
// Request body: email, password
router.post("/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    const userData = await UserModel.findById(user.id).select({ password: 0 });

    res.json({ user: userData, token });
  } catch (error: any) {
    res.status(401).json({ errors: [{ message: error.message }] });
  }
});

// Forgot password
// POST: /api/auth/forgot-password
// Request body: email
router.post(
  "/forgot-password",
  validateBody(forgetPasswordBody),
  async (req, res) => {
    try {
      const { email } = req.body;
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Save OTP to database
      await OTPModel.create({
        email,
        otp: await bcrypt.hash(otp, 10),
      });

      // Send OTP via email
      await sendOTP(email, otp);

      res.json({ message: "OTP sent to your email" });
    } catch (error) {
      res.status(401).json({ errors: [{ message: error.message }] });
    }
  }
);

// Reset password
// POST: /api/auth/reset-password
// Request body: email, otp, newPassword
router.post(
  "/reset-password",
  validateBody(resetPasswordBody),
  async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;

      // Find the latest OTP for the email
      const otpDoc = await OTPModel.findOne({ email }).sort({ createdAt: -1 });

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
      if (!(await bcrypt.compare(otp, otpDoc.otp))) {
        return res.status(400).json({ error: "Invalid OTP" });
      }

      // Update password
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.password = newPassword;
      await user.save();

      // Delete used OTP
      await OTPModel.deleteOne({ _id: otpDoc._id });

      res.json({ message: "Password reset successful" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
export default router;
