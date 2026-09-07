import app from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

process.on("uncaughtException", (err) => {
  console.error("💥 UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

async function startServer() {
  // Test Database Connection
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(
      `🚀 Complaint-Review API Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
    );
    console.log(`📡 Base API URL: http://localhost:${PORT}/api/v1`);
    console.log(`🩺 Health check: http://localhost:${PORT}/api/v1/health`);
  });

  const shutdown = async (signal) => {
    console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
    server.close(async () => {
      console.log("🔌 HTTP server closed.");
      await disconnectDB();
      console.log("💾 Database disconnected.");
      process.exit(0);
    });

    // Force close after 10s if graceful shutdown hangs
    setTimeout(() => {
      console.error("⏳ Could not close connections in time, forcefully shutting down");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  process.on("unhandledRejection", (err) => {
    console.error("💥 UNHANDLED REJECTION! Shutting down gracefully...");
    console.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
}

startServer();