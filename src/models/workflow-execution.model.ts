import mongoose from "mongoose";

const workflowExecutionSchema = new mongoose.Schema({
  skeletonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkflowSkeleton",
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
  workflowId: String,
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
