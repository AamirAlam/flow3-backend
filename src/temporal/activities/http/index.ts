import axios from "axios";
import { ActivityArgs } from "../../../types";

// make a http get api call
export async function makeHttpGetApiCall(args: ActivityArgs) {
  try {
    // Example implementation

    const { config } = args;

    const url = config.url;
    const result = (await axios.get(url)).data;

    return result;
  } catch (error) {
    throw new Error("Error executing makeHtrpApiCall");
  }
}

// Make a http post call
export async function makeHttpPostApiCall(args: ActivityArgs) {
  try {
    // Example implementation
    const url = args.config.url;
    const body = args.config.body;
    const headers = args.config.headers;

    const result = (await axios.post(url, body, { headers })).data;

    return result;
  } catch (error) {
    throw new Error("Error executing makeHtrpApiCall");
  }
}

// Make a http put call

export async function makeHttpPutApiCall(args: ActivityArgs) {
  try {
    // Example implementation
    const url = args.config.url;
    const body = args.config.body;
    const headers = args.config.headers;

    const result = (await axios.put(url, body, { headers })).data;

    return result;
  } catch (error) {
    throw new Error("Error executing makeHtrpApiCall");
  }
}

// Make a http delete call

export async function makeHttpDeleteApiCall(args: ActivityArgs) {
  try {
    // Example implementation
    const url = args.config.url;
    const headers = args.config.headers;

    const result = (await axios.delete(url, { headers })).data;

    return result;
  } catch (error) {
    throw new Error("Error executing makeHtrpApiCall");
  }
}

// Make a http patch call

export async function makeHttpPatchApiCall(args: ActivityArgs) {
  try {
    // Example implementation
    const url = args.config.url;
    const body = args.config.body;
    const headers = args.config.headers;

    const result = (await axios.patch(url, body, { headers })).data;

    return result;
  } catch (error) {
    throw new Error("Error executing makeHtrpApiCall");
  }
}
