import {
  executeDeployAndMintNFT,
  returnCoinbaseWallet,
  tradeCoinbase,
} from "./activities/coinbase";
import { executeFetchGoogleSheetColumn } from "./activities/googleSheets";
import { makeHtrpApiCall } from "./activities/http";
import { executeMoralisErc20WalletTransfersNode } from "./activities/moralis";
import { executeTelegramNotification } from "./activities/telegram";

export async function getActivityCallback(type: string, inputs: any) {
  switch (type) {
    case "makeApiCall":
      return makeHtrpApiCall(inputs);
    case "coinbaseWallet":
      return returnCoinbaseWallet(inputs);
    case "moralis":
      return executeMoralisErc20WalletTransfersNode(inputs);
    case "coinbase":
      return tradeCoinbase(inputs);
    case "telegram":
      return executeTelegramNotification(inputs);
    case "googleSheets":
      return executeFetchGoogleSheetColumn(inputs);
    case "deployNFT":
      return executeDeployAndMintNFT(inputs);
    default:
      throw new Error("Invalid activity type");
  }
}
