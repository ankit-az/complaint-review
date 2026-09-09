import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import { AppError } from "../utils/AppError.js";

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET || "default_jwt_access_secret",
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" }
  );
};

const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString("hex");
};

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

// 1. Business Registration
export const registerBusiness = async ({
  firstName,
  lastName,
  email,
  password,
  companyName,
  websiteUrl,
  contactPhone,
  categoryId,
  country,
  address,
  city,
  jobTitle = "Business Owner",
}) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user account already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw new AppError(
      "An account with this email address already exists. Please log in or use another email.",
      409
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  // Generate unique slug for company
  let baseSlug = slugify(companyName);
  if (!baseSlug) baseSlug = "company";
  let finalSlug = baseSlug;
  let counter = 1;

  while (await prisma.company.findUnique({ where: { slug: finalSlug } })) {
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  // Create User, Company, and BusinessProfile in a transactional operation
  const result = await prisma.$transaction(async (tx) => {
    // 1. Create Business User
    const newUser = await tx.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role: "BUSINESS",
        isVerified: true,
      },
    });

    // 2. Create Company
    const newCompany = await tx.company.create({
      data: {
        name: companyName.trim(),
        slug: finalSlug,
        websiteUrl: websiteUrl?.trim() || null,
        contactEmail: normalizedEmail,
        contactPhone: contactPhone?.trim() || null,
        country: country?.trim() || null,
        address: address?.trim() || null,
        city: city?.trim() || null,
        categoryId: categoryId || null,
        isClaimed: true,
        isVerified: false,
        verificationStatus: "PENDING",
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    // 3. Create BusinessProfile
    const newProfile = await tx.businessProfile.create({
      data: {
        userId: newUser.id,
        companyId: newCompany.id,
        jobTitle: jobTitle.trim(),
        isOwner: true,
        isApproved: true,
      },
    });

    // 4. Create initial welcome notification
    await tx.businessNotification.create({
      data: {
        companyId: newCompany.id,
        userId: newUser.id,
        type: "SYSTEM",
        title: "Welcome to ComplaintReview Business!",
        message: `Your business dashboard for ${newCompany.name} is ready. Start by completing your profile and inviting customers.`,
      },
    });

    return { user: newUser, company: newCompany, profile: newProfile };
  });

  const accessToken = generateAccessToken(result.user);
  const rawRefreshToken = generateRefreshToken();
  const tokenHash = hashToken(rawRefreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      userId: result.user.id,
      tokenHash,
      expiresAt,
    },
  });

  return {
    user: {
      id: result.user.id,
      email: result.user.email,
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      role: result.user.role,
      isVerified: result.user.isVerified,
    },
    company: result.company,
    businessProfile: result.profile,
    accessToken,
    refreshToken: rawRefreshToken,
  };
};

// 2. Claim an Existing Unclaimed Company
export const claimBusiness = async (userId, { companyId, jobTitle = "Business Owner", contactEmail }) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    throw new AppError("Target company not found.", 404);
  }

  if (company.isClaimed) {
    const existingOwner = await prisma.businessProfile.findFirst({
      where: { companyId, isOwner: true },
    });
    if (existingOwner && existingOwner.userId !== userId) {
      throw new AppError(
        "This company is already claimed and managed by another verified business owner.",
        400
      );
    }
  }

  // Update user role to BUSINESS and link profile
  const result = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { role: "BUSINESS" },
    });

    const updatedCompany = await tx.company.update({
      where: { id: companyId },
      data: {
        isClaimed: true,
        contactEmail: contactEmail || company.contactEmail,
      },
      include: {
        category: true,
      },
    });

    const profile = await tx.businessProfile.upsert({
      where: { userId },
      update: {
        companyId,
        jobTitle,
        isOwner: true,
        isApproved: true,
      },
      create: {
        userId,
        companyId,
        jobTitle,
        isOwner: true,
        isApproved: true,
      },
    });

    await tx.businessNotification.create({
      data: {
        companyId,
        userId,
        type: "SYSTEM",
        title: "Company Claim Approved",
        message: `You now manage ${updatedCompany.name}. Access your reviews, analytics, and settings here.`,
      },
    });

    return { company: updatedCompany, profile };
  });

  return result;
};

// 3. Get Authenticated Business Me Context
export const getBusinessMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      avatarUrl: true,
      isVerified: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const businessProfile = await prisma.businessProfile.findUnique({
    where: { userId },
    include: {
      company: {
        include: {
          category: { select: { id: true, name: true, slug: true } },
          _count: {
            select: {
              reviews: true,
              locations: true,
              products: true,
              invitations: true,
            },
          },
        },
      },
    },
  });

  return {
    user,
    businessProfile: businessProfile || null,
    company: businessProfile?.company || null,
  };
};

// 4. Dashboard Stats & Key Metrics
export const getDashboardStats = async (companyId) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      category: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!company) {
    throw new AppError("Company not found", 404);
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalReviews,
    reviewsThisMonth,
    unansweredReviews,
    answeredReviews,
    unreadNotifications,
    recentReviews,
  ] = await Promise.all([
    prisma.review.count({
      where: { companyId, status: { in: ["PUBLISHED", "PENDING", "FLAGGED"] } },
    }),
    prisma.review.count({
      where: {
        companyId,
        status: "PUBLISHED",
        createdAt: { gte: startOfMonth },
      },
    }),
    prisma.review.count({
      where: {
        companyId,
        status: "PUBLISHED",
        response: null,
      },
    }),
    prisma.review.count({
      where: {
        companyId,
        status: "PUBLISHED",
        response: { isNot: null },
      },
    }),
    prisma.businessNotification.count({
      where: { companyId, isRead: false },
    }),
    prisma.review.findMany({
      where: { companyId, status: "PUBLISHED" },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true },
        },
        response: true,
      },
    }),
  ]);

  const responseRate =
    totalReviews > 0 ? Math.round((answeredReviews / totalReviews) * 100) : 100;

  return {
    company: {
      id: company.id,
      name: company.name,
      slug: company.slug,
      logoUrl: company.logoUrl,
      isVerified: company.isVerified,
      verificationStatus: company.verificationStatus,
      overallRating: company.overallRating || 0.0,
      reviewCount: totalReviews,
    },
    metrics: {
      trustScore: company.overallRating > 0 ? company.overallRating.toFixed(1) : "0.0",
      averageRating: company.overallRating > 0 ? company.overallRating.toFixed(1) : "0.0",
      totalReviews,
      reviewsThisMonth,
      unansweredReviews,
      answeredReviews,
      responseRate,
      unreadNotifications,
    },
    ratingDistribution: {
      5: company.star5Count || 0,
      4: company.star4Count || 0,
      3: company.star3Count || 0,
      2: company.star2Count || 0,
      1: company.star1Count || 0,
    },
    recentReviews,
  };
};

// 5. Deep Review Analytics & Sentiment Clustering
export const getAnalytics = async (companyId, { period = "30d" }) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    throw new AppError("Company not found", 404);
  }

  const now = new Date();
  let startDate = new Date();
  if (period === "7d") startDate.setDate(now.getDate() - 7);
  else if (period === "90d") startDate.setDate(now.getDate() - 90);
  else if (period === "1y") startDate.setFullYear(now.getFullYear() - 1);
  else if (period === "all") startDate = new Date(2020, 0, 1);
  else startDate.setDate(now.getDate() - 30); // default 30d

  const reviews = await prisma.review.findMany({
    where: {
      companyId,
      status: "PUBLISHED",
      createdAt: { gte: startDate },
    },
    select: {
      id: true,
      rating: true,
      title: true,
      content: true,
      verificationStatus: true,
      createdAt: true,
      response: { select: { id: true, createdAt: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  const total = reviews.length;
  let positiveCount = 0; // 4-5 stars
  let neutralCount = 0; // 3 stars
  let negativeCount = 0; // 1-2 stars
  let verifiedCount = 0;
  let respondedCount = 0;
  let totalRatingSum = 0;

  // Sentiment Topics Map
  const topicsMap = {
    "Product Quality": { mentions: 0, positive: 0, negative: 0, keywords: ["quality", "product", "features", "durable", "software", "tool", "app"] },
    "Customer Support": { mentions: 0, positive: 0, negative: 0, keywords: ["support", "service", "team", "agent", "help", "response", "assistance"] },
    "Delivery & Speed": { mentions: 0, positive: 0, negative: 0, keywords: ["delivery", "fast", "shipping", "speed", "quick", "delay", "on time"] },
    "Pricing & Value": { mentions: 0, positive: 0, negative: 0, keywords: ["price", "cost", "value", "expensive", "cheap", "subscription", "worth"] },
    "Refunds & Billing": { mentions: 0, positive: 0, negative: 0, keywords: ["refund", "billing", "charge", "cancel", "payment", "money"] },
  };

  // Group by date interval for time-series charts
  const volumeByDate = {};

  for (const r of reviews) {
    totalRatingSum += r.rating;
    if (r.rating >= 4) positiveCount++;
    else if (r.rating === 3) neutralCount++;
    else negativeCount++;

    if (r.verificationStatus === "VERIFIED") verifiedCount++;
    if (r.response) respondedCount++;

    const dateKey = r.createdAt.toISOString().slice(0, 10);
    volumeByDate[dateKey] = (volumeByDate[dateKey] || 0) + 1;

    // Scan for sentiment topics in review text
    const text = `${r.title} ${r.content}`.toLowerCase();
    for (const [topic, data] of Object.entries(topicsMap)) {
      const matches = data.keywords.some((kw) => text.includes(kw));
      if (matches) {
        data.mentions++;
        if (r.rating >= 4) data.positive++;
        else if (r.rating <= 2) data.negative++;
      }
    }
  }

  const sentimentTopics = Object.entries(topicsMap).map(([name, data]) => ({
    topic: name,
    mentions: data.mentions,
    positiveRatio: data.mentions > 0 ? Math.round((data.positive / data.mentions) * 100) : 100,
    sentiment: data.positive >= data.negative ? "positive" : "negative",
  }));

  const averageRating = total > 0 ? (totalRatingSum / total).toFixed(2) : company.overallRating.toFixed(2);
  const responseRate = total > 0 ? Math.round((respondedCount / total) * 100) : 100;
  const verifiedPercentage = total > 0 ? Math.round((verifiedCount / total) * 100) : 0;

  return {
    period,
    totalReviews: total,
    averageRating: parseFloat(averageRating),
    responseRate,
    verifiedPercentage,
    distribution: {
      positive: positiveCount,
      neutral: neutralCount,
      negative: negativeCount,
    },
    timeSeries: Object.entries(volumeByDate).map(([date, count]) => ({ date, count })),
    sentimentTopics,
  };
};

// 6. Review Management Inbox
export const getReviews = async (companyId, query = {}) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;

  const { rating, responseStatus, verificationStatus, search, sortBy = "newest" } = query;

  const where = {
    companyId,
    status: { in: ["PUBLISHED", "FLAGGED"] },
    ...(rating ? { rating: parseInt(rating) } : {}),
    ...(verificationStatus ? { verificationStatus } : {}),
    ...(responseStatus === "answered"
      ? { response: { isNot: null } }
      : responseStatus === "unanswered"
      ? { response: null }
      : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  let orderBy = { createdAt: "desc" };
  if (sortBy === "oldest") orderBy = { createdAt: "asc" };
  else if (sortBy === "highest") orderBy = { rating: "desc" };
  else if (sortBy === "lowest") orderBy = { rating: "asc" };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
        response: {
          include: {
            responder: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
    }),
    prisma.review.count({ where }),
  ]);

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

// 7. Official Response Management
export const respondToReview = async (companyId, userId, reviewId, content) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.companyId !== companyId) {
    throw new AppError("Review not found or does not belong to your company.", 404);
  }

  const response = await prisma.companyResponse.upsert({
    where: { reviewId },
    update: {
      content: content.trim(),
      responderId: userId,
      updatedAt: new Date(),
    },
    create: {
      reviewId,
      responderId: userId,
      content: content.trim(),
    },
    include: {
      responder: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
  });

  return response;
};

export const deleteResponse = async (companyId, reviewId) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.companyId !== companyId) {
    throw new AppError("Review not found or does not belong to your company.", 404);
  }

  await prisma.companyResponse.deleteMany({
    where: { reviewId },
  });

  return true;
};

// 8. Report a Review
export const reportReview = async (userId, reviewId, { reason, details }) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  const report = await prisma.report.create({
    data: {
      reviewId,
      reporterId: userId,
      reason,
      details: details?.trim() || null,
      status: "PENDING",
    },
  });

  // Increment report count on review
  await prisma.review.update({
    where: { id: reviewId },
    data: { reportCount: { increment: 1 } },
  });

  return report;
};

// 9. Customer Review Invitations
export const getInvitations = async (companyId, query = {}) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit) || 15));
  const skip = (page - 1) * limit;

  const where = {
    companyId,
    ...(query.status ? { status: query.status } : {}),
  };

  const [invitations, total] = await Promise.all([
    prisma.reviewInvitation.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.reviewInvitation.count({ where }),
  ]);

  return {
    invitations,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const createInvitation = async (companyId, { customerEmail, customerName }) => {
  const normalizedEmail = customerEmail.toLowerCase().trim();
  const inviteToken = crypto.randomBytes(24).toString("hex");

  const invitation = await prisma.reviewInvitation.create({
    data: {
      companyId,
      customerEmail: normalizedEmail,
      customerName: customerName?.trim() || null,
      inviteToken,
      status: "SENT",
      sentAt: new Date(),
    },
  });

  return invitation;
};

// 10. Multi-Location Management
export const getLocations = async (companyId) => {
  return prisma.businessLocation.findMany({
    where: { companyId, isDeleted: false },
    orderBy: [{ isPrimary: "desc" }, { name: "asc" }],
  });
};

export const createLocation = async (companyId, data) => {
  if (data.isPrimary) {
    await prisma.businessLocation.updateMany({
      where: { companyId },
      data: { isPrimary: false },
    });
  }

  return prisma.businessLocation.create({
    data: {
      ...data,
      companyId,
    },
  });
};

export const updateLocation = async (companyId, locationId, data) => {
  const location = await prisma.businessLocation.findFirst({
    where: { id: locationId, companyId },
  });

  if (!location) {
    throw new AppError("Branch location not found", 404);
  }

  if (data.isPrimary) {
    await prisma.businessLocation.updateMany({
      where: { companyId, id: { not: locationId } },
      data: { isPrimary: false },
    });
  }

  return prisma.businessLocation.update({
    where: { id: locationId },
    data,
  });
};

export const deleteLocation = async (companyId, locationId) => {
  const location = await prisma.businessLocation.findFirst({
    where: { id: locationId, companyId },
  });

  if (!location) {
    throw new AppError("Branch location not found", 404);
  }

  return prisma.businessLocation.update({
    where: { id: locationId },
    data: { isDeleted: true },
  });
};

// 11. Products / Services Catalog
export const getProducts = async (companyId) => {
  return prisma.businessProduct.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
  });
};

export const createProduct = async (companyId, data) => {
  return prisma.businessProduct.create({
    data: {
      ...data,
      companyId,
    },
  });
};

export const updateProduct = async (companyId, productId, data) => {
  const product = await prisma.businessProduct.findFirst({
    where: { id: productId, companyId },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return prisma.businessProduct.update({
    where: { id: productId },
    data,
  });
};

export const deleteProduct = async (companyId, productId) => {
  const product = await prisma.businessProduct.findFirst({
    where: { id: productId, companyId },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return prisma.businessProduct.delete({
    where: { id: productId },
  });
};

// 12. Review Widgets Management & Public Sanitized Endpoint
export const getWidgetConfig = async (companyId) => {
  let config = await prisma.widgetConfig.findFirst({
    where: { companyId },
  });

  if (!config) {
    config = await prisma.widgetConfig.create({
      data: {
        companyId,
        widgetType: "badge",
        theme: "light",
      },
    });
  }

  return config;
};

export const saveWidgetConfig = async (companyId, data) => {
  const existing = await prisma.widgetConfig.findFirst({
    where: { companyId },
  });

  if (existing) {
    return prisma.widgetConfig.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.widgetConfig.create({
    data: {
      ...data,
      companyId,
    },
  });
};

export const getPublicWidgetData = async (slug) => {
  const company = await prisma.company.findUnique({
    where: { slug },
    select: {
      name: true,
      slug: true,
      logoUrl: true,
      isVerified: true,
      overallRating: true,
      reviewCount: true,
      star1Count: true,
      star2Count: true,
      star3Count: true,
      star4Count: true,
      star5Count: true,
      reviews: {
        where: { status: "PUBLISHED" },
        take: 3,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          rating: true,
          title: true,
          content: true,
          createdAt: true,
          user: {
            select: { firstName: true },
          },
        },
      },
    },
  });

  if (!company) {
    throw new AppError("Company not found", 404);
  }

  return company;
};

// 13. Notifications System
export const getNotifications = async (companyId) => {
  const [notifications, unreadCount] = await Promise.all([
    prisma.businessNotification.findMany({
      where: { companyId },
      take: 30,
      orderBy: { createdAt: "desc" },
    }),
    prisma.businessNotification.count({
      where: { companyId, isRead: false },
    }),
  ]);

  return { notifications, unreadCount };
};

export const markNotificationRead = async (companyId, notificationId) => {
  return prisma.businessNotification.updateMany({
    where: { id: notificationId, companyId },
    data: { isRead: true },
  });
};

export const markAllNotificationsRead = async (companyId) => {
  return prisma.businessNotification.updateMany({
    where: { companyId, isRead: false },
    data: { isRead: true },
  });
};

// 14. Company Profile Management
export const getCompanyProfile = async (companyId) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      category: true,
      locations: { where: { isDeleted: false } },
    },
  });

  if (!company) {
    throw new AppError("Company not found", 404);
  }

  return company;
};

export const updateCompanyProfile = async (companyId, data) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    throw new AppError("Company not found", 404);
  }

  return prisma.company.update({
    where: { id: companyId },
    data,
    include: {
      category: true,
    },
  });
};

export const requestVerification = async (companyId, verificationData) => {
  const company = await prisma.company.update({
    where: { id: companyId },
    data: {
      verificationStatus: "PENDING",
      verificationDetails: verificationData,
    },
  });

  await prisma.businessNotification.create({
    data: {
      companyId,
      type: "VERIFICATION_UPDATE",
      title: "Verification Documents Submitted",
      message:
        "Your official business registration has been submitted for platform verification. An admin will review your credentials within 24-48 business hours.",
    },
  });

  return company;
};

// 15. Password & Security Management
export const updateBusinessPassword = async (userId, { currentPassword, newPassword }) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    throw new AppError("Current password is incorrect.", 400);
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  return true;
};

export default {
  registerBusiness,
  claimBusiness,
  getBusinessMe,
  getDashboardStats,
  getAnalytics,
  getReviews,
  respondToReview,
  deleteResponse,
  reportReview,
  getInvitations,
  createInvitation,
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getWidgetConfig,
  saveWidgetConfig,
  getPublicWidgetData,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getCompanyProfile,
  updateCompanyProfile,
  requestVerification,
  updateBusinessPassword,
};
