import {
  IExecuteFunctions,
  INodeExecutionData,
  IDataObject,
  NodeApiError,
} from "n8n-workflow";
import { CoinGecko } from "../nodes/CoinGeckoMain/CoinGecko.node";

class CoinGeckoHelper {
  static async executeOperation(
    resource: string,
    operation: string,
    params: IDataObject,
    executeFunctions: IExecuteFunctions
  ): Promise<any> {
    const coinGeckoNode = new CoinGecko();

    // Set node parameters
    executeFunctions.getNode().parameters = {
      resource,
      operation,
      ...params,
    };

    try {
      const result: any = await coinGeckoNode.execute.call(executeFunctions);
      let data;
      if (Array.isArray(result[0]) && result[0].length > 0) {
        data = result[0][0].json;
      } else if (result[0] && result[0].json) {
        data = result[0].json;
      } else {
        throw new Error("Invalid execution result structure");
      }
      return data;
    } catch (error) {
      throw new NodeApiError(executeFunctions.getNode(), error);
    }
  }
}

export { CoinGeckoHelper };
