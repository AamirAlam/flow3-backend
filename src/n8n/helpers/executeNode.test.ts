import { CoinGeckoHelper } from "./executeNode";
import {
  IExecuteFunctions,
  IDataObject,
  INode,
  INodeExecutionData,
} from "n8n-workflow";
import { CoinGecko } from "../nodes/CoinGeckoMain/CoinGecko.node";
CoinGecko.prototype.execute = async function (this: any) {
  return [[{ json: mockCoinData }]];
};

// Mock response data
const mockCoinData: IDataObject = {
  id: "bitcoin",
  symbol: "btc",
  name: "Bitcoin",
  market_data: {
    current_price: {
      usd: 50000,
    },
    market_cap: {
      usd: 1000000000000,
    },
  },
};

// Mock IExecuteFunctions interface
const mockExecuteFunctions: IExecuteFunctions = {
  getNode: () => ({
    type: "coinGecko",
    name: "CoinGecko",
    typeVersion: 1,
    position: [0, 0],
    parameters: {},
  }),
  getNodeParameter: (parameterName: string, itemIndex: number) => {
    const params: { [key: string]: any } = {
      resource: "coin",
      operation: "get",
      coinId: "bitcoin",
      options: {
        market_data: true,
        community_data: false,
        developer_data: false,
      },
    };
    return params[parameterName];
  },
  getInputData: () => [{ json: {} }],
  continueOnFail: () => false,
  helpers: {
    request: async () => ({ data: mockCoinData }),
    returnJsonArray: (items: IDataObject[]) => {
      if (!Array.isArray(items)) {
        items = [items];
      }
      return items.map((item) => ({ json: item }));
    },
    constructExecutionMetaData: (
      inputData: INodeExecutionData[],
      options: any
    ) => {
      return inputData;
    },
  },
} as unknown as IExecuteFunctions;

describe("CoinGeckoHelper", () => {
  describe("executeOperation", () => {
    it("should execute a valid coin operation", async () => {
      try {
        const result = await CoinGeckoHelper.executeOperation(
          "coin",
          "get",
          {
            coinId: "bitcoin",
            options: {
              market_data: true,
              community_data: false,
              developer_data: false,
            },
          },
          mockExecuteFunctions
        );

        console.log("result", result);

        expect(result).toBeDefined();
        expect(result).toHaveProperty("id", "bitcoin");
        expect(result).toHaveProperty("market_data.current_price.usd", 50000);
      } catch (error) {
        console.error("Test failed:", error);
        throw error;
      }
    });

    it("should handle invalid operations", async () => {
      try {
        await CoinGeckoHelper.executeOperation(
          "invalid",
          "invalid",
          {},
          mockExecuteFunctions
        );
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toBeDefined();
      }
    });
  });
});

describe("CoinGeckoHelper - Advanced Test Cases", () => {
  beforeEach(() => {
    // Reset the execute function before each test
    CoinGecko.prototype.execute = async function (this: any) {
      return [[{ json: mockCoinData }]];
    };
  });

  describe("Parameter Handling", () => {
    it("should handle empty parameters object", async () => {
      const result = await CoinGeckoHelper.executeOperation(
        "coin",
        "get",
        {},
        mockExecuteFunctions
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty("id", "bitcoin");
    });

    it("should handle null values in parameters", async () => {
      const result = await CoinGeckoHelper.executeOperation(
        "coin",
        "get",
        { someParam: null },
        mockExecuteFunctions
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty("id", "bitcoin");
    });

    it("should handle undefined values in parameters", async () => {
      const result = await CoinGeckoHelper.executeOperation(
        "coin",
        "get",
        { someParam: undefined },
        mockExecuteFunctions
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty("id", "bitcoin");
    });
  });

  describe("Response Handling", () => {
    it("should handle empty response data", async () => {
      CoinGecko.prototype.execute = async function (this: any) {
        return [[{ json: {} }]];
      };
      const result = await CoinGeckoHelper.executeOperation(
        "coin",
        "get",
        { coinId: "bitcoin" },
        mockExecuteFunctions
      );
      expect(result).toEqual({});
    });

    // it("should handle null response data", async () => {
    //   CoinGecko.prototype.execute = async function (this: any) {
    //     return [[{ json: null }]];
    //   };
    //   const result = await CoinGeckoHelper.executeOperation(
    //     "coin",
    //     "get",
    //     { coinId: "bitcoin" },
    //     mockExecuteFunctions
    //   );
    //   expect(result).toBeNull();
    // });
  });

  describe("Error Handling", () => {
    it("should handle network errors", async () => {
      CoinGecko.prototype.execute = async function (this: any) {
        throw new Error("Network error");
      };
      await expect(
        CoinGeckoHelper.executeOperation(
          "coin",
          "get",
          { coinId: "bitcoin" },
          mockExecuteFunctions
        )
      ).rejects.toThrow("Network error");
    });

    it("should handle timeout errors", async () => {
      CoinGecko.prototype.execute = async function (this: any) {
        throw new Error("Request timed out");
      };
      await expect(
        CoinGeckoHelper.executeOperation(
          "coin",
          "get",
          { coinId: "bitcoin" },
          mockExecuteFunctions
        )
      ).rejects.toThrow("Request timed out");
    });

    it("should handle rate limit errors", async () => {
      CoinGecko.prototype.execute = async function (this: any) {
        throw new Error("Rate limit exceeded");
      };
      await expect(
        CoinGeckoHelper.executeOperation(
          "coin",
          "get",
          { coinId: "bitcoin" },
          mockExecuteFunctions
        )
      ).rejects.toThrow("Rate limit exceeded");
    });
  });
});

// Run tests if not in a test runner
if (require.main === module) {
  describe("CoinGeckoHelper Tests", () => {
    console.log("Running CoinGeckoHelper tests...");

    it("should execute operations", async () => {
      try {
        const result = await CoinGeckoHelper.executeOperation(
          "coin",
          "get",
          { coinId: "bitcoin" },
          mockExecuteFunctions
        );
        console.log("Test succeeded:", result);
      } catch (error) {
        console.error("Test failed:", error);
        throw error;
      }
    });
  });
}
