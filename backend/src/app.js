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
const parseOrigins = () => {
  const defaults = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://www.complaint-review.com",
    "https://complaint-review.com",
  ];

  const envOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map((url) => url.trim().replace(/\/+$/, ""))
    .filter(Boolean);

  const origins = new Set([...defaults, ...envOrigins]);

  // For any domain, ensure both apex and www variants are included
  for (const origin of Array.from(origins)) {
    try {
      const url = new URL(origin);
      if (url.hostname.startsWith("www.")) {
        origins.add(`${url.protocol}//${url.hostname.slice(4)}${url.port ? `:${url.port}` : ""}`);
      } else if (!url.hostname.includes("localhost") && !url.hostname.includes("127.0.0.1")) {
        origins.add(`${url.protocol}//www.${url.hostname}${url.port ? `:${url.port}` : ""}`);
      }
    } catch {
      // Ignore invalid URLs
    }
  }

  return Array.from(origins);
};

const allowedOrigins = parseOrigins();

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);

    try {
      const cleanOrigin = origin.replace(/\/+$/, "");
      const hostname = new URL(origin).hostname;
      const isAllowed =
        allowedOrigins.includes(cleanOrigin) ||
        hostname.endsWith(".vercel.app");

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    } catch {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

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
