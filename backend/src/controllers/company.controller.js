import { prisma } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import { AppError } from "../utils/AppError.js";

export const getCompanies = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
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
      orderBy: { overallRating: "desc" },
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
        take: 15,
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

  return sendSuccess(res, { company }, "Company profile retrieved");
});

export default {
  getCompanies,
  getCompanyBySlug,
};
