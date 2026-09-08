import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Create Comprehensive Categories
  const categories = [
    {
      name: "Software & Technology",
      slug: "technology",
      description: "Cloud infrastructure, SaaS platforms, developer tools, AI software, mobile apps, and IT solutions.",
      iconName: "Laptop",
    },
    {
      name: "Banking & Financial Services",
      slug: "banking-finance",
      description: "Digital banks, payment processors, investment platforms, loans, credit cards, and wealth management.",
      iconName: "CreditCard",
    },
    {
      name: "E-Commerce & Online Shopping",
      slug: "e-commerce",
      description: "Online stores, marketplace platforms, retail fashion, consumer electronics, and direct-to-consumer brands.",
      iconName: "ShoppingBag",
    },
    {
      name: "Insurance & Protection",
      slug: "insurance",
      description: "Health insurance, vehicle insurance, life coverage, business liability, homeowners, and warranty plans.",
      iconName: "ShieldCheck",
    },
    {
      name: "Travel, Airlines & Hospitality",
      slug: "travel-hospitality",
      description: "Airlines, hotel booking platforms, vacation rentals, car rentals, cruise lines, and tour operators.",
      iconName: "Plane",
    },
    {
      name: "Healthcare & Medical Services",
      slug: "healthcare",
      description: "Hospitals, medical clinics, telehealth providers, dental care, pharmacies, and diagnostic labs.",
      iconName: "HeartPulse",
    },
    {
      name: "Automotive, Vehicles & Transport",
      slug: "automotive-vehicles",
      description: "Car dealerships, auto repair centers, electric vehicles, vehicle rentals, tires, and transport services.",
      iconName: "Car",
    },
    {
      name: "Restaurants, Food & Dining",
      slug: "food-beverages",
      description: "Restaurants, fast food chains, food delivery services, coffee shops, bakeries, and grocery delivery.",
      iconName: "Utensils",
    },
    {
      name: "Education, Courses & Learning",
      slug: "education-training",
      description: "Universities, online academies, coding bootcamps, language schools, certification, and tutoring.",
      iconName: "GraduationCap",
    },
    {
      name: "Real Estate & Housing",
      slug: "real-estate",
      description: "Real estate brokerages, property management, apartment rentals, home builders, and mortgage lenders.",
      iconName: "Home",
    },
    {
      name: "Home Improvement & Trades",
      slug: "home-improvement",
      description: "Contractors, plumbers, electricians, roofing, HVAC, interior design, gardening, and home repair.",
      iconName: "Wrench",
    },
    {
      name: "Home & Professional Services",
      slug: "services",
      description: "Contractors, plumbing, legal consulting, logistics, and repair.",
      iconName: "Wrench",
    },
    {
      name: "Beauty, Wellness & Personal Care",
      slug: "beauty-wellness",
      description: "Cosmetics, hair salons, day spas, skincare clinics, grooming, and organic personal care products.",
      iconName: "Sparkles",
    },
    {
      name: "Fitness, Gyms & Athletics",
      slug: "fitness-sports",
      description: "Gyms, health clubs, personal fitness trainers, sports equipment, athletic apparel, and outdoor gear.",
      iconName: "Dumbbell",
    },
    {
      name: "Legal, Law & Compliance",
      slug: "legal-services",
      description: "Law firms, attorneys, business legal advisors, intellectual property, notary, and dispute mediation.",
      iconName: "Scale",
    },
    {
      name: "Marketing, Advertising & Media",
      slug: "marketing-advertising",
      description: "Digital marketing agencies, SEO consultants, PR firms, creative branding, and video production.",
      iconName: "Megaphone",
    },
    {
      name: "Telecommunications & Mobile",
      slug: "telecom-internet",
      description: "Mobile network operators, broadband internet providers, fiber services, satellite, and telecom hardware.",
      iconName: "Wifi",
    },
    {
      name: "Utilities, Energy & Green Power",
      slug: "energy-utilities",
      description: "Solar panel installers, clean electricity providers, renewable energy, natural gas, and water utilities.",
      iconName: "Zap",
    },
    {
      name: "Entertainment, Gaming & Streaming",
      slug: "entertainment-gaming",
      description: "Streaming media services, video game publishers, esports, cinemas, music, and live event ticketing.",
      iconName: "Film",
    },
    {
      name: "Animals & Pet Care",
      slug: "pets-animals",
      description: "Veterinary hospitals, pet food suppliers, pet boarding, grooming, dog training, and animal clinics.",
      iconName: "Dog",
    },
    {
      name: "Logistics, Shipping & Freight",
      slug: "logistics-shipping",
      description: "Parcel courier delivery, freight forwarding, international moving, supply chain, and storage units.",
      iconName: "Truck",
    },
    {
      name: "Events, Parties & Weddings",
      slug: "events-weddings",
      description: "Event venues, wedding planners, catering companies, event photographers, party rentals, and DJs.",
      iconName: "PartyPopper",
    },
    {
      name: "Manufacturing & Industrial Supplies",
      slug: "industrial-manufacturing",
      description: "Industrial equipment, B2B wholesale manufacturers, raw materials, safety tools, and custom fabrication.",
      iconName: "Factory",
    },
    {
      name: "Non-Profit, Charities & Community",
      slug: "non-profit-charities",
      description: "Charitable foundations, humanitarian aid, community centers, environmental initiatives, and social causes.",
      iconName: "Heart",
    },
    {
      name: "Family, Childcare & Baby",
      slug: "family-childcare",
      description: "Daycare centers, baby gear, parenting resources, preschools, pediatric care, and educational toys.",
      iconName: "Baby",
    },
  ];

  const createdCategories = {};
  for (const cat of categories) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    createdCategories[cat.slug] = record;
  }
  console.log(`✅ Seeded ${Object.keys(createdCategories).length} categories.`);

  // 2. Create Demo Admin and Users
  const passwordHash = await bcrypt.hash("Admin@123456", 12);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@complaint-review.com" },
    update: {},
    create: {
      email: "admin@complaint-review.com",
      passwordHash,
      firstName: "Platform",
      lastName: "Administrator",
      role: "ADMIN",
      isVerified: true,
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@complaint-review.com" },
    update: {},
    create: {
      email: "demo@complaint-review.com",
      passwordHash,
      firstName: "Marcus",
      lastName: "Vance",
      role: "USER",
      isVerified: true,
    },
  });
  console.log("✅ Seeded demo users.");

  // 3. Create Sample Companies
  const companies = [
    {
      name: "Stripe",
      slug: "stripe",
      description: "Financial infrastructure and payment processing for the internet.",
      websiteUrl: "https://stripe.com",
      categoryId: createdCategories["banking-finance"]?.id,
      isClaimed: true,
      isVerified: true,
      overallRating: 4.8,
      reviewCount: 24,
      star5Count: 20,
      star4Count: 3,
      star3Count: 1,
      star2Count: 0,
      star1Count: 0,
    },
    {
      name: "CloudScale Hosting",
      slug: "cloudscale-hosting",
      description: "Enterprise cloud infrastructure, Kubernetes clusters, and zero-downtime migrations.",
      websiteUrl: "https://cloudscale.example",
      categoryId: createdCategories["technology"]?.id,
      isClaimed: true,
      isVerified: true,
      overallRating: 4.7,
      reviewCount: 18,
      star5Count: 14,
      star4Count: 3,
      star3Count: 1,
      star2Count: 0,
      star1Count: 0,
    },
    {
      name: "Finova Digital Banking",
      slug: "finova-banking",
      description: "Border-free digital business accounts and transparent currency exchanges.",
      websiteUrl: "https://finova.example",
      categoryId: createdCategories["banking-finance"]?.id,
      isClaimed: false,
      isVerified: false,
      overallRating: 4.2,
      reviewCount: 9,
      star5Count: 5,
      star4Count: 3,
      star3Count: 0,
      star2Count: 1,
      star1Count: 0,
    },
  ];

  for (const comp of companies) {
    const companyRecord = await prisma.company.upsert({
      where: { slug: comp.slug },
      update: comp,
      create: comp,
    });

    // Create a sample review for this company
    const existingReview = await prisma.review.findFirst({
      where: { companyId: companyRecord.id, userId: demoUser.id },
    });

    if (!existingReview) {
      await prisma.review.create({
        data: {
          companyId: companyRecord.id,
          userId: demoUser.id,
          rating: 5,
          title: `Exceptional service from ${companyRecord.name}`,
          content: `We have been using ${companyRecord.name} for our production workloads. The support team responds in minutes and reliability has been 100%. Highly recommended!`,
          status: "PUBLISHED",
          verificationStatus: "VERIFIED",
          helpfulCount: 12,
        },
      });
    }
  }

  console.log("✅ Seeded sample companies and reviews.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
