"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    organization: {
        type: String,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcryptjs_1.default.hash(this.password, 10);
    }
    next();
});
exports.UserModel = mongoose_1.default.model("User", userSchema);
