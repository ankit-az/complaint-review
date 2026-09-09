import { prisma } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import { AppError } from "../utils/AppError.js";

export const getAdminReviews = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  const { status, companySlug, search } = req.query;

  const where = {
    ...(status ? { status } : {}),
    ...(companySlug ? { company: { slug: companySlug } } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
            { company: { name: { contains: search, mode: "insensitive" } } },
            { user: { firstName: { contains: search, mode: "insensitive" } } },
            { user: { lastName: { contains: search, mode: "insensitive" } } },
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

export default {
  getAdminReviews,
  updateReviewStatus,
  deleteReview,
};
