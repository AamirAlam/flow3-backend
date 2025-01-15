"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).required().messages({
        "string.base": "Name should be a text value.",
        "string.min": "Name must be at least 3 characters long.",
        "any.required": "Name is required.",
    }),
    email: joi_1.default.string().email().required().messages({
        "string.email": "Please provide a valid email address.",
        "any.required": "Email is required.",
    }),
    organization: joi_1.default.string().min(2).required().messages({
        "string.base": "Organization should be a text value.",
        "string.min": "Organization must be at least 3 characters long.",
        "any.required": "Organization is required.",
    }),
    password: joi_1.default.string().min(6).required().messages({
        "string.base": "Password should be a text value.",
        "string.min": "Password must be at least 6 characters long.",
        "any.required": "Password is required.",
    }),
});
