import { Router } from "express";
import {
  getAdminDashboardStats,
  getAdminReviews,
  updateReviewStatus,
  deleteReview,
  getAdminCompanies,
  updateCompanyStatus,
  getAdminUsers,
  updateUserStatus,
  getAdminReports,
  updateReportStatus,
} from "../controllers/admin.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

// Protect all admin routes: require login and ADMIN role
router.use(authenticate, authorize("ADMIN"));

// 1. Dashboard Overview Stats
router.get("/dashboard", getAdminDashboardStats);

// 2. Reviews Management
router.get("/reviews", getAdminReviews);
router.patch("/reviews/:id/status", updateReviewStatus);
router.delete("/reviews/:id", deleteReview);

// 3. Companies Management
router.get("/companies", getAdminCompanies);
router.patch("/companies/:id", updateCompanyStatus);

// 4. Users Management
router.get("/users", getAdminUsers);
router.patch("/users/:id", updateUserStatus);

// 5. Abuse Reports
router.get("/reports", getAdminReports);
router.patch("/reports/:id/status", updateReportStatus);

export default router;
