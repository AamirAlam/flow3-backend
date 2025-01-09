import { NativeConnection, Worker } from "@temporalio/worker";
import * as activities from "./activities";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  // Connect to Temporal
  const connection = await NativeConnection.connect({
    address: "localhost:7233",
  });

  const worker = await Worker.create({
    connection,
    namespace: "default",
    taskQueue: "api-workflow",
    workflowsPath: require.resolve("./workflows"),
    activities,
  });

  console.log("Worker connected, ready to execute workflows");
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
