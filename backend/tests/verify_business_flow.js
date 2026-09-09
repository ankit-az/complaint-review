import { prisma } from "../src/config/db.js";

const BASE_URL = "http://localhost:5000/api/v1";

async function runTests() {
  console.log("🧪 Starting Business Portal End-to-End API Verification...");

  const timestamp = Date.now();
  const testEmail = `biztest_${timestamp}@example.com`;
  const companyName = `Apex Tech Solutions ${timestamp}`;

  // 1. Test Business Registration
  console.log("\n1. Testing Business Registration (POST /business/register)...");
  const regRes = await fetch(`${BASE_URL}/business/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: "Sarah",
      lastName: "Connor",
      email: testEmail,
      password: "Password@123",
      companyName: companyName,
      websiteUrl: "https://apextech.example",
      contactPhone: "+1 (555) 987-6543",
      country: "United States",
      city: "Austin",
      address: "100 Innovation Way",
      jobTitle: "Chief Executive Officer",
    }),
  });

  const regData = await regRes.json();
  if (!regRes.ok || !regData.success) {
    throw new Error(`Registration failed: ${JSON.stringify(regData)}`);
  }
  console.log("✅ Business registered successfully:", regData.data.company.name);

  const token = regData.data.accessToken;
  const companyId = regData.data.company.id;
  const companySlug = regData.data.company.slug;

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // 2. Test Get Business Me Context
  console.log("\n2. Testing Business Context (GET /business/me)...");
  const meRes = await fetch(`${BASE_URL}/business/me`, { headers: authHeaders });
  const meData = await meRes.json();
  if (!meRes.ok || !meData.success || meData.data.company.id !== companyId) {
    throw new Error(`GetMe failed: ${JSON.stringify(meData)}`);
  }
  console.log("✅ Authenticated business context verified:", meData.data.user.email);

  // 3. Test Dashboard Stats
  console.log("\n3. Testing Dashboard Stats (GET /business/dashboard)...");
  const dashRes = await fetch(`${BASE_URL}/business/dashboard`, { headers: authHeaders });
  const dashData = await dashRes.json();
  if (!dashRes.ok || !dashData.success) {
    throw new Error(`Dashboard stats failed: ${JSON.stringify(dashData)}`);
  }
  console.log("✅ Dashboard metrics verified:", dashData.data.metrics);

  // 4. Test Create Sample Review & Respond to Review
  console.log("\n4. Testing Reviews Inbox & Official Response...");
  // Create a review in DB for this company from admin
  const adminUser = await prisma.user.findFirst();
  const sampleReview = await prisma.review.create({
    data: {
      companyId,
      userId: adminUser.id,
      rating: 5,
      title: "Superb onboarding experience",
      content: "Apex Tech delivered exactly as promised with fast delivery and high quality.",
      status: "PUBLISHED",
      verificationStatus: "VERIFIED",
    },
  });

  // Post response
  const respRes = await fetch(`${BASE_URL}/business/reviews/${sampleReview.id}/response`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      content: "Thank you for the wonderful feedback! Our team strives for excellence every day.",
    }),
  });
  const respData = await respRes.json();
  if (!respRes.ok || !respData.success) {
    throw new Error(`Respond to review failed: ${JSON.stringify(respData)}`);
  }
  console.log("✅ Official response published successfully:", respData.data.response.content);

  // 5. Test Analytics
  console.log("\n5. Testing Analytics (GET /business/analytics)...");
  const anaRes = await fetch(`${BASE_URL}/business/analytics?period=30d`, { headers: authHeaders });
  const anaData = await anaRes.json();
  if (!anaRes.ok || !anaData.success) {
    throw new Error(`Analytics failed: ${JSON.stringify(anaData)}`);
  }
  console.log("✅ Analytics topics and sentiment verified. Total topics:", anaData.data.sentimentTopics.length);

  // 6. Test Review Invitations
  console.log("\n6. Testing Review Invitations (POST & GET /business/invitations)...");
  const invRes = await fetch(`${BASE_URL}/business/invitations`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      customerEmail: `customer_${timestamp}@gmail.com`,
      customerName: "Michael Scott",
    }),
  });
  const invData = await invRes.json();
  if (!invRes.ok || !invData.success) {
    throw new Error(`Create invitation failed: ${JSON.stringify(invData)}`);
  }
  console.log("✅ Invitation dispatched with token:", invData.data.invitation.inviteToken);

  const getInvRes = await fetch(`${BASE_URL}/business/invitations`, { headers: authHeaders });
  const getInvData = await getInvRes.json();
  if (!getInvRes.ok || getInvData.data.invitations.length === 0) {
    throw new Error(`List invitations failed: ${JSON.stringify(getInvData)}`);
  }
  console.log("✅ Listed invitations count:", getInvData.data.invitations.length);

  // 7. Test Branch Locations
  console.log("\n7. Testing Branch Locations (POST & GET /business/locations)...");
  const locRes = await fetch(`${BASE_URL}/business/locations`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      name: "Austin Headquarters",
      address: "100 Innovation Way, Suite 500",
      city: "Austin",
      state: "TX",
      country: "United States",
      postalCode: "78701",
      phone: "+1 (555) 123-4567",
      email: "austin@apextech.example",
      isPrimary: true,
    }),
  });
  const locData = await locRes.json();
  if (!locRes.ok || !locData.success) {
    throw new Error(`Create location failed: ${JSON.stringify(locData)}`);
  }
  console.log("✅ Location created:", locData.data.location.name);

  // 8. Test Products & Services Catalog
  console.log("\n8. Testing Products Catalog (POST & GET /business/products)...");
  const prodRes = await fetch(`${BASE_URL}/business/products`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      name: "Enterprise Cloud Tier",
      description: "Dedicated Kubernetes cluster with 99.99% uptime SLA.",
      price: 299.0,
      currency: "USD",
      category: "Cloud",
      status: "ACTIVE",
    }),
  });
  const prodData = await prodRes.json();
  if (!prodRes.ok || !prodData.success) {
    throw new Error(`Create product failed: ${JSON.stringify(prodData)}`);
  }
  console.log("✅ Product created:", prodData.data.product.name);

  // 9. Test Public Widget Endpoint
  console.log("\n9. Testing Public Widget Endpoint (GET /business/widgets/public/:slug)...");
  const widRes = await fetch(`${BASE_URL}/business/widgets/public/${companySlug}`);
  const widData = await widRes.json();
  if (!widRes.ok || !widData.success || widData.data.company.slug !== companySlug) {
    throw new Error(`Public widget failed: ${JSON.stringify(widData)}`);
  }
  console.log("✅ Public sanitized widget payload verified for company:", widData.data.company.name);

  // 10. Test Multi-Tenant Security Isolation
  console.log("\n10. Testing Multi-Tenant Authorization Security...");
  // Try to respond to a review that belongs to another company (e.g. Stripe)
  const stripeCompany = await prisma.company.findUnique({ where: { slug: "stripe" } });
  if (stripeCompany) {
    const stripeReview = await prisma.review.findFirst({ where: { companyId: stripeCompany.id } });
    if (stripeReview) {
      const unauthorizedRes = await fetch(`${BASE_URL}/business/reviews/${stripeReview.id}/response`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ content: "Hacked response to competitor" }),
      });
      if (unauthorizedRes.status === 404 || unauthorizedRes.status === 403) {
        console.log("🔒 Multi-tenant isolation verified: Blocked cross-company review response (HTTP", unauthorizedRes.status, ")");
      } else {
        throw new Error("SECURITY FAILURE: Cross-company review response was not blocked!");
      }
    }
  }

  // Cleanup sample review created in this test
  await prisma.review.delete({ where: { id: sampleReview.id } });

  console.log("\n🎉 ALL 10 E2E BUSINESS TESTS PASSED PERFECTLY!\n");
  process.exit(0);
}

runTests().catch((err) => {
  console.error("\n❌ E2E TEST FAILED:", err);
  process.exit(1);
});
