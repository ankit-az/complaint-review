import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/db.js";
import { authenticate } from "./auth.middleware.js";

/**
 * Middleware ensuring user is authenticated, has BUSINESS or ADMIN role,
 * and possesses an active linked BusinessProfile and Company.
 * Enforces strict multi-tenant isolation.
 */
export const requireBusinessAuth = [
  authenticate,
  asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication required.", 401));
    }

    if (req.user.role !== "BUSINESS" && req.user.role !== "ADMIN") {
      return next(
        new AppError(
          "Access denied. You need a Business account to access the Business Portal.",
          403
        )
      );
    }

    // Retrieve business profile and associated company
    const businessProfile = await prisma.businessProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        company: {
          include: {
            category: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });

    if (!businessProfile || !businessProfile.company) {
      return next(
        new AppError(
          "No registered business profile found for this account. Please claim or create a business profile.",
          404
        )
      );
    }

    if (businessProfile.company.isSuspended) {
      return next(
        new AppError(
          "This business profile has been suspended. Please contact platform support.",
          403
        )
      );
    }

    // Attach verified business context to request for all downstream controllers
    req.business = {
      profile: businessProfile,
      company: businessProfile.company,
      companyId: businessProfile.companyId,
    };

    next();
  }),
];

export default {
  requireBusinessAuth,
};
