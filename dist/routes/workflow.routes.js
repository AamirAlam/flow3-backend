"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@temporalio/client");
const workflow_skeleton_model_1 = require("../models/workflow-skeleton.model");
const workflow_execution_model_1 = require("../models/workflow-execution.model");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
const client = new client_1.Client();
// Create new workflow skeleton
router.post("/workflow", auth_middleware_1.auth, async (req, res) => {
    try {
        const skeleton = new workflow_skeleton_model_1.WorkflowSkeletonModel({
            ...req.body,
            userId: req.user.userId,
        });
        await skeleton.save();
        res.status(201).json(skeleton);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Get all workflow skeletons
router.get("/all", auth_middleware_1.auth, async (req, res) => {
    try {
        const skeletons = await workflow_skeleton_model_1.WorkflowSkeletonModel.find({
            userId: req.user.userId,
        });
        res.json(skeletons);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Start a workflow execution
router.post("/execute/:skeletonId", auth_middleware_1.auth, async (req, res) => {
    try {
        const skeleton = await workflow_skeleton_model_1.WorkflowSkeletonModel.findOne({
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
        const execution = new workflow_execution_model_1.WorkflowExecutionModel({
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
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Get all running workflows
router.get("/running", auth_middleware_1.auth, async (req, res) => {
    try {
        const executions = await workflow_execution_model_1.WorkflowExecutionModel.find({
            userId: req.user.userId,
        });
        res.json(executions);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Get a specific workflow execution
router.get("/execution-status/:id", auth_middleware_1.auth, async (req, res) => {
    try {
        const execution = await workflow_execution_model_1.WorkflowExecutionModel.findOne({
            _id: req.params.id,
            userId: req.user.userId,
        });
        if (!execution) {
            return res.status(404).json({ error: "Workflow execution not found" });
        }
        const handle = client.workflow.getHandle(execution?.workflowId || "");
        const status = await handle.query("progress");
        res.json(status);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
