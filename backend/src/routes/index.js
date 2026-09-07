import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";

const apiV1Router = Router();

// Version 1 API Route Registrations
apiV1Router.use("/health", healthRoutes);
apiV1Router.use("/auth", authRoutes);

export default apiV1Router;
