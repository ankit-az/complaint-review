import { prisma } from "../src/config/db.js";

const BLOG_CATEGORIES_DATA = [
  {
    slug: "trends-in-trust",
    name: "Trends in Trust",
    description: "Insights, industry trends, and analysis on how online trust, consumer behavior, and verification are evolving.",
  },
  {
    slug: "reviews-matter",
    name: "Reviews Matter",
    description: "Why authentic customer reviews shape modern commerce, empower buyers, and help ethical businesses grow.",
  },
  {
    slug: "buy-with-confidence",
    name: "Buy With Confidence",
    description: "Actionable consumer guides, scam prevention checklists, and research tips to help you make smarter purchase decisions.",
  },
  {
    slug: "trust-stories",
    name: "Trust Stories",
    description: "Real accounts of consumers and companies uniting to resolve complaints, rebuild reputations, and build lasting loyalty.",
  },
];

const BLOG_POSTS_DATA = [
  // Trends in Trust
  {
    slug: "ai-fraud-detection-evolution-2026",
    title: "How AI and Behavioral Telemetry Are Redefining Review Verification in 2026",
    excerpt: "With the surge of generative AI text tools, fake reviews have evolved. Here is how modern multi-point telemetry detects coordinated astroturfing campaigns.",
    categorySlug: "trends-in-trust",
    categoryName: "Trends in Trust",
    authorName: "Marcus Vance",
    authorRole: "Head of Trust & Safety",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    readTime: "6 min read",
    date: "Sep 8, 2026",
    featured: true,
    imageUrl: "https://res.cloudinary.com/ankityoutubeclone/image/upload/v1789032003/complaint-review/Blog/ai-verification.jpg",
    content: `Online consumer feedback is entering a new era. What used to be simple star-ratings has developed into a complex ecosystem where data integrity, verified identities, and automated proof of transaction determine which businesses thrive and which struggle with skepticism.
    
With the rapid proliferation of generative text tools, fraudulent agencies can produce thousands of superficially convincing reviews in seconds. Traditional sentiment analysis algorithms are no longer sufficient to identify coordinated astroturfing campaigns.
    
Instead, modern platforms rely on behavioral telemetry, cryptographic purchase verification, and strict legal boundaries that prevent merchants from censoring legitimate customer grievances. True consumer trust isn't built on a perfect score—it is built on transparent, accountable problem resolution when things inevitably go wrong.`,
  },
  {
    slug: "cryptographic-purchase-badges-audit",
    title: "Understanding Verified Buyer Badges: How Modern Platforms Audit Proof of Purchase",
    excerpt: "A deep dive into cryptographically signed receipt audits, order ID hashes, and why verified badges boost consumer confidence by 74%.",
    categorySlug: "trends-in-trust",
    categoryName: "Trends in Trust",
    authorName: "Marcus Vance",
    authorRole: "Head of Trust & Safety",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    readTime: "5 min read",
    date: "Aug 28, 2026",
    featured: false,
    imageUrl: "https://res.cloudinary.com/ankityoutubeclone/image/upload/v1789032005/complaint-review/Blog/verified-buyer.jpg",
    content: `Consumer skepticism is at an all-time high. Shoppers want to know whether a reviewer actually spent their hard-earned money or was paid to write high praise.
    
Verified buyer badges provide the answer. By auditing transaction confirmations, booking receipts, and payment references before a review is flagged as verified, platforms protect the integrity of the collective score.`,
  },
  {
    slug: "the-death-of-pay-to-delete-directories",
    title: "The Death of Pay-to-Delete: Why Modern Consumers Reject Closed Review Gates",
    excerpt: "Legacy review portals that let brands pay to suppress negative feedback are losing market share to radical transparency directories.",
    categorySlug: "trends-in-trust",
    categoryName: "Trends in Trust",
    authorName: "Sarah Jenkins",
    authorRole: "Senior Policy Editor",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    readTime: "4 min read",
    date: "Aug 15, 2026",
    featured: false,
    imageUrl: "https://res.cloudinary.com/ankityoutubeclone/image/upload/v1789032009/complaint-review/Blog/pay-to-delete.jpg",
    content: `For years, certain business review directories sold subscriptions allowing companies to hide or push down 1-star complaints. Today, regulatory scrutiny from the FTC and savvy consumer expectations have made pay-to-delete models unacceptable.`,
  },

  // Reviews Matter
  {
    slug: "why-negative-reviews-drive-higher-conversions",
    title: "Why Negative Reviews Are Actually Essential for Business Growth & Conversions",
    excerpt: "A flawless 5.0 score looks suspiciously fake. Studies reveal that conversion rates peak when businesses hold an authentic 4.2 to 4.8 star average.",
    categorySlug: "reviews-matter",
    categoryName: "Reviews Matter",
    authorName: "Elena Rostova",
    authorRole: "Consumer Insights Lead",
    authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    readTime: "5 min read",
    date: "Sep 5, 2026",
    featured: true,
    imageUrl: "https://res.cloudinary.com/ankityoutubeclone/image/upload/v1789032066/complaint-review/Blog/negative-reviews.jpg",
    content: `When shoppers see only glowing 5-star reviews with no critique whatsoever, cognitive alarm bells ring. Modern consumers seek honesty, not perfection.
    
When a company receives a 2-star or 3-star review and publicly responds within 24 hours with an actionable solution, prospective buyers see a reliable team that stands behind their product.`,
  },
  {
    slug: "how-to-write-constructive-helpful-reviews",
    title: "How to Write a Helpful Review That Actually Gets Issues Resolved",
    excerpt: "Vague emotional complaints are easy to dismiss. Learn the proven framework for writing detailed, factual reviews that prompt fast resolution.",
    categorySlug: "reviews-matter",
    categoryName: "Reviews Matter",
    authorName: "Elena Rostova",
    authorRole: "Consumer Insights Lead",
    authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    readTime: "4 min read",
    date: "Aug 20, 2026",
    featured: false,
    imageUrl: "https://res.cloudinary.com/ankityoutubeclone/image/upload/v1789032023/complaint-review/Blog/constructive-feedback.jpg",
    content: `An effective review outlines what was ordered, specific timeline milestones, the exact failure point, and the outcome desired. When merchants see clarity rather than abusive language, escalation channels activate immediately.`,
  },
  {
    slug: "psychology-of-leaving-feedback",
    title: "The Psychology of Leaving Feedback: What Motivates Millions of Daily Reviewers",
    excerpt: "Insights from over 150,000 consumer interactions explaining the altruistic and community-driven drivers of modern review culture.",
    categorySlug: "reviews-matter",
    categoryName: "Reviews Matter",
    authorName: "Elena Rostova",
    authorRole: "Consumer Insights Lead",
    authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    readTime: "7 min read",
    date: "Aug 10, 2026",
    featured: false,
    imageUrl: "https://res.cloudinary.com/ankityoutubeclone/image/upload/v1789032030/complaint-review/Blog/review-psychology.jpg",
    content: `Most people write reviews not out of malice, but to protect fellow community members from poor service or reward small businesses that exceeded expectations.`,
  },

  // Buy With Confidence
  {
    slug: "five-red-flags-online-shopping-scams",
    title: "5 Critical Red Flags to Spot Online Shopping Scams Before Entering Card Details",
    excerpt: "From brand-new WHOIS domains to suspiciously cheap luxury goods, protect your money with these proven buyer verification techniques.",
    categorySlug: "buy-with-confidence",
    categoryName: "Buy With Confidence",
    authorName: "David Kim",
    authorRole: "E-Commerce Fraud Investigator",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    readTime: "5 min read",
    date: "Sep 2, 2026",
    featured: true,
    imageUrl: "https://res.cloudinary.com/ankityoutubeclone/image/upload/v1789032034/complaint-review/Blog/shopping-scams.jpg",
    content: `Every holiday shopping season brings thousands of counterfeit storefronts. Always check independent reviews on Complaint-Review, verify SSL certificates, inspect contact telephone numbers, and cross-reference return policies before entering card data.`,
  },
  {
    slug: "the-consumer-guide-to-chargebacks-disputes",
    title: "The Consumer Guide to Credit Card Chargebacks and Dispute Windows",
    excerpt: "What to do when an unresponsive merchant ignores your refund requests: legal timelines, evidence gathering, and bank dispute steps.",
    categorySlug: "buy-with-confidence",
    categoryName: "Buy With Confidence",
    authorName: "David Kim",
    authorRole: "E-Commerce Fraud Investigator",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    readTime: "6 min read",
    date: "Aug 26, 2026",
    featured: false,
    imageUrl: "https://res.cloudinary.com/ankityoutubeclone/image/upload/v1789032039/complaint-review/Blog/chargebacks-guide.jpg",
    content: `Under federal consumer protection standards, buyers have rights against merchants who deliver damaged goods or refuse to fulfill agreed contracts. Here is how to gather your audit trail.`,
  },
  {
    slug: "how-to-verify-dropshipping-stores",
    title: "How to Spot Dropshipping Stores Charging 400% Markups for Budget Goods",
    excerpt: "Techniques for reverse image searching and supplier checks to avoid paying luxury prices for cheap overseas re-shipped items.",
    categorySlug: "buy-with-confidence",
    categoryName: "Buy With Confidence",
    authorName: "David Kim",
    authorRole: "E-Commerce Fraud Investigator",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    readTime: "4 min read",
    date: "Aug 12, 2026",
    featured: false,
    imageUrl: "https://res.cloudinary.com/ankityoutubeclone/image/upload/v1789032045/complaint-review/Blog/dropshipping-checks.jpg",
    content: `Many viral social media advertisements lead to dropshipping websites with multi-week delivery delays. Learn how to verify seller authenticity before purchasing.`,
  },

  // Trust Stories
  {
    slug: "how-one-local-business-turned-shipping-crisis-into-loyal-advocates",
    title: "How an Indie Brand Turned a Catastrophic Supply Delay into 500+ Loyal Advocates",
    excerpt: "When blizzard shutdowns disrupted seasonal deliveries, this founder's transparent public response on Complaint-Review set a gold standard.",
    categorySlug: "trust-stories",
    categoryName: "Trust Stories",
    authorName: "Sarah Jenkins",
    authorRole: "Community Editor",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    readTime: "7 min read",
    date: "Aug 31, 2026",
    featured: true,
    imageUrl: "https://res.cloudinary.com/ankityoutubeclone/image/upload/v1789032051/complaint-review/Blog/shipping-crisis-turnaround.jpg",
    content: `When a freak winter storm paralyzed national logistics, hundreds of customers faced missing holiday orders. Instead of blaming couriers or dodging calls, the founder logged into their Complaint-Review portal and responded to every review personally with full refunds and handwritten apology vouchers.`,
  },
  {
    slug: "from-one-star-to-five-star-tech-support-turnaround",
    title: "From 1-Star to 5-Star: The Inside Story of a Cloud SaaS Company's Support Overhaul",
    excerpt: "How a software company leveraged consumer complaint themes on our directory to rebuild their onboarding and cut refund requests by 82%.",
    categorySlug: "trust-stories",
    categoryName: "Trust Stories",
    authorName: "Sarah Jenkins",
    authorRole: "Community Editor",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    readTime: "6 min read",
    date: "Aug 22, 2026",
    featured: false,
    imageUrl: "https://res.cloudinary.com/ankityoutubeclone/image/upload/v1789032068/complaint-review/Blog/support-overhaul.jpg",
    content: `Listening to candid customer complaints is the most valuable product roadmap an engineering team can ask for. Here is how one tech company turned frustration into praise.`,
  },
  {
    slug: "consumer-triumph-resolving-car-warranty-dispute",
    title: "Consumer Triumph: How One Customer's Documented Review Unlocked a $4,500 Warranty Payout",
    excerpt: "When an auto dealer claimed normal wear and tear on a defective transmission, evidence posted on Complaint-Review prompted corporate intervention.",
    categorySlug: "trust-stories",
    categoryName: "Trust Stories",
    authorName: "Sarah Jenkins",
    authorRole: "Community Editor",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    readTime: "5 min read",
    date: "Aug 05, 2026",
    featured: false,
    imageUrl: "https://res.cloudinary.com/ankityoutubeclone/image/upload/v1789032070/complaint-review/Blog/warranty-dispute.jpg",
    content: `Documentation and polite public visibility are the ultimate equalizers for consumers facing corporate stonewalling.`,
  },
];

export async function seedBlogs() {
  console.log("Seeding Blog Categories and Posts into PostgreSQL...");

  const categoryIdMap = {};

  // 1. Upsert Categories
  for (const cat of BLOG_CATEGORIES_DATA) {
    const savedCat = await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
      },
      create: {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
      },
    });
    categoryIdMap[cat.slug] = savedCat.id;
    console.log(`Saved Blog Category: ${savedCat.name} (${savedCat.id})`);
  }

  // 2. Upsert Posts
  for (const post of BLOG_POSTS_DATA) {
    const categoryId = categoryIdMap[post.categorySlug];
    if (!categoryId) {
      console.warn(`Category not found for slug: ${post.categorySlug}`);
      continue;
    }

    const savedPost = await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        categoryId,
        categorySlug: post.categorySlug,
        categoryName: post.categoryName,
        authorName: post.authorName,
        authorRole: post.authorRole,
        authorAvatar: post.authorAvatar,
        readTime: post.readTime,
        date: post.date,
        featured: post.featured,
        imageUrl: post.imageUrl,
      },
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        categoryId,
        categorySlug: post.categorySlug,
        categoryName: post.categoryName,
        authorName: post.authorName,
        authorRole: post.authorRole,
        authorAvatar: post.authorAvatar,
        readTime: post.readTime,
        date: post.date,
        featured: post.featured,
        imageUrl: post.imageUrl,
      },
    });
    console.log(`Saved Blog Post: ${savedPost.title} (${savedPost.slug})`);
  }

  const catCount = await prisma.blogCategory.count();
  const postCount = await prisma.blogPost.count();
  console.log(`Successfully seeded ${catCount} Blog Categories and ${postCount} Blog Posts into DB!`);
}

// Run if called directly
if (process.argv[1]?.endsWith("seed_blogs.js")) {
  seedBlogs()
    .catch((err) => {
      console.error("Failed to seed blogs:", err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
