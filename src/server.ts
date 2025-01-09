import express from "express";
import { Connection } from "@temporalio/client";
import mongoose from "mongoose";
import { config } from "dotenv";
import authRoutes from "./routes/auth.routes";
import workflowRoutes from "./routes/workflow.routes";

import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
require("dotenv").config();

config({ path: "./.env" });

// Express app configuration
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(path.join(__dirname)));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Connect to MongoDB
(async () => {
  try {
    console.log("mongodb uri", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI!, {});
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Mongodb connection error ", err);
  }
})();

// Connect to Temporal
(async () => {
  try {
    await Connection.connect({
      address: "localhost:7233",
    });
    console.log("Connected to Temporal");
  } catch (err) {
    console.error("Temporal connection error ", err);
  }
})();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/workflows", workflowRoutes);

// configure port
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
