import { z } from "zod";

export const businessRegisterSchema = {
  body: z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters").max(50),
    lastName: z.string().min(2, "Last name must be at least 2 characters").max(50),
    email: z.string().email("Please enter a valid business email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    companyName: z.string().min(2, "Company name is required"),
    websiteUrl: z.string().url("Please provide a valid website URL").optional().or(z.literal("")),
    contactPhone: z.string().optional().or(z.literal("")),
    categoryId: z.string().optional().or(z.literal("")),
    country: z.string().optional().or(z.literal("")),
    address: z.string().optional().or(z.literal("")),
    city: z.string().optional().or(z.literal("")),
    jobTitle: z.string().optional().or(z.literal("")),
  }),
};

export const claimBusinessSchema = {
  body: z.object({
    companyId: z.string().min(1, "Company ID is required"),
    jobTitle: z.string().optional().default("Business Owner"),
    contactEmail: z.string().email("Please provide a valid corporate email").optional(),
  }),
};

export const updateProfileSchema = {
  body: z.object({
    name: z.string().min(2, "Company name is required").optional(),
    description: z.string().max(2000, "Description is too long").optional().nullable(),
    logoUrl: z.string().url("Invalid logo URL").optional().nullable().or(z.literal("")),
    coverImageUrl: z.string().url("Invalid cover image URL").optional().nullable().or(z.literal("")),
    websiteUrl: z.string().url("Invalid website URL").optional().nullable().or(z.literal("")),
    contactEmail: z.string().email("Invalid contact email").optional().nullable().or(z.literal("")),
    contactPhone: z.string().optional().nullable().or(z.literal("")),
    address: z.string().optional().nullable().or(z.literal("")),
    city: z.string().optional().nullable().or(z.literal("")),
    country: z.string().optional().nullable().or(z.literal("")),
    categoryId: z.string().optional().nullable().or(z.literal("")),
    socialLinks: z.record(z.string(), z.string()).optional().nullable(),
    businessHours: z.record(z.string(), z.string()).optional().nullable(),
  }),
};

export const reviewResponseSchema = {
  body: z.object({
    content: z
      .string()
      .min(5, "Response content must be at least 5 characters")
      .max(4000, "Response is too long"),
  }),
};

export const reportReviewSchema = {
  body: z.object({
    reason: z.enum([
      "SPAM",
      "OFFENSIVE",
      "CONFLICT_OF_INTEREST",
      "FAKE_REVIEW",
      "OTHER",
    ]),
    details: z.string().max(1000).optional(),
  }),
};

export const createInvitationSchema = {
  body: z.object({
    customerEmail: z.string().email("Please provide a valid customer email"),
    customerName: z.string().max(100).optional().or(z.literal("")),
  }),
};

export const locationSchema = {
  body: z.object({
    name: z.string().min(2, "Branch name is required"),
    address: z.string().min(2, "Address is required"),
    city: z.string().optional().or(z.literal("")),
    state: z.string().optional().or(z.literal("")),
    country: z.string().optional().or(z.literal("")),
    postalCode: z.string().optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    email: z.string().email("Invalid branch email").optional().or(z.literal("")),
    isPrimary: z.boolean().optional().default(false),
  }),
};

export const productSchema = {
  body: z.object({
    name: z.string().min(2, "Product or service name is required"),
    description: z.string().max(1000).optional().or(z.literal("")),
    price: z.number().nonnegative().optional().nullable(),
    currency: z.string().max(5).optional().default("USD"),
    imageUrl: z.string().url("Invalid image URL").optional().nullable().or(z.literal("")),
    category: z.string().optional().or(z.literal("")),
    status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).optional().default("ACTIVE"),
  }),
};

export const widgetConfigSchema = {
  body: z.object({
    widgetType: z.enum(["badge", "score", "carousel", "mini"]).default("badge"),
    theme: z.enum(["light", "dark", "emerald"]).default("light"),
    settings: z.record(z.string(), z.any()).optional(),
  }),
};

export const verificationSchema = {
  body: z.object({
    registrationNumber: z.string().min(2, "Registration / Tax number is required"),
    taxId: z.string().optional().or(z.literal("")),
    documentUrl: z.string().url("Invalid document URL").optional().or(z.literal("")),
    notes: z.string().max(1000).optional().or(z.literal("")),
  }),
};

export const updatePasswordSchema = {
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
  }),
};

export default {
  businessRegisterSchema,
  claimBusinessSchema,
  updateProfileSchema,
  reviewResponseSchema,
  reportReviewSchema,
  createInvitationSchema,
  locationSchema,
  productSchema,
  widgetConfigSchema,
  verificationSchema,
  updatePasswordSchema,
};
