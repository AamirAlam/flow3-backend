"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testWorkflow = testWorkflow;
const workflow_1 = require("@temporalio/workflow");
const { makeFirstApiCall, makeSecondApiCall } = (0, workflow_1.proxyActivities)({
    startToCloseTimeout: "1 minute",
    retry: {
        maximumAttempts: 3, // Retry up to 3 times
        initialInterval: "1s", // Wait 1 second before the first retry
        backoffCoefficient: 2, // Exponential backoff
        maximumInterval: "10s", // Cap the retry interval at 10 seconds
    },
});
// testing workflow execution
async function testWorkflow(activities) {
    // First worker makes the initial API call
    // let finalResult;
    // for (const activity of activities) {
    //   if (activity === "makeFirstApiCall") {
    //     finalResult = await makeFirstApiCall("args");
    //   } else if (activity === "makeSecondApiCall") {
    //     finalResult = await makeSecondApiCall("args");
    //   }
    // }
    // return finalResult;
}
