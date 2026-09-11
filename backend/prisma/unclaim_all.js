import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function unclaimAll() {
  console.log("🔄 Unclaiming all companies in the database...");

  // 1. Remove any business profile links so companies are completely free to be claimed by real owners
  const deletedProfiles = await prisma.businessProfile.deleteMany({});
  console.log(`🧹 Cleared ${deletedProfiles.count} test/dummy business profile associations.`);

  // 2. Update ALL companies: isClaimed = false, isVerified = false
  const updated = await prisma.company.updateMany({
    data: {
      isClaimed: false,
      isVerified: false,
    },
  });

  console.log(`✅ Successfully updated ${updated.count} companies to UNCLAIMED (isClaimed: false, isVerified: false).`);

  // 3. Verify counts
  const total = await prisma.company.count();
  const claimedCount = await prisma.company.count({ where: { isClaimed: true } });
  const unclaimedCount = await prisma.company.count({ where: { isClaimed: false } });

  console.log("\n📊 Verification Summary:");
  console.log(`- Total Companies: ${total}`);
  console.log(`- Claimed Companies: ${claimedCount}`);
  console.log(`- Unclaimed Companies: ${unclaimedCount}`);
}

unclaimAll()
  .catch((err) => {
    console.error("❌ Failed to unclaim companies:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
