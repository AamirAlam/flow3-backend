"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowExecutionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const workflowExecutionSchema = new mongoose_1.default.Schema({
    skeletonId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "WorkflowSkeleton",
        required: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["RUNNING", "COMPLETED", "FAILED"],
        default: "RUNNING",
    },
    workflowId: String,
    result: mongoose_1.default.Schema.Types.Mixed,
    error: String,
    startedAt: {
        type: Date,
        default: Date.now,
    },
    completedAt: Date,
});
exports.WorkflowExecutionModel = mongoose_1.default.model("WorkflowExecution", workflowExecutionSchema);
