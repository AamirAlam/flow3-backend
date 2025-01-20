"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivityCallback = getActivityCallback;
const coinbase_1 = require("./activities/coinbase");
const googleSheets_1 = require("./activities/googleSheets");
const http_1 = require("./activities/http");
const moralis_1 = require("./activities/moralis");
const telegram_1 = require("./activities/telegram");
// Configure activity callback to respective types
async function getActivityCallback(type, inputs) {
    switch (type) {
        case "makeApiCall":
            return (0, http_1.makeHtrpApiCall)(inputs);
        case "coinbaseWallet":
            return (0, coinbase_1.returnCoinbaseWallet)(inputs);
        case "moralis":
            return (0, moralis_1.executeMoralisErc20WalletTransfersNode)(inputs);
        case "coinbase":
            return (0, coinbase_1.tradeCoinbase)(inputs);
        case "telegram":
            return (0, telegram_1.executeTelegramNotification)(inputs);
        case "googleSheets":
            return (0, googleSheets_1.executeFetchGoogleSheetColumn)(inputs);
        case "deployNFT":
            return (0, coinbase_1.executeDeployAndMintNFT)(inputs);
        default:
            throw new Error("Invalid activity type");
    }
}
