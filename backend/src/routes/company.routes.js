import { Router } from "express";
import { getCompanies, getCompanyBySlug } from "../controllers/company.controller.js";

const router = Router();

router.get("/", getCompanies);
router.get("/:slug", getCompanyBySlug);

export default router;
