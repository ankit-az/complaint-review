import { Router } from "express";
import { getRecentReviews, voteHelpfulReview, createReview } from "../controllers/review.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/recent", getRecentReviews);
router.post("/:id/helpful", voteHelpfulReview);
router.post("/", authenticate, createReview);

export default router;
