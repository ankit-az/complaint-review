import { prisma } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import { AppError } from "../utils/AppError.js";

export const getRecentReviews = asyncHandler(async (req, res) => {
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 6));
  const { companySlug, companyId } = req.query;

  const where = {
    status: "PUBLISHED",
    ...(companySlug
      ? { company: { slug: companySlug } }
      : companyId
      ? { companyId }
      : {}),
  };

  const reviews = await prisma.review.findMany({
    where,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          role: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
        },
      },
      response: {
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      },
    },
  });

  return sendSuccess(res, { reviews }, "Recent reviews retrieved");
});

export const voteHelpfulReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await prisma.review.update({
    where: { id },
    data: {
      helpfulCount: {
        increment: 1,
      },
    },
    select: {
      id: true,
      helpfulCount: true,
    },
  });

  return sendSuccess(res, { review }, "Helpful vote recorded successfully");
});

export const createReview = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("You must be logged in to submit a review.", 401);
  }

  // 1. Enforce Role Restriction: Business accounts cannot post customer reviews
  if (req.user.role === "BUSINESS") {
    throw new AppError(
      "Business accounts are not permitted to submit customer reviews. Please log in with a consumer account to write a review.",
      403
    );
  }

  const { companyId, companySlug, companyName, rating, title, content } = req.body;

  if (!rating || !title || !content) {
    throw new AppError("Rating, title, and review content are required.", 400);
  }

  const numericRating = parseInt(rating, 10);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    throw new AppError("Rating must be an integer between 1 and 5.", 400);
  }

  if (title.trim().length < 3) {
    throw new AppError("Review title must be at least 3 characters long.", 400);
  }

  if (content.trim().length < 10) {
    throw new AppError("Review content must be at least 10 characters long.", 400);
  }

  // 2. Resolve company by id, slug, or name
  let company = null;
  if (companyId) {
    company = await prisma.company.findFirst({
      where: {
        OR: [
          { id: companyId },
          { slug: companyId },
        ],
      },
    });
  }

  if (!company && companySlug) {
    company = await prisma.company.findUnique({
      where: { slug: companySlug },
    });
  }

  if (!company && companyName) {
    const generatedSlug = companyName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    company = await prisma.company.findFirst({
      where: {
        OR: [
          { slug: generatedSlug },
          { name: { equals: companyName.trim(), mode: "insensitive" } },
        ],
      },
    });

    // Auto-create company record if not found so new reviews are never lost
    if (!company) {
      company = await prisma.company.create({
        data: {
          name: companyName.trim(),
          slug: generatedSlug || `company-${Date.now()}`,
          isClaimed: false,
          isVerified: false,
        },
      });
    }
  }

  if (!company) {
    throw new AppError("Target company could not be resolved. Please specify a valid company.", 404);
  }

  // 3. Conflict of interest check: Ensure reviewer does not manage or own this company
  const managedProfile = await prisma.businessProfile.findFirst({
    where: {
      userId: req.user.id,
      companyId: company.id,
    },
  });

  if (managedProfile) {
    throw new AppError(
      "Conflict of interest: You cannot submit a review for a company you manage or own.",
      403
    );
  }

  // 4. Create the authentic review record in PostgreSQL
  const review = await prisma.review.create({
    data: {
      userId: req.user.id,
      companyId: company.id,
      rating: numericRating,
      title: title.trim(),
      content: content.trim(),
      status: "PUBLISHED",
      verificationStatus: req.user.isVerified ? "VERIFIED" : "UNVERIFIED",
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          role: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
        },
      },
    },
  });

  // 3. Update company aggregated metrics
  const allCompanyReviews = await prisma.review.findMany({
    where: { companyId: company.id, status: "PUBLISHED" },
    select: { rating: true },
  });

  const totalReviews = allCompanyReviews.length;
  const avgRating = totalReviews > 0
    ? Number((allCompanyReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
    : 0;

  const starCounts = { star1Count: 0, star2Count: 0, star3Count: 0, star4Count: 0, star5Count: 0 };
  for (const r of allCompanyReviews) {
    if (r.rating >= 1 && r.rating <= 5) {
      starCounts[`star${r.rating}Count`] += 1;
    }
  }

  await prisma.company.update({
    where: { id: company.id },
    data: {
      overallRating: avgRating,
      reviewCount: totalReviews,
      ...starCounts,
    },
  });

  return sendSuccess(res, { review }, "Review published successfully", 201);
});

export default {
  getRecentReviews,
  voteHelpfulReview,
  createReview,
};
