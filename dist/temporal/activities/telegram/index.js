"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeTelegramNotification = executeTelegramNotification;
// Send telegram notification
async function executeTelegramNotification(args) {
    try {
        // replace this with actual code
        await new Promise((resolve) => setTimeout(resolve, 10000));
        // define the fixed returned type for all nodes
        return { data: args };
    }
    catch (error) {
        //: todo define the error message structure
        throw new Error("Error executing executeTelegramNotification");
    }
}
