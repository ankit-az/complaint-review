import { prisma } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import { AppError } from "../utils/AppError.js";

const ALIAS_MAP = {
  telecommunications: "telecom-internet",
  "telecom-internet": "telecommunications",
  automotive: "automotive-vehicles",
  "automotive-vehicles": "automotive",
  "restaurants-food": "food-beverages",
  "food-beverages": "restaurants-food",
  education: "education-training",
  "education-training": "education",
  "home-services": "home-improvement",
  "home-improvement": "home-services",
  "media-marketing": "marketing-advertising",
  "marketing-advertising": "media-marketing",
  "manufacturing-industrial": "industrial-manufacturing",
  "industrial-manufacturing": "manufacturing-industrial",
  "non-profit-charity": "non-profit-charities",
  "non-profit-charities": "non-profit-charity",
  "childcare-parenting": "family-childcare",
  "family-childcare": "childcare-parenting",
};

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { companies: true },
      },
    },
    orderBy: { name: "asc" },
  });

  // Return purely real counts from the database: 0 if no companies exist
  const formatted = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    iconName: cat.iconName,
    companyCount: cat._count?.companies || 0,
  }));

  return sendSuccess(res, { categories: formatted }, "Categories retrieved successfully");
});

export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  let category = await prisma.category.findUnique({
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

  // If not found by exact slug, check alias
  if (!category && ALIAS_MAP[slug]) {
    category = await prisma.category.findUnique({
      where: { slug: ALIAS_MAP[slug] },
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
  }

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  // Return real companies from database (empty array if none registered)
  const formatted = {
    ...category,
    companyCount: category._count?.companies || 0,
    companies: category.companies || [],
  };

  return sendSuccess(res, { category: formatted }, "Category details retrieved");
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, description, iconName } = req.body;
  if (!name || name.trim().length < 2) {
    throw new AppError("Category name must be at least 2 characters long", 400);
  }

  const finalSlug = (slug || name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const existing = await prisma.category.findFirst({
    where: {
      OR: [
        { slug: finalSlug },
        { name: { equals: name.trim(), mode: "insensitive" } },
      ],
    },
  });

  if (existing) {
    throw new AppError("Category with this name or slug already exists", 409);
  }

  const category = await prisma.category.create({
    data: {
      name: name.trim(),
      slug: finalSlug,
      description: description?.trim() || null,
      iconName: iconName?.trim() || "FolderOpen",
    },
  });

  return sendSuccess(res, { category }, "Category created successfully", 201);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, slug, description, iconName } = req.body;

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Category not found", 404);
  }

  const updated = await prisma.category.update({
    where: { id },
    data: {
      ...(name ? { name: name.trim() } : {}),
      ...(slug ? { slug: slug.trim().toLowerCase() } : {}),
      ...(description !== undefined ? { description: description?.trim() || null } : {}),
      ...(iconName !== undefined ? { iconName: iconName?.trim() || "FolderOpen" } : {}),
    },
  });

  return sendSuccess(res, { category: updated }, "Category updated successfully");
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { companies: true } } },
  });

  if (!existing) {
    throw new AppError("Category not found", 404);
  }

  if (existing._count?.companies > 0) {
    throw new AppError("Cannot delete category with associated companies", 400);
  }

  await prisma.category.delete({ where: { id } });
  return sendSuccess(res, null, "Category deleted successfully");
});

export default {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};

