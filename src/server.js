import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import routes from "./routes.js";

dotenv.config();

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

// Error Handler
app.use((err, req, res, next) => {
  console.error("[Uncaught Backend Error]:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
