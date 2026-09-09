import { prisma } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";

export const searchAll = asyncHandler(async (req, res) => {
  const query = (req.query.q || "").trim();

  if (!query) {
    return sendSuccess(res, { companies: [], categories: [] }, "Empty query");
  }

  const [companies, categories] = await Promise.all([
    prisma.company.findMany({
      where: {
        isSuspended: false,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { overallRating: "desc" },
    }),
    prisma.category.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
    }),
  ]);

  return sendSuccess(
    res,
    { query, companies, categories },
    "Search results retrieved"
  );
});

export default {
  searchAll,
};
