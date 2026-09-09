import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import authService from "../services/auth.service.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

const setTokenCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/api/v1/auth", // Only sent to auth routes
  });
};

const clearTokenCookies = (res) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", { ...cookieOptions, path: "/api/v1/auth" });
};

export const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.registerUser(req.body);
  setTokenCookies(res, accessToken, refreshToken);
  return sendSuccess(res, { user, accessToken }, "Registration successful", 201);
});

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.loginUser(req.body);
  setTokenCookies(res, accessToken, refreshToken);
  return sendSuccess(res, { user, accessToken }, "Login successful");
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  const { user, accessToken, refreshToken } = await authService.rotateRefreshToken(token);
  setTokenCookies(res, accessToken, refreshToken);
  return sendSuccess(res, { user, accessToken }, "Session refreshed");
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  await authService.logoutUser(token);
  clearTokenCookies(res);
  return sendSuccess(res, {}, "Logged out successfully");
});

export const getMe = asyncHandler(async (req, res) => {
  return sendSuccess(res, { user: req.user }, "Current user retrieved");
});

export default {
  register,
  login,
  refresh,
  logout,
  getMe,
};
