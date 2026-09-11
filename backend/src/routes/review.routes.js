import { Router } from "express";
import { getRecentReviews, voteHelpfulReview, createReview } from "../controllers/review.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { createReviewSchema } from "../validators/review.validator.js";

const router = Router();

router.get("/recent", getRecentReviews);
router.post("/:id/helpful", voteHelpfulReview);
router.post("/", authenticate, validate(createReviewSchema), createReview);

export default router;
