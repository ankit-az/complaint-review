import { z } from "zod";

export const registerSchema = {
  body: z.object({
    email: z.string().email("Please provide a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password is too long"),
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name is too long"),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name is too long"),
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
