import {
  executeDeployAndMintNFT,
  returnCoinbaseWallet,
  tradeCoinbase,
} from "./activities/coinbase";
import { executeFetchGoogleSheetColumn } from "./activities/googleSheets";
import { makeHttpGetApiCall } from "./activities/http";
import { executeMoralisErc20WalletTransfersNode } from "./activities/moralis";
import { executeTelegramNotification } from "./activities/telegram";
import { coingeckoActivities } from "./activities/coingecko/coingecko.activities";

// Configure activity callback to respective types
export async function getActivityCallback(type: string, inputs: any) {
  switch (type) {
    case "makeApiCall":
      return makeHttpGetApiCall(inputs);
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
    case "getTokenPrices":
      return coingeckoActivities.getTokenPrices(
        inputs.tokenIds,
        inputs.currency
      );
    case "getDetailedTokenPrices":
      return coingeckoActivities.getDetailedTokenPrices(
        inputs.tokenIds,
        inputs.currency
      );
    default:
      throw new Error("Invalid activity type");
  }
}
