"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new Error();
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log("decoded :>> ", decoded);
        if (!decoded?.userId) {
            throw new Error("Invalid authentication token");
        }
        // verify that if requested user exists in db or not
        const user = await user_model_1.UserModel.findById(decoded.userId);
        if (!user) {
            throw new Error("Invalid user token! please login again");
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ errors: [{ message: error.message }] });
    }
};
exports.auth = auth;
