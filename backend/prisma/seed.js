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

  const marcusUser = await prisma.user.upsert({
    where: { email: "marcus.vance@example.com" },
    update: {},
    create: {
      email: "marcus.vance@example.com",
      passwordHash,
      firstName: "Marcus",
      lastName: "Vance",
      role: "USER",
      isVerified: true,
    },
  });

  const elenaUser = await prisma.user.upsert({
    where: { email: "elena.rostova@example.com" },
    update: {},
    create: {
      email: "elena.rostova@example.com",
      passwordHash,
      firstName: "Elena",
      lastName: "Rostova",
      role: "USER",
      isVerified: true,
    },
  });

  const davidUser = await prisma.user.upsert({
    where: { email: "david.chen@example.com" },
    update: {},
    create: {
      email: "david.chen@example.com",
      passwordHash,
      firstName: "David",
      lastName: "Chen",
      role: "USER",
      isVerified: true,
    },
  });

  const sophiaUser = await prisma.user.upsert({
    where: { email: "sophia.mansoor@example.com" },
    update: {},
    create: {
      email: "sophia.mansoor@example.com",
      passwordHash,
      firstName: "Sophia",
      lastName: "Al-Mansoor",
      role: "USER",
      isVerified: true,
    },
  });

  const cloudScaleRep = await prisma.user.upsert({
    where: { email: "rep@cloudscale.example" },
    update: {},
    create: {
      email: "rep@cloudscale.example",
      passwordHash,
      firstName: "CloudScale",
      lastName: "Support",
      role: "BUSINESS",
      isVerified: true,
    },
  });

  const finovaRep = await prisma.user.upsert({
    where: { email: "rep@finova.example" },
    update: {},
    create: {
      email: "rep@finova.example",
      passwordHash,
      firstName: "Finova",
      lastName: "Operations",
      role: "BUSINESS",
      isVerified: true,
    },
  });

  console.log("✅ Seeded demo users.");

  // 3. Create Sample Companies
  const companies = [
    {
      name: "CloudScale Hosting",
      slug: "cloudscale-hosting",
      description: "Enterprise cloud infrastructure, Kubernetes clusters, and zero-downtime migrations.",
      websiteUrl: "https://cloudscale.example",
      categoryId: createdCategories["technology"]?.id,
      isClaimed: false,
      isVerified: false,
      overallRating: 4.9,
      reviewCount: 42,
      star5Count: 38,
      star4Count: 4,
      star3Count: 0,
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
      overallRating: 4.4,
      reviewCount: 28,
      star5Count: 18,
      star4Count: 8,
      star3Count: 1,
      star2Count: 1,
      star1Count: 0,
    },
    {
      name: "Apex Logistics & Freight",
      slug: "apex-logistics",
      description: "Global freight forwarding, time-critical logistics, temperature-controlled transport, and end-to-end supply chain telemetry.",
      websiteUrl: "https://apexlogistics.example",
      categoryId: createdCategories["logistics-shipping"]?.id || createdCategories["services"]?.id,
      isClaimed: false,
      isVerified: false,
      overallRating: 4.8,
      reviewCount: 35,
      star5Count: 30,
      star4Count: 4,
      star3Count: 1,
      star2Count: 0,
      star1Count: 0,
    },
    {
      name: "Stripe",
      slug: "stripe",
      description: "Financial infrastructure and payment processing for the internet.",
      websiteUrl: "https://stripe.com",
      categoryId: createdCategories["banking-finance"]?.id,
      isClaimed: false,
      isVerified: false,
      overallRating: 4.8,
      reviewCount: 64,
      star5Count: 55,
      star4Count: 7,
      star3Count: 2,
      star2Count: 0,
      star1Count: 0,
    },
  ];

  const seededCompanies = {};
  for (const comp of companies) {
    const companyRecord = await prisma.company.upsert({
      where: { slug: comp.slug },
      update: comp,
      create: comp,
    });
    seededCompanies[comp.slug] = companyRecord;
  }

  const liamUser = await prisma.user.upsert({
    where: { email: "liam.foster@example.com" },
    update: {},
    create: {
      email: "liam.foster@example.com",
      passwordHash,
      firstName: "Liam",
      lastName: "Foster",
      role: "USER",
      isVerified: true,
    },
  });

  const chloeUser = await prisma.user.upsert({
    where: { email: "chloe.bennett@example.com" },
    update: {},
    create: {
      email: "chloe.bennett@example.com",
      passwordHash,
      firstName: "Chloe",
      lastName: "Bennett",
      role: "USER",
      isVerified: true,
    },
  });

  // 4. Seed Verified Reviews & Company Responses
  const reviewsData = [
    {
      companySlug: "cloudscale-hosting",
      user: marcusUser,
      rating: 5,
      title: "Phenomenal zero-downtime migration and rapid support",
      content: "Migrated over 40 client websites with zero hiccups. When we needed help with custom SSL certificates, their support engineer answered within 4 minutes on live chat.",
      helpfulCount: 18,
      response: {
        responder: cloudScaleRep,
        content: "Thank you Marcus! We take great pride in our 24/7 technical engineering team and automated zero-downtime migration pipelines. We are excited to support your continued growth.",
      },
    },
    {
      companySlug: "finova-banking",
      user: elenaUser,
      rating: 4,
      title: "Clean mobile UI, fast international wire transfers",
      content: "Been using Finova for business cross-border payments. The exchange rates are transparent with no hidden margins. Account verification took less than 24 hours.",
      helpfulCount: 9,
      response: {
        responder: finovaRep,
        content: "Thank you Elena for the insightful feedback! We've just expanded our direct SEPA and SWIFT corridors to bring settlement speeds down to under an hour.",
      },
    },
    {
      companySlug: "apex-logistics",
      user: davidUser,
      rating: 5,
      title: "Delivered sensitive freight across country on time",
      content: "Real-time GPS telemetry and proactive dispatchers kept us updated at every checkpoint. No damages and arrived 3 hours ahead of scheduled delivery window.",
      helpfulCount: 14,
      response: null,
    },
    {
      companySlug: "stripe",
      user: sophiaUser,
      rating: 5,
      title: "Developer-first payments API that just works at scale",
      content: "Integrated Stripe Checkout and recurring subscription billing in under two days. The webhook reliability and automated sales tax calculation saved our engineering team months of custom work.",
      helpfulCount: 27,
      response: null,
    },
    {
      companySlug: "cloudscale-hosting",
      user: liamUser,
      rating: 5,
      title: "Rock-solid 99.99% infrastructure uptime for SaaS workloads",
      content: "We have been hosting our multi-tenant SaaS application on CloudScale for 14 months. Dedicated VPC networking, auto-scaling, and NVMe block storage have exceeded all performance benchmarks.",
      helpfulCount: 21,
      response: null,
    },
    {
      companySlug: "stripe",
      user: chloeUser,
      rating: 5,
      title: "Effortless global currency conversions and fraud prevention",
      content: "Stripe Radar intercepted several suspicious card testing attempts before they caused chargebacks. The automated currency conversions allow us to bill international clients seamlessly.",
      helpfulCount: 16,
      response: null,
    },
  ];

  for (const r of reviewsData) {
    const company = seededCompanies[r.companySlug];
    if (!company) continue;

    // Check if review with this title & company already exists
    let review = await prisma.review.findFirst({
      where: { companyId: company.id, userId: r.user.id, title: r.title },
    });

    if (!review) {
      review = await prisma.review.create({
        data: {
          companyId: company.id,
          userId: r.user.id,
          rating: r.rating,
          title: r.title,
          content: r.content,
          status: "PUBLISHED",
          verificationStatus: "VERIFIED",
          helpfulCount: r.helpfulCount,
        },
      });
    }

    if (r.response) {
      const existingResp = await prisma.companyResponse.findUnique({
        where: { reviewId: review.id },
      });
      if (!existingResp) {
        await prisma.companyResponse.create({
          data: {
            reviewId: review.id,
            responderId: r.response.responder.id,
            content: r.response.content,
          },
        });
      }
    }
  console.log("✅ Seeded sample companies, authentic reviews, and company responses.");

  // Seed Blog Categories and Posts into DB
  const { seedBlogs } = await import("./seed_blogs.js");
  await seedBlogs();
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
