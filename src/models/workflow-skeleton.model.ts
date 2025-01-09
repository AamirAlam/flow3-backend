import mongoose from "mongoose";

const workflowSkeletonSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

export const WorkflowSkeletonModel = mongoose.model(
  "WorkflowSkeleton",
  workflowSkeletonSchema
);
