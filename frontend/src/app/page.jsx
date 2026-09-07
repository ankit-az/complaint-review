"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShieldCheck,
  Star,
  Building2,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Laptop,
  CreditCard,
  ShoppingBag,
  Plane,
  HeartPulse,
  Wrench,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Featured Categories Data
  const categories = [
    {
      name: "Software & Technology",
      slug: "technology",
      icon: Laptop,
      companiesCount: "1,420+",
      avgRating: 4.6,
      bg: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      name: "Banking & Financial Services",
      slug: "banking-finance",
      icon: CreditCard,
      companiesCount: "890+",
      avgRating: 4.3,
      bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      name: "E-Commerce & Retail",
      slug: "e-commerce",
      icon: ShoppingBag,
      companiesCount: "3,250+",
      avgRating: 4.5,
      bg: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      name: "Travel & Hospitality",
      slug: "travel-hospitality",
      icon: Plane,
      companiesCount: "1,120+",
      avgRating: 4.2,
      bg: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      name: "Health & Wellness",
      slug: "healthcare",
      icon: HeartPulse,
      companiesCount: "640+",
      avgRating: 4.7,
      bg: "bg-rose-50 text-rose-600 border-rose-100",
    },
    {
      name: "Home & Professional Services",
      slug: "services",
      icon: Wrench,
      companiesCount: "2,100+",
      avgRating: 4.4,
      bg: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
  ];

  // Verified Recent Reviews Mock/Seed Showcase
  const recentReviews = [
    {
      id: "rev-1",
      companyName: "CloudScale Hosting",
      companySlug: "cloudscale-hosting",
      rating: 5,
      title: "Phenomenal zero-downtime migration and rapid support",
      content:
        "Migrated over 40 client websites with zero hiccups. When we needed help with custom SSL certificates, their support engineer answered within 4 minutes on live chat.",
      author: "Marcus Vance",
      authorRole: "Verified Buyer",
      date: "2 hours ago",
      helpfulCount: 18,
      hasCompanyResponse: true,
    },
    {
      id: "rev-2",
      companyName: "Finova Digital Banking",
      companySlug: "finova-banking",
      rating: 4,
      title: "Clean mobile UI, fast international wire transfers",
      content:
        "Been using Finova for business cross-border payments. The exchange rates are transparent with no hidden margins. Account verification took less than 24 hours.",
      author: "Elena Rostova",
      authorRole: "Verified Customer",
      date: "4 hours ago",
      helpfulCount: 9,
      hasCompanyResponse: true,
    },
    {
      id: "rev-3",
      companyName: "Apex Logistics & Freight",
      companySlug: "apex-logistics",
      rating: 5,
      title: "Delivered sensitive freight across country on timo",
      content:
        "Real-time GPS telemetry and proactive dispatchers kept us updated at every checkpoint. No damages and arrived 3 hours ahead of scheduled delivery window.",
      author: "David Chen",
      authorRole: "Verified Customer",
      date: "6 hours ago",
      helpfulCount: 14,
      hasCompanyResponse: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/10 blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Trust Badge pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 mb-6 backdrop-blur">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>The Independent Review & Complaint Standard</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight">
            Find Companies You Can{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Trust.
            </span>
            <br />
            Share Experiences That Matter.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Read transparent reviews, file verified customer complaints, and discover
            top-rated businesses vetted by authentic buyers worldwide.
          </p>

          {/* Interactive Search Bar */}
          <div className="mt-10 max-w-2xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row items-center gap-2 rounded-2xl bg-white p-2 shadow-2xl shadow-emerald-950/40 border border-slate-700/50"
            >
              <div className="flex items-center gap-3 px-3 flex-1 w-full">
                <Search className="h-5 w-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Company name, website, or category (e.g. Stripe, Hosting)..."
                  className="w-full bg-transparent py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <Button
                type="submit"
                variant="emerald"
                size="lg"
                className="w-full sm:w-auto shrink-0 font-bold px-8 shadow-md"
              >
                Search
              </Button>
            </form>

            {/* Popular search tags */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Popular:</span>
              {["Stripe", "CloudScale", "Shopify", "Nike", "NordVPN"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => router.push(`/search?q=${tag}`)}
                  className="rounded-full bg-slate-800/80 px-2.5 py-1 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Trust Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/80">
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-black text-white">2.4M+</p>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                Verified Reviews
              </p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">98,000+</p>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                Registered Businesses
              </p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-black text-white">99.8%</p>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                Spam Shield Rate
              </p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-black text-amber-400">4.8 / 5</p>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                Trust Integrity Score
              </p>
            </div>
          </div>

          {/* Demo Data Disclaimer Badge */}
          <div className="mt-8 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/40 px-3.5 py-1.5 text-xs text-amber-300 backdrop-blur">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                <strong>Warning / Demo Data:</strong> Platform statistics shown above are mock preview values.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY DISCOVERY SECTION */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                Industry Directory
              </p>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
                Explore Companies by Category
              </h2>
            </div>
            <Link
              href="/categories"
              className="mt-3 sm:mt-0 text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 group"
            >
              Browse all categories
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="group block"
                >
                  <Card
                    hover
                    className="h-full border-slate-200/80 group-hover:border-emerald-500/40 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border ${cat.bg} transition-transform duration-200 group-hover:scale-105`}
                      >
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded-md">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>{cat.avgRating}</span>
                      </div>
                    </div>

                    <div className="mt-5">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {cat.companiesCount} companies listed
                      </p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. RECENT VERIFIED REVIEWS SHOWCASE */}
      <section className="py-16 sm:py-20 bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Feed</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
                Recent Authentic Reviews
              </h2>
            </div>
            <Link
              href="/companies"
              className="mt-3 sm:mt-0 text-sm font-bold text-slate-700 hover:text-emerald-600 flex items-center gap-1"
            >
              See all reviews
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Sample Data Warning Alert Banner */}
          <div className="mb-8 rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 flex items-start gap-3 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-amber-950">
                Notice: The reviews and metrics below are sample / dummy demonstration data
              </p>
              <p className="mt-1 text-amber-800 leading-relaxed">
                These customer testimonials and company profiles are temporary mock entries for layout preview. In upcoming phases, this section will automatically stream verified live reviews and ratings from the database.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentReviews.map((rev) => (
              <Card
                key={rev.id}
                className="flex flex-col justify-between border-slate-200/90 shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Company & Rating Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/companies/${rev.companySlug}`}
                        className="font-bold text-slate-900 hover:text-emerald-600 transition-colors flex items-center gap-1.5"
                      >
                        <Building2 className="w-4 h-4 text-slate-400" />
                        {rev.companyName}
                      </Link>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                        Demo Data
                      </span>
                    </div>
                    <StarRating rating={rev.rating} size="sm" />
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                    "{rev.title}"
                  </h4>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {rev.content}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-900">{rev.author}</p>
                    <Badge variant="verified" size="sm" className="mt-0.5">
                      {rev.authorRole}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-slate-600">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {rev.helpfulCount}
                    </span>
                    {rev.hasCompanyResponse && (
                      <span
                        className="flex items-center gap-1 text-emerald-700 font-medium"
                        title="Company replied to this review"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Replied
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE COMPLAINT-REVIEW STANDARD (3 PILLARS) */}
      <section className="py-16 sm:py-24 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="verified" size="md" className="bg-emerald-950/80 text-emerald-400 border-emerald-500/30 mb-4">
              Anti-Fraud Architecture
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              A Platform Built on Radical Consumer Transparency
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-400">
              Unlike legacy review websites, Complaint-Review cannot be manipulated by pay-to-remove
              schemes or astroturfing campaigns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-8 backdrop-blur">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                100% Genuine Human Reviews
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every review undergoes transactional cross-verification and biometric bot
                screening. Paid positive reviews and smear campaigns are blocked at submission.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-8 backdrop-blur">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6 border border-blue-500/20">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Weighted Rating Distribution
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our proprietary score engine prevents sudden rating spikes. We calculate
                time-decayed metrics and verified buyer weighting to reflect current service quality.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-8 backdrop-blur">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6 border border-amber-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Public Accountability
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Businesses cannot delete negative feedback. Instead, verified business
                owners can respond directly, resolve customer disputes, and showcase customer care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BUSINESS CONVERSION BANNER */}
      <section className="relative overflow-hidden bg-emerald-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-3 max-w-xl">
            <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-700/60 text-xs font-bold uppercase tracking-wider">
              For Business Owners & Brands
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Turn Real Customer Feedback into Your Greatest Growth Engine.
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Claim your official company profile on Complaint-Review today. Respond to reviews,
              track rating analytics, and demonstrate commitment to customer satisfaction.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link href="/business">
              <Button
                variant="primary"
                size="lg"
                className="bg-slate-950 hover:bg-slate-900 text-white font-bold shadow-lg"
              >
                Claim Your Business Free
              </Button>
            </Link>
            <Link href="/business/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="border-white/40 text-white hover:bg-white/10 font-semibold"
              >
                Business Portal Login
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
