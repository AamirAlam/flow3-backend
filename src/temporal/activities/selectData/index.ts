import { ActivityArgs } from "../../../types";

// transform data from input
export async function executeSelectDataNode(args: ActivityArgs) {
  try {
    const { config, inputs } = args;

    if (Array.isArray(inputs)) {
      const selector = config.field;
      const data = inputs.map((input) => input[selector]);
      return data.slice(0, 5);
    } else if (typeof inputs === "object") {
      const selector = config.field;
      const data = inputs[selector];
      return data;
    } else {
      const selector = config.field;
      const data = inputs[selector];
      return data;
    }
  } catch (error) {
    throw new Error("Error executing executeSelectDataNode");
  }
}
