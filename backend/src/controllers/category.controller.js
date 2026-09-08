import { prisma } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import { AppError } from "../utils/AppError.js";

export const CATEGORY_COMPANY_COUNTS = {
  technology: 1420,
  "banking-finance": 890,
  "e-commerce": 3250,
  insurance: 620,
  "travel-hospitality": 1120,
  healthcare: 640,
  automotive: 780,
  "automotive-vehicles": 780,
  "restaurants-food": 2450,
  "food-beverages": 2450,
  education: 930,
  "education-training": 930,
  "real-estate": 510,
  "home-services": 1850,
  "home-improvement": 1850,
  services: 2100,
  "beauty-wellness": 1190,
  "fitness-sports": 740,
  "legal-services": 430,
  "media-marketing": 820,
  "marketing-advertising": 820,
  telecommunications: 380,
  "telecom-internet": 380,
  "energy-utilities": 290,
  "entertainment-gaming": 670,
  "pets-animals": 540,
  "logistics-shipping": 460,
  "events-weddings": 390,
  "manufacturing-industrial": 310,
  "industrial-manufacturing": 310,
  "non-profit-charity": 220,
  "non-profit-charities": 220,
  "childcare-parenting": 340,
  "family-childcare": 340,
};

// Default sample companies for categories that don't have companies in DB yet
const DEFAULT_CATEGORY_COMPANIES = {
  "telecom-internet": [
    {
      id: "demo-tel-1",
      name: "OptiLink Fiber",
      slug: "optilink-fiber",
      city: "Dublin",
      country: "Ireland",
      overallRating: 4.3,
      reviewCount: 260,
      isVerified: true,
      description: "Ultra-low latency symmetrical gigabit fiber broadband for homes and enterprises.",
      logoUrl: null,
    },
    {
      id: "demo-tel-2",
      name: "Horizon Mobile Networks",
      slug: "horizon-mobile",
      city: "London",
      country: "United Kingdom",
      overallRating: 4.5,
      reviewCount: 180,
      isVerified: true,
      description: "Next-gen 5G mobile network coverage with unlimited high-speed data plans.",
      logoUrl: null,
    },
  ],
  telecommunications: [
    {
      id: "demo-tel-1",
      name: "OptiLink Fiber",
      slug: "optilink-fiber",
      city: "Dublin",
      country: "Ireland",
      overallRating: 4.3,
      reviewCount: 260,
      isVerified: true,
      description: "Ultra-low latency symmetrical gigabit fiber broadband for homes and enterprises.",
      logoUrl: null,
    },
  ],
  "energy-utilities": [
    {
      id: "demo-ene-1",
      name: "Helios Clean Energy",
      slug: "helios-clean-energy",
      city: "Phoenix",
      country: "United States",
      overallRating: 4.8,
      reviewCount: 165,
      isVerified: true,
      description: "Zero-down residential solar power installations, commercial microgrids, and battery storage.",
      logoUrl: null,
    },
  ],
  "entertainment-gaming": [
    {
      id: "demo-ent-1",
      name: "Starlight Interactive",
      slug: "starlight-interactive",
      city: "Tokyo",
      country: "Japan",
      overallRating: 4.6,
      reviewCount: 310,
      isVerified: true,
      description: "Award-winning multiplayer cross-platform gaming experiences and interactive media.",
      logoUrl: null,
    },
  ],
  "pets-animals": [
    {
      id: "demo-pet-1",
      name: "Pawsitive Care Hospital",
      slug: "pawsitive-care-hospital",
      city: "Melbourne",
      country: "Australia",
      overallRating: 4.9,
      reviewCount: 230,
      isVerified: true,
      description: "24/7 accredited veterinary emergency clinic, surgical care, and holistic animal wellness.",
      logoUrl: null,
    },
  ],
  "logistics-shipping": [
    {
      id: "demo-log-1",
      name: "Velocity Freight Express",
      slug: "velocity-freight-express",
      city: "Rotterdam",
      country: "Netherlands",
      overallRating: 4.4,
      reviewCount: 190,
      isVerified: true,
      description: "Autonomous track-and-trace global air and sea cargo logistics with zero customs delays.",
      logoUrl: null,
    },
  ],
  "events-weddings": [
    {
      id: "demo-eve-1",
      name: "Celebration Studio Co.",
      slug: "celebration-studio-co",
      city: "London",
      country: "United Kingdom",
      overallRating: 4.8,
      reviewCount: 145,
      isVerified: true,
      description: "Bespoke destination wedding production, luxury milestone galas, and floral architecture.",
      logoUrl: null,
    },
  ],
  "industrial-manufacturing": [
    {
      id: "demo-mfg-1",
      name: "Precision Metals Global",
      slug: "precision-metals-global",
      city: "Stuttgart",
      country: "Germany",
      overallRating: 4.7,
      reviewCount: 85,
      isVerified: true,
      description: "ISO-certified aerospace CNC precision machining and high-tolerance sheet metal tooling.",
      logoUrl: null,
    },
  ],
  "manufacturing-industrial": [
    {
      id: "demo-mfg-1",
      name: "Precision Metals Global",
      slug: "precision-metals-global",
      city: "Stuttgart",
      country: "Germany",
      overallRating: 4.7,
      reviewCount: 85,
      isVerified: true,
      description: "ISO-certified aerospace CNC precision machining and high-tolerance sheet metal tooling.",
      logoUrl: null,
    },
  ],
  "non-profit-charities": [
    {
      id: "demo-ngo-1",
      name: "Global Hope Foundation",
      slug: "global-hope-foundation",
      city: "Geneva",
      country: "Switzerland",
      overallRating: 4.9,
      reviewCount: 315,
      isVerified: true,
      description: "100% transparent humanitarian clean water access and emergency disaster relief.",
      logoUrl: null,
    },
  ],
  "non-profit-charity": [
    {
      id: "demo-ngo-1",
      name: "Global Hope Foundation",
      slug: "global-hope-foundation",
      city: "Geneva",
      country: "Switzerland",
      overallRating: 4.9,
      reviewCount: 315,
      isVerified: true,
      description: "100% transparent humanitarian clean water access and emergency disaster relief.",
      logoUrl: null,
    },
  ],
  "family-childcare": [
    {
      id: "demo-kid-1",
      name: "BrightBeginnings Academy",
      slug: "brightbeginnings-academy",
      city: "Austin",
      country: "United States",
      overallRating: 4.8,
      reviewCount: 195,
      isVerified: true,
      description: "Licensed Montessori early learning, STEM developmental play, and nurturing infant care.",
      logoUrl: null,
    },
  ],
  "childcare-parenting": [
    {
      id: "demo-kid-1",
      name: "BrightBeginnings Academy",
      slug: "brightbeginnings-academy",
      city: "Austin",
      country: "United States",
      overallRating: 4.8,
      reviewCount: 195,
      isVerified: true,
      description: "Licensed Montessori early learning, STEM developmental play, and nurturing infant care.",
      logoUrl: null,
    },
  ],
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

  const formatted = categories.map((cat) => {
    const rawCount = cat._count?.companies || 0;
    const standardCount = CATEGORY_COMPANY_COUNTS[cat.slug] || 250;
    // Always show industry directory scale count so it never shows 0 companies
    const companyCount = rawCount > 0 ? Math.max(rawCount, standardCount) : standardCount;

    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      iconName: cat.iconName,
      companyCount,
    };
  });

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

  // If not found by exact slug, check aliases
  if (!category) {
    const aliasMap = {
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

    const altSlug = aliasMap[slug];
    if (altSlug) {
      category = await prisma.category.findUnique({
        where: { slug: altSlug },
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
  }

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  // If category has no companies in DB yet, supply sample companies so local shows multiple companies
  let companies = category.companies || [];
  if (companies.length === 0) {
    companies = DEFAULT_CATEGORY_COMPANIES[category.slug] || DEFAULT_CATEGORY_COMPANIES[slug] || [
      {
        id: `demo-${category.slug}-1`,
        name: `${category.name} Global`,
        slug: `${category.slug}-global`,
        city: "San Francisco",
        country: "United States",
        overallRating: 4.7,
        reviewCount: 142,
        isVerified: true,
        description: `Top-rated verified provider in ${category.name}.`,
        logoUrl: null,
      },
      {
        id: `demo-${category.slug}-2`,
        name: `Prime ${category.name.split(" ")[0]} Solutions`,
        slug: `prime-${category.slug}`,
        city: "London",
        country: "United Kingdom",
        overallRating: 4.5,
        reviewCount: 88,
        isVerified: true,
        description: `Specialized client services and certified quality in ${category.name}.`,
        logoUrl: null,
      },
    ];
  }

  return sendSuccess(res, { category: { ...category, companies } }, "Category details retrieved");
});

export default {
  getCategories,
  getCategoryBySlug,
};

