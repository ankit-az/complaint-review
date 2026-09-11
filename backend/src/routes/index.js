import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import categoryRoutes from "./category.routes.js";
import companyRoutes from "./company.routes.js";
import reviewRoutes from "./review.routes.js";
import searchRoutes from "./search.routes.js";
import businessRoutes from "./business.routes.js";
import adminRoutes from "./admin.routes.js";
import blogRoutes from "./blog.routes.js";

const apiV1Router = Router();

// Version 1 API Route Registrations
apiV1Router.use("/health", healthRoutes);
apiV1Router.use("/auth", authRoutes);
apiV1Router.use("/categories", categoryRoutes);
apiV1Router.use("/companies", companyRoutes);
apiV1Router.use("/reviews", reviewRoutes);
apiV1Router.use("/search", searchRoutes);
apiV1Router.use("/business", businessRoutes);
apiV1Router.use("/admin", adminRoutes);
apiV1Router.use("/blogs", blogRoutes);

export default apiV1Router;
