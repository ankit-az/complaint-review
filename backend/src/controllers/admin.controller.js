import { prisma } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import { AppError } from "../utils/AppError.js";

/**
 * 1. Admin Dashboard Aggregate KPI & Activity Stats
 */
export const getAdminDashboardStats = asyncHandler(async (req, res) => {
  // Batch 1: Review aggregate stats
  const [reviewStatuses, reviewVerifications, reviewRatingAvg, reviewRatingDist] = await Promise.all([
    prisma.review.groupBy({ by: ["status"], _count: { status: true } }),
    prisma.review.groupBy({ by: ["verificationStatus"], _count: { verificationStatus: true } }),
    prisma.review.aggregate({ _avg: { rating: true }, _count: { id: true } }),
    prisma.review.groupBy({ by: ["rating"], _count: { rating: true } }),
  ]);

  // Batch 2: User stats
  const [userRoles, suspendedUsers] = await Promise.all([
    prisma.user.groupBy({ by: ["role"], _count: { role: true } }),
    prisma.user.count({ where: { isSuspended: true } }),
  ]);

  // Batch 3: Company, Category, and Report stats
  const [totalCompanies, claimedCompanies, verifiedCompanies, suspendedCompanies, totalCategories, reportStatuses] = await Promise.all([
    prisma.company.count(),
    prisma.company.count({ where: { isClaimed: true } }),
    prisma.company.count({ where: { isVerified: true } }),
    prisma.company.count({ where: { isSuspended: true } }),
    prisma.category.count(),
    prisma.report.groupBy({ by: ["status"], _count: { status: true } }),
  ]);

  // Batch 4: Recent activity items & top companies
  const [recentReviews, recentUsers, recentReports, topCompanies] = await Promise.all([
    prisma.review.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            overallRating: true,
          },
        },
        _count: {
          select: { reports: true },
        },
      },
    }),
    prisma.user.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        isSuspended: true,
        createdAt: true,
      },
    }),
    prisma.report.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        reporter: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        review: {
          select: {
            id: true,
            title: true,
            rating: true,
            company: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    }),
    prisma.company.findMany({
      take: 5,
      orderBy: { reviewCount: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        overallRating: true,
        reviewCount: true,
        isClaimed: true,
        isVerified: true,
      },
    }),
  ]);

  // Parse Review Statuses
  const totalReviews = reviewRatingAvg._count.id || 0;
  let publishedReviews = 0;
  let pendingReviews = 0;
  let flaggedReviews = 0;
  let rejectedReviews = 0;
  reviewStatuses.forEach((item) => {
    if (item.status === "PUBLISHED") publishedReviews = item._count.status;
    if (item.status === "PENDING") pendingReviews = item._count.status;
    if (item.status === "FLAGGED") flaggedReviews = item._count.status;
    if (item.status === "REJECTED") rejectedReviews = item._count.status;
  });

  let verifiedReviews = 0;
  reviewVerifications.forEach((item) => {
    if (item.verificationStatus === "VERIFIED") verifiedReviews = item._count.verificationStatus;
  });

  // Parse User Roles
  let totalUsers = 0;
  let consumerUsers = 0;
  let businessUsers = 0;
  let adminUsers = 0;
  userRoles.forEach((item) => {
    totalUsers += item._count.role;
    if (item.role === "USER") consumerUsers = item._count.role;
    if (item.role === "BUSINESS") businessUsers = item._count.role;
    if (item.role === "ADMIN") adminUsers = item._count.role;
  });

  // Parse Report Statuses
  let totalReports = 0;
  let pendingReports = 0;
  let resolvedReports = 0;
  reportStatuses.forEach((item) => {
    totalReports += item._count.status;
    if (item.status === "PENDING") pendingReports = item._count.status;
    if (item.status === "RESOLVED") resolvedReports = item._count.status;
  });

  // Format star rating distribution (1 to 5)
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviewRatingDist.forEach((item) => {
    if (item.rating >= 1 && item.rating <= 5) {
      ratingDistribution[item.rating] = item._count.rating;
    }
  });

  const averageRating = reviewRatingAvg._avg.rating
    ? parseFloat(reviewRatingAvg._avg.rating.toFixed(2))
    : 0;

  return sendSuccess(
    res,
    {
      overview: {
        totalReviews,
        publishedReviews,
        pendingReviews,
        flaggedReviews,
        rejectedReviews,
        verifiedReviews,
        totalUsers,
        consumerUsers,
        businessUsers,
        adminUsers,
        suspendedUsers,
        totalCompanies,
        claimedCompanies,
        verifiedCompanies,
        suspendedCompanies,
        totalCategories,
        totalReports,
        pendingReports,
        resolvedReports,
        averageRating,
        ratingDistribution,
      },
      recentReviews,
      recentUsers,
      recentReports,
      topCompanies,
    },
    "Admin dashboard stats retrieved"
  );
});

/**
 * 2. Reviews Management
 */
export const getAdminReviews = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  const { status, companySlug, search } = req.query;

  const where = {
    ...(status && status !== "ALL" ? { status } : {}),
    ...(companySlug && companySlug !== "ALL" ? { company: { slug: companySlug } } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
            { company: { name: { contains: search, mode: "insensitive" } } },
            { user: { firstName: { contains: search, mode: "insensitive" } } },
            { user: { lastName: { contains: search, mode: "insensitive" } } },
            { user: { email: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            overallRating: true,
          },
        },
        response: true,
        _count: {
          select: { reports: true },
        },
      },
    }),
    prisma.review.count({ where }),
  ]);

  return sendSuccess(
    res,
    {
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
    "Admin reviews retrieved"
  );
});

export const updateReviewStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, verificationStatus } = req.body;

  const data = {};
  if (status) data.status = status;
  if (verificationStatus) data.verificationStatus = verificationStatus;

  const review = await prisma.review.update({
    where: { id },
    data,
    include: {
      company: true,
      user: true,
    },
  });

  return sendSuccess(res, { review }, "Review updated by admin");
});

export const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.review.delete({
    where: { id },
  });

  return sendSuccess(res, null, "Review deleted permanently");
});

/**
 * 3. Companies Directory & Administration
 */
export const getAdminCompanies = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  const { search, categoryId, isClaimed, isVerified, isSuspended } = req.query;

  const where = {
    ...(categoryId && categoryId !== "ALL" ? { categoryId } : {}),
    ...(isClaimed === "true" ? { isClaimed: true } : isClaimed === "false" ? { isClaimed: false } : {}),
    ...(isVerified === "true" ? { isVerified: true } : isVerified === "false" ? { isVerified: false } : {}),
    ...(isSuspended === "true" ? { isSuspended: true } : isSuspended === "false" ? { isSuspended: false } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
            { websiteUrl: { contains: search, mode: "insensitive" } },
            { contactEmail: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            reviews: true,
            businessProfiles: true,
          },
        },
      },
    }),
    prisma.company.count({ where }),
  ]);

  return sendSuccess(
    res,
    {
      companies,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
    "Admin companies retrieved"
  );
});

export const updateCompanyStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isVerified, isSuspended, isClaimed } = req.body;

  const data = {};
  if (typeof isVerified === "boolean") data.isVerified = isVerified;
  if (typeof isSuspended === "boolean") data.isSuspended = isSuspended;
  if (typeof isClaimed === "boolean") data.isClaimed = isClaimed;

  const company = await prisma.company.update({
    where: { id },
    data,
    include: {
      category: true,
    },
  });

  return sendSuccess(res, { company }, "Company updated by admin");
});

/**
 * 4. User Directory & Administration
 */
export const getAdminUsers = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  const { role, isSuspended, isVerified, search } = req.query;

  const where = {
    ...(role && role !== "ALL" ? { role } : {}),
    ...(isSuspended === "true" ? { isSuspended: true } : isSuspended === "false" ? { isSuspended: false } : {}),
    ...(isVerified === "true" ? { isVerified: true } : isVerified === "false" ? { isVerified: false } : {}),
    ...(search
      ? {
          OR: [
            { email: { contains: search, mode: "insensitive" } },
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatarUrl: true,
        isVerified: true,
        isSuspended: true,
        createdAt: true,
        businessProfile: {
          select: {
            id: true,
            jobTitle: true,
            isOwner: true,
            company: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            reviews: true,
            reportsFiled: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return sendSuccess(
    res,
    {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
    "Admin users retrieved"
  );
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isSuspended, isVerified, role } = req.body;

  // Protect superadmin account from being suspended or demoted
  const targetUser = await prisma.user.findUnique({ where: { id } });
  if (!targetUser) {
    throw new AppError("User not found", 404);
  }

  if (targetUser.email === process.env.ADMIN_EMAIL && isSuspended === true) {
    throw new AppError("Primary platform administrator account cannot be suspended.", 400);
  }

  const data = {};
  if (typeof isSuspended === "boolean") data.isSuspended = isSuspended;
  if (typeof isVerified === "boolean") data.isVerified = isVerified;
  if (role && ["USER", "BUSINESS", "ADMIN"].includes(role)) data.role = role;

  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isVerified: true,
      isSuspended: true,
    },
  });

  return sendSuccess(res, { user }, "User updated by admin");
});

/**
 * 5. Abuse Reports & Dispute Resolution
 */
export const getAdminReports = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  const { status, reason } = req.query;

  const where = {
    ...(status && status !== "ALL" ? { status } : {}),
    ...(reason && reason !== "ALL" ? { reason } : {}),
  };

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        reporter: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        review: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    }),
    prisma.report.count({ where }),
  ]);

  return sendSuccess(
    res,
    {
      reports,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
    "Admin reports retrieved"
  );
});

export const updateReportStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["PENDING", "REVIEWED", "DISMISSED", "RESOLVED"].includes(status)) {
    throw new AppError("Invalid report status", 400);
  }

  const report = await prisma.report.update({
    where: { id },
    data: {
      status,
      resolvedById: req.user.id,
    },
    include: {
      review: true,
    },
  });

  return sendSuccess(res, { report }, "Report status updated");
});

export default {
  getAdminDashboardStats,
  getAdminReviews,
  updateReviewStatus,
  deleteReview,
  getAdminCompanies,
  updateCompanyStatus,
  getAdminUsers,
  updateUserStatus,
  getAdminReports,
  updateReportStatus,
};
