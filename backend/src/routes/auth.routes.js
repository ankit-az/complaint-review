import { Router } from "express";
import { authenticate, optionalAuthenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { register, login, refresh, logout, getMe } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", optionalAuthenticate, getMe);

export default router;
