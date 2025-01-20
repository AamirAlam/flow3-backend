export async function executeSelectDataNode(args: any) {
  try {
    //: todo replace this with actual code
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // : todo define the fixed returned type for all nodes
    return { data: args };
  } catch (error) {
    throw new Error("Error executing executeSelectDataNode");
  }
}
