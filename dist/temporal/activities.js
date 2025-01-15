"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFirstApiCall = makeFirstApiCall;
exports.makeSecondApiCall = makeSecondApiCall;
async function makeFirstApiCall(args) {
    try {
        // wait for 10 seconds
        await new Promise((resolve) => setTimeout(resolve, 10000));
        return { data: "First activity data" };
    }
    catch (error) {
        throw error;
    }
}
async function makeSecondApiCall(args) {
    try {
        // wait for 10 seconds
        await new Promise((resolve) => setTimeout(resolve, 10000));
        return { data: "Second activity data" };
    }
    catch (error) {
        throw error;
    }
}
