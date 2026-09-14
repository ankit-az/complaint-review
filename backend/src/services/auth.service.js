import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../config/db.js";
import { AppError } from "../utils/AppError.js";

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET || "default_jwt_access_secret",
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" }
  );
};

const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString("hex");
};

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const registerUser = async ({ email, password, firstName, lastName, role = "USER" }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw new AppError("An account with this email already exists.", 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const newUser = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      firstName: firstName.trim(),
      lastName: (lastName || "").trim(),
      role,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      avatarUrl: true,
      isVerified: true,
      createdAt: true,
    },
  });

  const accessToken = generateAccessToken(newUser);
  const rawRefreshToken = generateRefreshToken();
  const tokenHash = hashToken(rawRefreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      userId: newUser.id,
      tokenHash,
      expiresAt,
    },
  });

  return {
    user: newUser,
    accessToken,
    refreshToken: rawRefreshToken,
  };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password.", 401);
  }

  if (user.isSuspended) {
    throw new AppError("This account has been suspended. Please contact support.", 403);
  }

  const userProfile = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    avatarUrl: user.avatarUrl,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };

  const accessToken = generateAccessToken(userProfile);
  const rawRefreshToken = generateRefreshToken();
  const tokenHash = hashToken(rawRefreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  return {
    user: userProfile,
    accessToken,
    refreshToken: rawRefreshToken,
  };
};

export const rotateRefreshToken = async (rawRefreshToken) => {
  if (!rawRefreshToken) {
    throw new AppError("No refresh token provided.", 401);
  }

  const tokenHash = hashToken(rawRefreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!storedToken || storedToken.revokedAt || new Date() > storedToken.expiresAt) {
    throw new AppError("Invalid or expired session. Please log in again.", 401);
  }

  if (storedToken.user.isSuspended) {
    throw new AppError("Account suspended.", 403);
  }

  // Revoke old token
  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { revokedAt: new Date() },
  });

  const userProfile = {
    id: storedToken.user.id,
    email: storedToken.user.email,
    firstName: storedToken.user.firstName,
    lastName: storedToken.user.lastName,
    role: storedToken.user.role,
    avatarUrl: storedToken.user.avatarUrl,
    isVerified: storedToken.user.isVerified,
  };

  const newAccessToken = generateAccessToken(userProfile);
  const newRawRefreshToken = generateRefreshToken();
  const newTokenHash = hashToken(newRawRefreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      userId: storedToken.user.id,
      tokenHash: newTokenHash,
      expiresAt,
    },
  });

  return {
    user: userProfile,
    accessToken: newAccessToken,
    refreshToken: newRawRefreshToken,
  };
};

export const logoutUser = async (rawRefreshToken) => {
  if (rawRefreshToken) {
    const tokenHash = hashToken(rawRefreshToken);
    await prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
};

export default {
  registerUser,
  loginUser,
  rotateRefreshToken,
  logoutUser,
};
