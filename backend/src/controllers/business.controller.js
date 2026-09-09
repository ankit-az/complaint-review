import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import businessService from "../services/business.service.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

const setTokenCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/v1/auth",
  });
};

export const register = asyncHandler(async (req, res) => {
  const result = await businessService.registerBusiness(req.body);
  setTokenCookies(res, result.accessToken, result.refreshToken);
  return sendSuccess(
    res,
    {
      user: result.user,
      company: result.company,
      businessProfile: result.businessProfile,
      accessToken: result.accessToken,
    },
    "Business registration successful! Welcome to the Business Portal.",
    201
  );
});

export const claim = asyncHandler(async (req, res) => {
  const result = await businessService.claimBusiness(req.user.id, req.body);
  return sendSuccess(res, result, "Company successfully claimed and linked to your account.");
});

export const getMe = asyncHandler(async (req, res) => {
  const result = await businessService.getBusinessMe(req.user.id);
  return sendSuccess(res, result, "Business profile context retrieved.");
});

export const getDashboard = asyncHandler(async (req, res) => {
  const result = await businessService.getDashboardStats(req.business.companyId);
  return sendSuccess(res, result, "Dashboard statistics retrieved.");
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const result = await businessService.getAnalytics(req.business.companyId, req.query);
  return sendSuccess(res, result, "Review analytics retrieved.");
});

export const getReviews = asyncHandler(async (req, res) => {
  const result = await businessService.getReviews(req.business.companyId, req.query);
  return sendSuccess(res, result, "Company reviews retrieved.");
});

export const respondToReview = asyncHandler(async (req, res) => {
  const result = await businessService.respondToReview(
    req.business.companyId,
    req.user.id,
    req.params.id,
    req.body.content
  );
  return sendSuccess(res, { response: result }, "Official response published successfully.");
});

export const deleteResponse = asyncHandler(async (req, res) => {
  await businessService.deleteResponse(req.business.companyId, req.params.id);
  return sendSuccess(res, {}, "Official response deleted successfully.");
});

export const reportReview = asyncHandler(async (req, res) => {
  const result = await businessService.reportReview(
    req.user.id,
    req.params.id,
    req.body
  );
  return sendSuccess(
    res,
    { report: result },
    "Review reported for moderation review. Our team will inspect it."
  );
});

export const getInvitations = asyncHandler(async (req, res) => {
  const result = await businessService.getInvitations(req.business.companyId, req.query);
  return sendSuccess(res, result, "Customer invitations retrieved.");
});

export const createInvitation = asyncHandler(async (req, res) => {
  const result = await businessService.createInvitation(req.business.companyId, req.body);
  return sendSuccess(res, { invitation: result }, "Review invitation created and queued.", 201);
});

export const getLocations = asyncHandler(async (req, res) => {
  const result = await businessService.getLocations(req.business.companyId);
  return sendSuccess(res, { locations: result }, "Branch locations retrieved.");
});

export const createLocation = asyncHandler(async (req, res) => {
  const result = await businessService.createLocation(req.business.companyId, req.body);
  return sendSuccess(res, { location: result }, "Branch location created successfully.", 201);
});

export const updateLocation = asyncHandler(async (req, res) => {
  const result = await businessService.updateLocation(
    req.business.companyId,
    req.params.id,
    req.body
  );
  return sendSuccess(res, { location: result }, "Branch location updated successfully.");
});

export const deleteLocation = asyncHandler(async (req, res) => {
  await businessService.deleteLocation(req.business.companyId, req.params.id);
  return sendSuccess(res, {}, "Branch location deleted successfully.");
});

export const getProducts = asyncHandler(async (req, res) => {
  const result = await businessService.getProducts(req.business.companyId);
  return sendSuccess(res, { products: result }, "Products/services retrieved.");
});

export const createProduct = asyncHandler(async (req, res) => {
  const result = await businessService.createProduct(req.business.companyId, req.body);
  return sendSuccess(res, { product: result }, "Product/service added successfully.", 201);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const result = await businessService.updateProduct(
    req.business.companyId,
    req.params.id,
    req.body
  );
  return sendSuccess(res, { product: result }, "Product/service updated successfully.");
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await businessService.deleteProduct(req.business.companyId, req.params.id);
  return sendSuccess(res, {}, "Product/service removed successfully.");
});

export const getWidgetConfig = asyncHandler(async (req, res) => {
  const result = await businessService.getWidgetConfig(req.business.companyId);
  return sendSuccess(res, { config: result }, "Widget configuration retrieved.");
});

export const saveWidgetConfig = asyncHandler(async (req, res) => {
  const result = await businessService.saveWidgetConfig(req.business.companyId, req.body);
  return sendSuccess(res, { config: result }, "Widget configuration saved.");
});

export const getPublicWidgetData = asyncHandler(async (req, res) => {
  const result = await businessService.getPublicWidgetData(req.params.slug);
  return sendSuccess(res, { company: result }, "Public widget data retrieved.");
});

export const getNotifications = asyncHandler(async (req, res) => {
  const result = await businessService.getNotifications(req.business.companyId);
  return sendSuccess(res, result, "Notifications retrieved.");
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  await businessService.markNotificationRead(req.business.companyId, req.params.id);
  return sendSuccess(res, {}, "Notification marked as read.");
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await businessService.markAllNotificationsRead(req.business.companyId);
  return sendSuccess(res, {}, "All notifications marked as read.");
});

export const getProfile = asyncHandler(async (req, res) => {
  const result = await businessService.getCompanyProfile(req.business.companyId);
  return sendSuccess(res, { company: result }, "Company profile retrieved.");
});

export const updateProfile = asyncHandler(async (req, res) => {
  const result = await businessService.updateCompanyProfile(
    req.business.companyId,
    req.body
  );
  return sendSuccess(res, { company: result }, "Company profile updated successfully.");
});

export const requestVerification = asyncHandler(async (req, res) => {
  const result = await businessService.requestVerification(
    req.business.companyId,
    req.body
  );
  return sendSuccess(
    res,
    { company: result },
    "Verification documents submitted successfully."
  );
});

export const updatePassword = asyncHandler(async (req, res) => {
  await businessService.updateBusinessPassword(req.user.id, req.body);
  return sendSuccess(res, {}, "Password updated successfully.");
});

export default {
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
};
