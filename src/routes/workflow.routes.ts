import express from "express";
import { Client } from "@temporalio/client";
import { WorkflowSkeletonModel } from "../models/workflow-skeleton.model";
import { WorkflowExecutionModel } from "../models/workflow-execution.model";
import { auth } from "../middleware/auth.middleware";

const router = express.Router();
const client = new Client();

// Create new workflow skeleton
router.post("/workflow", auth, async (req: any, res) => {
  try {
    const skeleton = new WorkflowSkeletonModel({
      ...req.body,
      userId: req.user.userId,
    });
    await skeleton.save();
    res.status(201).json(skeleton);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all workflow skeletons
router.get("/all", auth, async (req: any, res) => {
  try {
    const skeletons = await WorkflowSkeletonModel.find({
      userId: req.user.userId,
    });
    res.json(skeletons);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start a workflow execution
router.post("/execute/:skeletonId", auth, async (req: any, res) => {
  try {
    const skeleton = await WorkflowSkeletonModel.findOne({
      _id: req.params.skeletonId,
      userId: req.user.userId,
    });

    if (!skeleton) {
      return res.status(404).json({ error: "Workflow skeleton not found" });
    }

    const handle = await client.workflow.start("testWorkflow", {
      args: [skeleton.tasks],
      taskQueue: "api-workflow",
      workflowId: `workflow-${skeleton.id}`,
    });

    const execution = new WorkflowExecutionModel({
      skeletonId: skeleton.id,
      userId: req.user.userId,
      workflowId: handle.workflowId,
    });
    await execution.save();

    res.json({
      message: "Workflow started",
      executionId: execution.id,
      workflowId: handle.workflowId,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all running workflows
router.get("/running", auth, async (req: any, res) => {
  try {
    const executions = await WorkflowExecutionModel.find({
      userId: req.user.userId,
    });
    res.json(executions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific workflow execution
router.get("/execution-status/:id", auth, async (req: any, res) => {
  try {
    const execution = await WorkflowExecutionModel.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!execution) {
      return res.status(404).json({ error: "Workflow execution not found" });
    }

    const handle = client.workflow.getHandle(execution?.workflowId || "");
    const status = await handle.query("progress");

    res.json(status);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
