import express from "express";
import { Client } from "@temporalio/client";
import { WorkSpaceModel } from "../models/workflow-skeleton.model";
import { WorkflowExecutionModel } from "../models/workflow-execution.model";
import { auth } from "../middleware/auth.middleware";
import mongoose from "mongoose";

const router = express.Router();
const client = new Client();

// Create and save workspace in database
// POST: /api/workflow
// Request body: name, workspace
router.post("/workflow", auth, async (req: any, res) => {
  try {
    const skeleton = new WorkSpaceModel({
      ...req.body,
      userId: req.user.userId,
    });
    await skeleton.save();
    res.status(201).json(skeleton);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all user created workspaces
// GET: /api/workflow/all

router.get("/all", auth, async (req: any, res) => {
  try {
    const skeletons = await WorkSpaceModel.find({
      userId: req.user.userId,
    });
    res.json(skeletons);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start a workspace execution
// POST: /api/workflow/execute/:workspaceId
// Request body: none
router.post("/execute/:workspaceId", auth, async (req: any, res) => {
  try {
    // validate if workspaceId is valid mongoose id
    if (mongoose.Types.ObjectId.isValid(req.params.workspaceId) === false) {
      return res.status(400).json({ error: "Invalid workspace id" });
    }

    const workspace = await WorkSpaceModel.findOne({
      _id: req.params.workspaceId,
      userId: req.user.userId,
    });

    if (!workspace) {
      return res.status(404).json({ error: "Workflow workspace not found" });
    }

    const handle = await client.workflow.start("testWorkflow", {
      args: [workspace.workspace],
      taskQueue: "api-workflow",
      workflowId: `workflow-${workspace.id}`,
    });

    const execution = new WorkflowExecutionModel({
      workspaceId: workspace.id,
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

//  Get all running workflows
//  GET: /api/workflow/running

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

// Get a specific workflow execution status
// GET: /api/workflow/execution-status/:id
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
