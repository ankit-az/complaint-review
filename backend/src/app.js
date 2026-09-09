import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import apiV1Router from "./routes/index.js";
import businessRoutes from "./routes/business.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { AppError } from "./utils/AppError.js";

dotenv.config();

const app = express();

// 1. Security HTTP Headers
app.use(
  helmet({
    contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false,
    crossOriginEmbedderPolicy: false,
  })
);

// 2. CORS Setup
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new AppError(`Origin ${origin} not allowed by CORS`, 403));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// 3. Global Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
    errors: [],
  },
});
app.use("/api", limiter);

// 4. Request Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser(process.env.COOKIE_SECRET || "default_cookie_secret"));

// 5. Mount API Routes
app.use("/api/v1", apiV1Router);
app.use("/api/business", businessRoutes);

// 6. Base Root Route
app.get("/", (req, res) => {
  res.json({
    name: "Complaint-Review REST API",
    version: "1.0.0",
    docs: "/api/v1/health",
  });
});

// 7. Handle Unhandled Routes (404)
app.all("{*path}", (req, res, next) => {
  next(new AppError(`Cannot find ${req.method} ${req.originalUrl} on this server`, 404));
});

// 8. Centralized Global Error Handler
app.use(errorHandler);

export default app;
