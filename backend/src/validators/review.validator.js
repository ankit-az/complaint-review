import { z } from "zod";

export const createReviewSchema = {
  body: z.object({
    companyId: z.string().optional(),
    companySlug: z.string().optional(),
    companyName: z.string().optional(),
    rating: z.union([
      z.number().int().min(1).max(5),
      z.string().regex(/^[1-5]$/, "Rating must be between 1 and 5"),
    ]),
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(150, "Title cannot exceed 150 characters"),
    content: z
      .string()
      .min(10, "Review content must be at least 10 characters")
      .max(5000, "Review content cannot exceed 5000 characters"),
  }),
};

export const voteHelpfulSchema = {
  params: z.object({
    id: z.string().min(1, "Review ID is required"),
  }),
};

export default {
  createReviewSchema,
  voteHelpfulSchema,
};
