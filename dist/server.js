"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@temporalio/client");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const workflow_routes_1 = __importDefault(require("./routes/workflow.routes"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
require("dotenv").config();
(0, dotenv_1.config)({ path: "./.env" });
// Express app configuration
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json({ limit: "50mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "50mb", extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname)));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// Connect to MongoDB
(async () => {
    try {
        console.log("mongodb uri", process.env.MONGO_URI);
        await mongoose_1.default.connect(process.env.MONGO_URI, {});
        console.log("Connected to MongoDB");
    }
    catch (err) {
        console.error("Mongodb connection error ", err);
    }
})();
// Connect to Temporal
(async () => {
    try {
        if (process.env.NODE_ENV === "production") {
            await client_1.Connection.connect({
                address: process.env.TEMPORAL_ENDPOINT_DEV,
                apiKey: process.env.TEMPORAL_API_DEV,
            });
            console.log("Connected to Temporal cloud");
        }
        else {
            await client_1.Connection.connect({
                address: "localhost:7233",
            });
            console.log("Connected to Temporal localhost");
        }
    }
    catch (err) {
        console.error("Temporal connection error ", err);
    }
})();
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/workflows", workflow_routes_1.default);
// configure port
const port = process.env.PORT || 3000;
// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
