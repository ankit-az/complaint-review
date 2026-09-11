import { Router } from "express";
import multer from "multer";
import {
  getBlogPosts,
  getBlogCategories,
  getBlogPostBySlug,
  uploadBlogImageController,
} from "../controllers/blog.controller.js";

const router = Router();

// Memory storage for multer so we can directly stream to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

router.get("/categories", getBlogCategories);
router.get("/", getBlogPosts);
router.get("/:slug", getBlogPostBySlug);
router.post("/upload-image", upload.single("image"), uploadBlogImageController);

export default router;
