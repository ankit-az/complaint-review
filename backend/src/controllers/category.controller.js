import { prisma } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import { AppError } from "../utils/AppError.js";

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { companies: true },
      },
    },
    orderBy: { name: "asc" },
  });

  const formatted = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    iconName: cat.iconName,
    companyCount: cat._count.companies,
  }));

  return sendSuccess(res, { categories: formatted }, "Categories retrieved successfully");
});

export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      companies: {
        where: { isSuspended: false },
        orderBy: { overallRating: "desc" },
        take: 20,
      },
      _count: {
        select: { companies: true },
      },
    },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return sendSuccess(res, { category }, "Category details retrieved");
});

export default {
  getCategories,
  getCategoryBySlug,
};
