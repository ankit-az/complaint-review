import { prisma } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import { AppError } from "../utils/AppError.js";

export const getCompanies = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 30));
  const skip = (page - 1) * limit;

  const { q, category } = req.query;

  const where = {
    isSuspended: false,
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(category
      ? {
          category: {
            slug: category,
          },
        }
      : {}),
  };

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where,
      skip,
      take: limit,
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
      orderBy: [
        { reviewCount: "desc" },
        { overallRating: "desc" },
        { name: "asc" },
      ],
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
    "Companies retrieved successfully"
  );
});

export const getCompanyBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const company = await prisma.company.findUnique({
    where: { slug },
    include: {
      category: true,
      locations: { where: { isDeleted: false } },
      products: { where: { status: "ACTIVE" } },
      reviews: {
        where: { status: "PUBLISHED" },
        take: 100,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, avatarUrl: true },
          },
          response: true,
        },
      },
    },
  });

  if (!company || company.isSuspended) {
    throw new AppError("Company not found", 404);
  }

  // Ensure reviewCount and overallRating accurately match the actual published reviews
  const publishedReviews = company.reviews || [];
  const actualCount = publishedReviews.length;
  const actualAvg = actualCount > 0
    ? Number((publishedReviews.reduce((sum, r) => sum + r.rating, 0) / actualCount).toFixed(1))
    : 0.0;

  const starBreakdown = { star1Count: 0, star2Count: 0, star3Count: 0, star4Count: 0, star5Count: 0 };
  for (const r of publishedReviews) {
    if (r.rating >= 1 && r.rating <= 5) {
      starBreakdown[`star${r.rating}Count`] += 1;
    }
  }

  company.reviewCount = actualCount;
  company.overallRating = actualAvg;
  Object.assign(company, starBreakdown);

  return sendSuccess(res, { company }, "Company profile retrieved");
});

export default {
  getCompanies,
  getCompanyBySlug,
};
