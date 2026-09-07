import { Router } from "express";
import { prisma } from "../config/db.js";
import { sendSuccess } from "../utils/response.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    let dbStatus = "connected";
    let dbError = null;

    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (err) {
      dbStatus = "disconnected";
      dbError = err.message;
    }

    const healthData = {
      status: dbStatus === "connected" ? "healthy" : "degraded",
      service: "Complaint-Review API",
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsage: {
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      },
      database: {
        status: dbStatus,
        ...(dbError ? { error: dbError } : {}),
      },
    };

    return sendSuccess(res, healthData, "Service is healthy");
  })
);

export default router;
