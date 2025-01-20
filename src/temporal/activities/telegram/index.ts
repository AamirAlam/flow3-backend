// Send telegram notification
export async function executeTelegramNotification(args: any) {
  try {
    // replace this with actual code
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // define the fixed returned type for all nodes
    return { data: args };
  } catch (error) {
    //: todo define the error message structure
    throw new Error("Error executing executeTelegramNotification");
  }
}
