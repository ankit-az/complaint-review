import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FAMOUS_COMPANIES = [
  // 1. Software & Technology
  {
    name: "Google",
    slug: "google",
    websiteUrl: "https://www.google.com",
    logoUrl: "https://unavatar.io/google.com",
    categorySlug: "technology",
    description: "Google is a global technology leader specializing in internet-related services and products, including search, cloud computing, software, and hardware.",
    city: "Mountain View, CA",
    country: "United States",
  },
  {
    name: "Apple",
    slug: "apple",
    websiteUrl: "https://www.apple.com",
    logoUrl: "https://unavatar.io/apple.com",
    categorySlug: "technology",
    description: "Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories, and sells a variety of related services.",
    city: "Cupertino, CA",
    country: "United States",
  },
  {
    name: "Microsoft",
    slug: "microsoft",
    websiteUrl: "https://www.microsoft.com",
    logoUrl: "https://unavatar.io/microsoft.com",
    categorySlug: "technology",
    description: "Microsoft develops and supports software, services, devices, and solutions that help people and businesses realize their full potential.",
    city: "Redmond, WA",
    country: "United States",
  },
  {
    name: "Meta",
    slug: "meta",
    websiteUrl: "https://about.meta.com",
    logoUrl: "https://unavatar.io/meta.com",
    categorySlug: "technology",
    description: "Meta builds technologies that help people connect, find communities, and grow businesses across Facebook, Instagram, Messenger, and WhatsApp.",
    city: "Menlo Park, CA",
    country: "United States",
  },
  {
    name: "Adobe",
    slug: "adobe",
    websiteUrl: "https://www.adobe.com",
    logoUrl: "https://unavatar.io/adobe.com",
    categorySlug: "technology",
    description: "Adobe is the global leader in digital media and digital marketing solutions, powering creative software including Photoshop, Illustrator, and Acrobat.",
    city: "San Jose, CA",
    country: "United States",
  },
  {
    name: "OpenAI",
    slug: "openai",
    websiteUrl: "https://openai.com",
    logoUrl: "https://unavatar.io/openai.com",
    categorySlug: "technology",
    description: "OpenAI is an artificial intelligence research laboratory creating safe, broadly beneficial artificial general intelligence and models like ChatGPT.",
    city: "San Francisco, CA",
    country: "United States",
  },
  {
    name: "GitHub",
    slug: "github",
    websiteUrl: "https://github.com",
    logoUrl: "https://unavatar.io/github.com",
    categorySlug: "technology",
    description: "GitHub is the world's leading developer platform for software development, version control using Git, open-source collaboration, and CI/CD.",
    city: "San Francisco, CA",
    country: "United States",
  },
  {
    name: "NVIDIA",
    slug: "nvidia",
    websiteUrl: "https://www.nvidia.com",
    logoUrl: "https://unavatar.io/nvidia.com",
    categorySlug: "technology",
    description: "NVIDIA is the pioneer of GPU-accelerated computing and the global engine powering modern artificial intelligence, gaming, and data centers.",
    city: "Santa Clara, CA",
    country: "United States",
  },
  {
    name: "Samsung Electronics",
    slug: "samsung",
    websiteUrl: "https://www.samsung.com",
    logoUrl: "https://unavatar.io/samsung.com",
    categorySlug: "technology",
    description: "Samsung is a global innovator in consumer electronics, semiconductors, mobile smartphones, display panels, and home appliances.",
    city: "Suwon",
    country: "South Korea",
  },
  {
    name: "Intel",
    slug: "intel",
    websiteUrl: "https://www.intel.com",
    logoUrl: "https://unavatar.io/intel.com",
    categorySlug: "technology",
    description: "Intel is an industry leader creating world-changing semiconductor technology that enables global progress and enriches lives.",
    city: "Santa Clara, CA",
    country: "United States",
  },

  // 2. E-Commerce & Retail
  {
    name: "Amazon",
    slug: "amazon",
    websiteUrl: "https://www.amazon.com",
    logoUrl: "https://unavatar.io/amazon.com",
    categorySlug: "e-commerce",
    description: "Amazon is a multinational technology enterprise focusing on e-commerce, cloud computing (AWS), digital streaming, and artificial intelligence.",
    city: "Seattle, WA",
    country: "United States",
  },
  {
    name: "eBay",
    slug: "ebay",
    websiteUrl: "https://www.ebay.com",
    logoUrl: "https://unavatar.io/ebay.com",
    categorySlug: "e-commerce",
    description: "eBay is a global commerce leader that connects millions of buyers and sellers around the world through dynamic marketplace auctions and fixed-price sales.",
    city: "San Jose, CA",
    country: "United States",
  },
  {
    name: "Walmart",
    slug: "walmart",
    websiteUrl: "https://www.walmart.com",
    logoUrl: "https://unavatar.io/walmart.com",
    categorySlug: "e-commerce",
    description: "Walmart operates a chain of hypermarkets, discount department stores, and an expansive omni-channel e-commerce retail platform.",
    city: "Bentonville, AR",
    country: "United States",
  },
  {
    name: "Target",
    slug: "target",
    websiteUrl: "https://www.target.com",
    logoUrl: "https://unavatar.io/target.com",
    categorySlug: "e-commerce",
    description: "Target is a premier general merchandise retailer offering everyday essentials, clothing, electronics, and home decor across stores and digital shopping.",
    city: "Minneapolis, MN",
    country: "United States",
  },
  {
    name: "Shopify",
    slug: "shopify",
    websiteUrl: "https://www.shopify.com",
    logoUrl: "https://unavatar.io/shopify.com",
    categorySlug: "e-commerce",
    description: "Shopify provides essential internet infrastructure for commerce, empowering millions of merchants worldwide to start, grow, and manage online stores.",
    city: "Ottawa, ON",
    country: "Canada",
  },
  {
    name: "Etsy",
    slug: "etsy",
    websiteUrl: "https://www.etsy.com",
    logoUrl: "https://unavatar.io/etsy.com",
    categorySlug: "e-commerce",
    description: "Etsy is a global online marketplace where people come together to make, sell, buy, and collect unique handcrafted items and vintage treasures.",
    city: "Brooklyn, NY",
    country: "United States",
  },
  {
    name: "Best Buy",
    slug: "best-buy",
    websiteUrl: "https://www.bestbuy.com",
    logoUrl: "https://unavatar.io/bestbuy.com",
    categorySlug: "e-commerce",
    description: "Best Buy is a leading multi-channel retailer of technology products, consumer electronics, home office computing, and Geek Squad services.",
    city: "Richfield, MN",
    country: "United States",
  },
  {
    name: "IKEA",
    slug: "ikea",
    websiteUrl: "https://www.ikea.com",
    logoUrl: "https://unavatar.io/ikea.com",
    categorySlug: "home-improvement",
    description: "IKEA is a global home furnishing brand known for well-designed, functional, and affordable flat-pack furniture, homewares, and accessories.",
    city: "Delft",
    country: "Netherlands",
  },

  // 3. Banking & Financial Services
  {
    name: "PayPal",
    slug: "paypal",
    websiteUrl: "https://www.paypal.com",
    logoUrl: "https://unavatar.io/paypal.com",
    categorySlug: "banking-finance",
    description: "PayPal operates a worldwide online payments system that facilitates digital transactions, international money transfers, and electronic checkouts.",
    city: "San Jose, CA",
    country: "United States",
  },
  {
    name: "Wise",
    slug: "wise",
    websiteUrl: "https://wise.com",
    logoUrl: "https://unavatar.io/wise.com",
    categorySlug: "banking-finance",
    description: "Wise is a global financial technology company building the best way to move and manage money across borders with real exchange rates and low transparent fees.",
    city: "London",
    country: "United Kingdom",
  },
  {
    name: "Revolut",
    slug: "revolut",
    websiteUrl: "https://www.revolut.com",
    logoUrl: "https://unavatar.io/revolut.com",
    categorySlug: "banking-finance",
    description: "Revolut is a global financial superapp offering multi-currency digital banking accounts, currency exchange, commission-free stock investing, and cards.",
    city: "London",
    country: "United Kingdom",
  },
  {
    name: "JPMorgan Chase",
    slug: "jpmorgan-chase",
    websiteUrl: "https://www.jpmorganchase.com",
    logoUrl: "https://unavatar.io/jpmorganchase.com",
    categorySlug: "banking-finance",
    description: "JPMorgan Chase is one of the world's leading financial services firms offering consumer banking under the Chase brand, investment banking, and asset management.",
    city: "New York, NY",
    country: "United States",
  },
  {
    name: "Bank of America",
    slug: "bank-of-america",
    websiteUrl: "https://www.bankofamerica.com",
    logoUrl: "https://unavatar.io/bankofamerica.com",
    categorySlug: "banking-finance",
    description: "Bank of America is a premier global financial institution serving individuals, small businesses, and commercial enterprises with banking and wealth management.",
    city: "Charlotte, NC",
    country: "United States",
  },
  {
    name: "American Express",
    slug: "american-express",
    websiteUrl: "https://www.americanexpress.com",
    logoUrl: "https://unavatar.io/americanexpress.com",
    categorySlug: "banking-finance",
    description: "American Express is a globally integrated payments company providing credit cards, charge cards, travel services, and point-of-sale payment solutions.",
    city: "New York, NY",
    country: "United States",
  },
  {
    name: "Visa",
    slug: "visa",
    websiteUrl: "https://www.visa.com",
    logoUrl: "https://unavatar.io/visa.com",
    categorySlug: "banking-finance",
    description: "Visa connects consumers, businesses, banks, and governments through electronic payments across more than 200 countries and territories.",
    city: "San Francisco, CA",
    country: "United States",
  },
  {
    name: "Mastercard",
    slug: "mastercard",
    websiteUrl: "https://www.mastercard.com",
    logoUrl: "https://unavatar.io/mastercard.com",
    categorySlug: "banking-finance",
    description: "Mastercard is an international technology company in the global payments industry facilitating secure electronic transactions and payment solutions.",
    city: "Purchase, NY",
    country: "United States",
  },
  {
    name: "Coinbase",
    slug: "coinbase",
    websiteUrl: "https://www.coinbase.com",
    logoUrl: "https://unavatar.io/coinbase.com",
    categorySlug: "banking-finance",
    description: "Coinbase provides a secure, regulated platform for buying, selling, staking, and managing cryptocurrencies for consumers and institutional investors.",
    city: "San Francisco, CA",
    country: "United States",
  },

  // 4. Travel, Airlines & Hospitality
  {
    name: "Airbnb",
    slug: "airbnb",
    websiteUrl: "https://www.airbnb.com",
    logoUrl: "https://unavatar.io/airbnb.com",
    categorySlug: "travel-hospitality",
    description: "Airbnb operates an international community marketplace for unique accommodations, vacation homes, and authentic local experiences around the globe.",
    city: "San Francisco, CA",
    country: "United States",
  },
  {
    name: "Booking.com",
    slug: "booking-com",
    websiteUrl: "https://www.booking.com",
    logoUrl: "https://unavatar.io/booking.com",
    categorySlug: "travel-hospitality",
    description: "Booking.com connects millions of global travelers with hotel stays, apartment rentals, vacation homes, flights, and rental car reservations.",
    city: "Amsterdam",
    country: "Netherlands",
  },
  {
    name: "Expedia",
    slug: "expedia",
    websiteUrl: "https://www.expedia.com",
    logoUrl: "https://unavatar.io/expedia.com",
    categorySlug: "travel-hospitality",
    description: "Expedia is an online travel agency offering flight bookings, hotel reservations, car rentals, cruise lines, and comprehensive vacation packages.",
    city: "Seattle, WA",
    country: "United States",
  },
  {
    name: "Uber",
    slug: "uber",
    websiteUrl: "https://www.uber.com",
    logoUrl: "https://unavatar.io/uber.com",
    categorySlug: "travel-hospitality",
    description: "Uber transforms global mobility and logistics with on-demand ride-hailing, electric micromobility, food delivery (Uber Eats), and freight solutions.",
    city: "San Francisco, CA",
    country: "United States",
  },
  {
    name: "Delta Air Lines",
    slug: "delta-air-lines",
    websiteUrl: "https://www.delta.com",
    logoUrl: "https://unavatar.io/delta.com",
    categorySlug: "travel-hospitality",
    description: "Delta Air Lines is a legacy American airline operating a vast domestic and international flight network connecting millions of passengers annually.",
    city: "Atlanta, GA",
    country: "United States",
  },
  {
    name: "Marriott International",
    slug: "marriott",
    websiteUrl: "https://www.marriott.com",
    logoUrl: "https://unavatar.io/marriott.com",
    categorySlug: "travel-hospitality",
    description: "Marriott International is an iconic hospitality company with over 30 leading hotel brands and 8,000+ luxury and business travel destinations worldwide.",
    city: "Bethesda, MD",
    country: "United States",
  },

  // 5. Food, Dining & Delivery
  {
    name: "Starbucks",
    slug: "starbucks",
    websiteUrl: "https://www.starbucks.com",
    logoUrl: "https://unavatar.io/starbucks.com",
    categorySlug: "food-beverages",
    description: "Starbucks is the premier roaster and retailer of specialty handcrafted coffee, teas, and fresh food, operating tens of thousands of cafes worldwide.",
    city: "Seattle, WA",
    country: "United States",
  },
  {
    name: "DoorDash",
    slug: "doordash",
    websiteUrl: "https://www.doordash.com",
    logoUrl: "https://unavatar.io/doordash.com",
    categorySlug: "food-beverages",
    description: "DoorDash is a technology company connecting consumers with their favorite local restaurants, convenience stores, and grocery delivery.",
    city: "San Francisco, CA",
    country: "United States",
  },
  {
    name: "McDonald's",
    slug: "mcdonalds",
    websiteUrl: "https://www.mcdonalds.com",
    logoUrl: "https://unavatar.io/mcdonalds.com",
    categorySlug: "food-beverages",
    description: "McDonald's is the world's leading fast-food restaurant chain, serving burgers, fries, and breakfast to tens of millions of customers daily.",
    city: "Chicago, IL",
    country: "United States",
  },

  // 6. Fitness, Sports & Apparel
  {
    name: "Nike",
    slug: "nike",
    websiteUrl: "https://www.nike.com",
    logoUrl: "https://unavatar.io/nike.com",
    categorySlug: "fitness-sports",
    description: "Nike is the world's iconic designer and manufacturer of athletic footwear, sports apparel, equipment, and lifestyle sneaker fashion.",
    city: "Beaverton, OR",
    country: "United States",
  },
  {
    name: "Adidas",
    slug: "adidas",
    websiteUrl: "https://www.adidas.com",
    logoUrl: "https://unavatar.io/adidas.com",
    categorySlug: "fitness-sports",
    description: "Adidas is a global sporting goods leader delivering high-performance athletic apparel, football boots, running shoes, and street style fashion.",
    city: "Herzogenaurach",
    country: "Germany",
  },

  // 7. Automotive & Vehicles
  {
    name: "Tesla",
    slug: "tesla",
    websiteUrl: "https://www.tesla.com",
    logoUrl: "https://unavatar.io/tesla.com",
    categorySlug: "automotive-vehicles",
    description: "Tesla accelerates the world's transition to sustainable energy through cutting-edge electric cars, solar roof installations, and energy storage.",
    city: "Austin, TX",
    country: "United States",
  },
  {
    name: "BMW",
    slug: "bmw",
    websiteUrl: "https://www.bmw.com",
    logoUrl: "https://unavatar.io/bmw.com",
    categorySlug: "automotive-vehicles",
    description: "BMW is a German luxury automotive manufacturer celebrated for high-performance sedans, sports cars, luxury SUVs, and electric vehicles.",
    city: "Munich",
    country: "Germany",
  },
  {
    name: "Toyota",
    slug: "toyota",
    websiteUrl: "https://www.toyota.com",
    logoUrl: "https://unavatar.io/toyota.com",
    categorySlug: "automotive-vehicles",
    description: "Toyota is one of the world's largest automotive manufacturers, renowned for reliable sedans, hybrid powertrains, trucks, and SUVs.",
    city: "Toyota City",
    country: "Japan",
  },

  // 8. Entertainment & Media
  {
    name: "Netflix",
    slug: "netflix",
    websiteUrl: "https://www.netflix.com",
    logoUrl: "https://unavatar.io/netflix.com",
    categorySlug: "entertainment-gaming",
    description: "Netflix is the world's leading subscription video-on-demand service offering award-winning films, TV series, documentaries, and mobile games.",
    city: "Los Gatos, CA",
    country: "United States",
  },
  {
    name: "Spotify",
    slug: "spotify",
    websiteUrl: "https://www.spotify.com",
    logoUrl: "https://unavatar.io/spotify.com",
    categorySlug: "entertainment-gaming",
    description: "Spotify is the leading audio streaming platform giving users instant access to over 100 million songs, podcasts, and audiobooks.",
    city: "Stockholm",
    country: "Sweden",
  },
  {
    name: "Sony PlayStation",
    slug: "playstation",
    websiteUrl: "https://www.playstation.com",
    logoUrl: "https://unavatar.io/playstation.com",
    categorySlug: "entertainment-gaming",
    description: "Sony PlayStation is a premier video game and interactive entertainment brand renowned for console systems, PlayStation Network, and exclusive gaming franchises.",
    city: "San Mateo, CA",
    country: "United States",
  },
  {
    name: "The Walt Disney Company",
    slug: "disney",
    websiteUrl: "https://thewaltdisneycompany.com",
    logoUrl: "https://unavatar.io/thewaltdisneycompany.com",
    categorySlug: "entertainment-gaming",
    description: "The Walt Disney Company is a premier multinational mass media and entertainment family conglomerate behind Disney+, Pixar, Marvel, Star Wars, and theme parks.",
    city: "Burbank, CA",
    country: "United States",
  },
];

async function seedFamousCompanies() {
  console.log("🌟 Seeding famous unclaimed companies...");

  // Load all categories for slug lookup
  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));

  let createdCount = 0;
  let updatedCount = 0;

  for (const comp of FAMOUS_COMPANIES) {
    const categoryId = categoryMap.get(comp.categorySlug) || null;

    const existing = await prisma.company.findUnique({
      where: { slug: comp.slug },
    });

    if (existing) {
      // If it exists, ensure it is set properly if it was not claimed by a real user
      console.log(`⚠️ Company ${comp.name} (${comp.slug}) already exists. Skipping or updating details.`);
      await prisma.company.update({
        where: { slug: comp.slug },
        data: {
          name: comp.name,
          websiteUrl: comp.websiteUrl,
          logoUrl: comp.logoUrl,
          description: comp.description,
          city: comp.city,
          country: comp.country,
          categoryId: categoryId || existing.categoryId,
        },
      });
      updatedCount++;
    } else {
      await prisma.company.create({
        data: {
          name: comp.name,
          slug: comp.slug,
          websiteUrl: comp.websiteUrl,
          logoUrl: comp.logoUrl,
          description: comp.description,
          city: comp.city,
          country: comp.country,
          categoryId: categoryId,
          isClaimed: false,
          isVerified: false,
          overallRating: 0.0,
          reviewCount: 0,
          star1Count: 0,
          star2Count: 0,
          star3Count: 0,
          star4Count: 0,
          star5Count: 0,
        },
      });
      console.log(`✅ Created unclaimed company: ${comp.name} (/companies/${comp.slug})`);
      createdCount++;
    }
  }

  console.log(`\n🎉 Finished seeding famous companies!`);
  console.log(`Created: ${createdCount}, Updated: ${updatedCount}, Total: ${FAMOUS_COMPANIES.length}`);
}

seedFamousCompanies()
  .catch((err) => {
    console.error("❌ Error seeding famous companies:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
