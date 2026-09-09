import { Router } from "express";
import {
  getAdminReviews,
  updateReviewStatus,
  deleteReview,
} from "../controllers/admin.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

// Protect all admin routes: require login and ADMIN role
router.use(authenticate, authorize("ADMIN"));

router.get("/reviews", getAdminReviews);
router.patch("/reviews/:id/status", updateReviewStatus);
router.delete("/reviews/:id", deleteReview);

export default router;
