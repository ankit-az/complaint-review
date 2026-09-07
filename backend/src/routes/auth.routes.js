import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { sendSuccess } from "../utils/response.js";

const router = Router();

// Foundation auth routes (Expanded fully in Phase 2)
router.get("/me", authenticate, (req, res) => {
  return sendSuccess(res, { user: req.user }, "Current user retrieved");
});

export default router;
