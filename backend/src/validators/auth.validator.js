import { z } from "zod";

export const registerSchema = {
  body: z.object({
    email: z.string().trim().email("Please provide a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(100, "Password is too long"),
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(50, "First name is too long"),
    lastName: z
      .string()
      .trim()
      .max(50, "Last name is too long")
      .optional()
      .default(""),
    role: z.enum(["USER", "BUSINESS"]).optional().default("USER"),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z.string().email("Please provide a valid email address"),
    password: z.string().min(1, "Password is required"),
  }),
};

export default {
  registerSchema,
  loginSchema,
};
