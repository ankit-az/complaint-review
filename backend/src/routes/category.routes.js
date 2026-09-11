import { Router } from "express";
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.get("/", getCategories);
router.get("/:slug", getCategoryBySlug);

// Admin-only category management
router.post("/", authenticate, requireRole("ADMIN"), createCategory);
router.put("/:id", authenticate, requireRole("ADMIN"), updateCategory);
router.delete("/:id", authenticate, requireRole("ADMIN"), deleteCategory);

export default router;
