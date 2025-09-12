import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import * as freecryptoapi from "./services/free-crypto-api.js";
import * as exchangerateapi from "./services/exchange-rate-api.js";

// Import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import transactionRoutes from "./routes/transactions.js";
import webhookRoutes from "./routes/webhook.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  app.set("trust proxy", 1);
} else {
  app.set("trust proxy", false);
}
// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later.",
});

// Middleware

// app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Get crypto rate
app.get("/api/crypto-rate", async (req, res) => {
  const { token } = req.query;
  const data = await freecryptoapi.rate(token);
  res.status(200).json(data);
});

// Get fiat rate
app.get("/api/fiat-rate", async (req, res) => {
  const { currency } = req.query;
  const data = await exchangerateapi.rate(currency);
  res.status(200).json(data);
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/webhook", webhookRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Page not found" });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error(error.stack);

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  res.status(500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
