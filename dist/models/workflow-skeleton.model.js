"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowSkeletonModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const workflowSkeletonSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: String,
    tasks: {
        type: [String],
        required: true,
    },
}, { timestamps: true });
exports.WorkflowSkeletonModel = mongoose_1.default.model("WorkflowSkeleton", workflowSkeletonSchema);
