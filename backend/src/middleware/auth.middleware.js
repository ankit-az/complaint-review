import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/db.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  let token = null;

  // 1. Check HTTP-only cookie
  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }
  // 2. Check Authorization header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in. Please log in to gain access.", 401)
    );
  }

  // 3. Verify token
  const decoded = jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET || "default_jwt_secret"
  );

  // 4. Check if user still exists
  const currentUser = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      avatarUrl: true,
      isVerified: true,
      isSuspended: true,
    },
  });

  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401)
    );
  }

  if (currentUser.isSuspended) {
    return next(
      new AppError(
        "Your account has been suspended. Please contact support.",
        403
      )
    );
  }

  // Attach user to request
  req.user = currentUser;
  next();
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have permission to perform this action.",
          403
        )
      );
    }
    next();
  };
};

export default {
  authenticate,
  authorize,
};
