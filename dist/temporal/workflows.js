"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWorkflow = startWorkflow;
const workflow_1 = require("@temporalio/workflow");
// Configure activity execution at temporal worker
const { getActivityCallback } = (0, workflow_1.proxyActivities)({
    startToCloseTimeout: "1 minute",
    retry: {
        maximumAttempts: 5, // Retry up to 3 times
        initialInterval: "5s", // Wait 1 second before the first retry
        backoffCoefficient: 2, // Exponential backoff
        maximumInterval: "10s", // Cap the retry interval at 10 seconds
    },
});
async function executeNodeLogic(workflow, node, inputs) {
    // Special cases
    // 1. start node
    // 2. Loop
    switch (node.type) {
        case "start": {
            const nextNodeId = workflow.edges.find((edge) => edge.source === node.id).target;
            return [null, nextNodeId];
        }
        case "loop": {
            const results = [];
            for (const input of inputs) {
                const [loopResult, _] = await executeNodes(workflow, node.data.loopId, input);
                results.push(loopResult);
            }
            const output = null;
            const nextNodeId = node.data.doneId;
            return [output, nextNodeId];
        }
        default:
            const nodeOutput = await getActivityCallback(node.type, node.data);
            const nextNodeId = workflow.edges.find((edge) => edge.source === node.id).target;
            return [nodeOutput, nextNodeId];
    }
}
async function executeNode(workflow, node, input) {
    try {
        console.log("executing node ", node.id);
        // delay 2 seconds
        // Execute the node based on its type
        const [output, nextNodeId] = await executeNodeLogic(workflow, node, input);
        console.log("node output for ", node.id, output);
        node.output = output;
        return [output, nextNodeId];
    }
    catch (error) {
        throw new Error(`Error executing node ${node.id}: ${error.message}`);
    }
}
async function executeNodes(workflow, nodeId, input) {
    try {
        const nodes = new Map(workflow.nodes.map((node) => [node.id, node]));
        let output = input;
        let nextNodeId = nodeId;
        while (nodes.get(nextNodeId).type !== "replace") {
            [output, nextNodeId] = await executeNode(workflow, nodes.get(nextNodeId), output);
        }
        return [output, nextNodeId];
    }
    catch (error) {
        throw error;
    }
}
// Start workflow execution
async function startWorkflow(workspaceData) {
    // execute activities as a a cyclic graph
    const startNode = workspaceData.nodes.find((node) => node.id === "start");
    if (!startNode) {
        throw new Error("Start node not found");
    }
    const args = null;
    await executeNodes(workspaceData, startNode.id, args);
}
