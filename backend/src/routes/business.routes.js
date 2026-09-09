import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireBusinessAuth } from "../middleware/business.middleware.js";
import { validate } from "../middleware/validate.js";
import {
  businessRegisterSchema,
  claimBusinessSchema,
  updateProfileSchema,
  reviewResponseSchema,
  reportReviewSchema,
  createInvitationSchema,
  locationSchema,
  productSchema,
  widgetConfigSchema,
  verificationSchema,
  updatePasswordSchema,
} from "../validators/business.validator.js";
import {
  register,
  claim,
  getMe,
  getDashboard,
  getAnalytics,
  getReviews,
  respondToReview,
  deleteResponse,
  reportReview,
  getInvitations,
  createInvitation,
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getWidgetConfig,
  saveWidgetConfig,
  getPublicWidgetData,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getProfile,
  updateProfile,
  requestVerification,
  updatePassword,
} from "../controllers/business.controller.js";

const router = Router();

// --- Public / Unauthenticated Business Endpoints ---
router.post("/register", validate(businessRegisterSchema), register);
router.get("/widgets/public/:slug", getPublicWidgetData);

// --- Authenticated User Endpoints (Onboarding & Claiming) ---
router.post("/claim", authenticate, validate(claimBusinessSchema), claim);
router.get("/me", authenticate, getMe);
router.put("/settings/password", authenticate, validate(updatePasswordSchema), updatePassword);
router.post("/reviews/:id/report", authenticate, validate(reportReviewSchema), reportReview);

// --- Protected Business Portal Endpoints (Multi-Tenant Company Scoped) ---
router.use(requireBusinessAuth);

// 1. Dashboard & Analytics
router.get("/dashboard", getDashboard);
router.get("/analytics", getAnalytics);

// 2. Reviews Management & Responses
router.get("/reviews", getReviews);
router.post("/reviews/:id/response", validate(reviewResponseSchema), respondToReview);
router.put("/reviews/:id/response", validate(reviewResponseSchema), respondToReview);
router.delete("/reviews/:id/response", deleteResponse);

// 3. Customer Invitations
router.get("/invitations", getInvitations);
router.post("/invitations", validate(createInvitationSchema), createInvitation);

// 4. Locations Management
router.get("/locations", getLocations);
router.post("/locations", validate(locationSchema), createLocation);
router.put("/locations/:id", validate(locationSchema), updateLocation);
router.delete("/locations/:id", deleteLocation);

// 5. Products & Services Catalog
router.get("/products", getProducts);
router.post("/products", validate(productSchema), createProduct);
router.put("/products/:id", validate(productSchema), updateProduct);
router.delete("/products/:id", deleteProduct);

// 6. Review Widgets Studio
router.get("/widgets", getWidgetConfig);
router.put("/widgets", validate(widgetConfigSchema), saveWidgetConfig);

// 7. Business Notifications
router.get("/notifications", getNotifications);
router.patch("/notifications/:id/read", markNotificationRead);
router.post("/notifications/mark-all-read", markAllNotificationsRead);

// 8. Company Profile & Verification
router.get("/profile", getProfile);
router.put("/profile", validate(updateProfileSchema), updateProfile);
router.post("/verify", validate(verificationSchema), requestVerification);

export default router;
