import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import routes from "./routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Healthcheck
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Interview Mirror AI Backend Intelligence Engine",
    timestamp: new Date().toISOString()
  });
});

// API Routes per 02_AI_BACKEND.md Section 17 & 03_MEMORY_PRIVACY_PROMPTS.md Section 28
app.use("/api", routes);

// Serve static frontend assets if built
const clientDistPath = path.resolve(__dirname, "../../client/dist");
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(clientDistPath, "index.html"));
  });
}

// Error Handler
app.use((err, req, res, next) => {
  console.error("[Uncaught Backend Error]:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
