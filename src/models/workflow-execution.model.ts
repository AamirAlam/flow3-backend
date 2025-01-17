import mongoose from "mongoose";

const workflowExecutionSchema = new mongoose.Schema({
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "workspace",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["RUNNING", "COMPLETED", "FAILED"],
    default: "RUNNING",
  },
  workflowId: {
    type: String,
  },
  result: mongoose.Schema.Types.Mixed,
  error: String,
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: Date,
});

export const WorkflowExecutionModel = mongoose.model(
  "WorkflowExecution",
  workflowExecutionSchema
);
