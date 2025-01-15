"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_model_1 = require("../models/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
router.post("/register", async (req, res) => {
    try {
        const user = new user_model_1.UserModel(req.body);
        await user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET);
        res.status(201).json({ user, token });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
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
        res.status(401).json({ error: error.message });
    }
});
exports.default = router;
