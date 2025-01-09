import axios from "axios";

export async function makeFirstApiCall(args: any) {
  try {
    // wait for 10 seconds
    await new Promise((resolve) => setTimeout(resolve, 10000));

    return { data: "First activity data" };
  } catch (error) {
    throw error;
  }
}

export async function makeSecondApiCall(args: any) {
  try {
    // wait for 10 seconds
    await new Promise((resolve) => setTimeout(resolve, 10000));

    return { data: "Second activity data" };
  } catch (error) {
    throw error;
  }
}
