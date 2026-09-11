"use client";

import React, { useState, useEffect } from "react";
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
  RefreshCw,
  AlertTriangle,
  Car,
  Utensils,
  GraduationCap,
  Home,
  Truck,
  Scale,
  Dumbbell,
  FolderOpen,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";
import api from "@/lib/api";
import { useAuth } from "@/store/AuthContext";

const categoryIconMap = {
  Laptop,
  CreditCard,
  ShoppingBag,
  ShieldCheck,
  Plane,
  HeartPulse,
  Wrench,
  Car,
  Utensils,
  GraduationCap,
  Home,
  Truck,
  Scale,
  Dumbbell,
  Building2,
  FolderOpen,
};

const categoryStyles = {
  technology: { bg: "bg-blue-50 text-blue-600 border-blue-100" },
  "banking-finance": { bg: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  "e-commerce": { bg: "bg-purple-50 text-purple-600 border-purple-100" },
  "logistics-shipping": { bg: "bg-amber-50 text-amber-600 border-amber-100" },
  "travel-hospitality": { bg: "bg-teal-50 text-teal-600 border-teal-100" },
  healthcare: { bg: "bg-rose-50 text-rose-600 border-rose-100" },
  "automotive-vehicles": { bg: "bg-orange-50 text-orange-600 border-orange-100" },
  "food-beverages": { bg: "bg-yellow-50 text-yellow-600 border-yellow-100" },
  "education-training": { bg: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  "real-estate": { bg: "bg-sky-50 text-sky-600 border-sky-100" },
};

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  // Dynamic Categories from Backend
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Fetch Live Categories from Backend API
  useEffect(() => {
    let isMounted = true;
    async function fetchCategories() {
      try {
        setLoadingCategories(true);
        const res = await api.get("/categories");
        if (isMounted && res?.success && Array.isArray(res.data?.categories)) {
          // Sort categories: categories with registered companies first, then alphabetical
          const sorted = [...res.data.categories].sort((a, b) => {
            const countA = typeof a.companyCount === "number" ? a.companyCount : 0;
            const countB = typeof b.companyCount === "number" ? b.companyCount : 0;
            if (countB !== countA) return countB - countA;
            return a.name.localeCompare(b.name);
          });
          setCategories(sorted.slice(0, 6));
        }
      } catch (err) {
        console.error("Failed to load categories from backend:", err);
      } finally {
        if (isMounted) setLoadingCategories(false);
      }
    }
    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Live Backend Reviews State & Business Filter
  const { user } = useAuth();
  const [recentReviews, setRecentReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [votedReviews, setVotedReviews] = useState({});
  const [votingId, setVotingId] = useState(null);
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState("all");
  const [availableCompanies, setAvailableCompanies] = useState([]);

  // Load available companies for filter tabs
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await api.get("/companies?limit=10");
        if (res?.success && Array.isArray(res.data?.companies)) {
          setAvailableCompanies(res.data.companies);
        }
      } catch (e) { }
    }
    fetchCompanies();
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function fetchRecentReviews() {
      try {
        setLoadingReviews(true);
        const endpoint =
          selectedCompanyFilter === "all"
            ? "/reviews/recent?limit=6"
            : `/reviews/recent?companySlug=${selectedCompanyFilter}&limit=6`;

        const res = await api.get(endpoint);
        if (isMounted && res?.success && Array.isArray(res.data?.reviews)) {
          setRecentReviews(res.data.reviews);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load live reviews from backend:", err);
        }
      } finally {
        if (isMounted) {
          setLoadingReviews(false);
        }
      }
    }

    fetchRecentReviews();
    return () => {
      isMounted = false;
    };
  }, [selectedCompanyFilter]);

  const handleHelpfulVote = async (e, reviewId) => {
    e.preventDefault();
    e.stopPropagation();
    if (votedReviews[reviewId] || votingId === reviewId) return;

    // Optimistic UI increment
    setVotedReviews((prev) => ({ ...prev, [reviewId]: true }));
    setRecentReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r
      )
    );

    setVotingId(reviewId);
    try {
      await api.post(`/reviews/${reviewId}/helpful`);
    } catch (err) {
      console.error("Failed to vote review helpful:", err);
      // Revert if failed
      setVotedReviews((prev) => {
        const copy = { ...prev };
        delete copy[reviewId];
        return copy;
      });
      setRecentReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId ? { ...r, helpfulCount: Math.max(0, (r.helpfulCount || 1) - 1) } : r
        )
      );
    } finally {
      setVotingId(null);
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffSecs = Math.floor((now - date) / 1000);
    if (diffSecs < 60) return "Just now";
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION (Trustpilot-Inspired Crisp White Theme) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f4fbf7] via-white to-slate-50 border-b border-slate-200 pt-16 pb-20 lg:pt-20 lg:pb-24">
        {/* Subtle decorative background glow accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-72 bg-gradient-to-b from-emerald-100/50 via-teal-50/30 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -top-24 right-10 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-teal-100/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center z-10">
          {/* Main Trustpilot-Style Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            Read reviews. Write reviews.
            <br />
            <span className="text-emerald-700">Find companies you can trust.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Real customer feedback, verified transaction standards, and transparent corporate complaint resolutions — all in one independent consumer directory.
          </p>

          {/* Trustpilot-Style Prominent Search Bar */}
          <div className="mt-10 max-w-3xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="relative flex flex-col sm:flex-row items-center bg-white rounded-2xl sm:rounded-full p-2 sm:p-2.5 shadow-xl shadow-slate-200/80 border border-slate-200 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/15 transition-all"
            >
              <div className="flex items-center gap-3 px-4 flex-1 w-full">
                <Search className="h-6 w-6 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Company, category, or service (e.g. Stripe, Hosting, Banks)..."
                  className="w-full bg-transparent py-3 sm:py-3.5 text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <Button
                type="submit"
                variant="emerald"
                size="lg"
                className="w-full sm:w-auto shrink-0 font-bold px-8 sm:px-10 py-3.5 rounded-xl sm:rounded-full shadow-md bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                Search
              </Button>
            </form>

            {/* Popular Search Categories (Trustpilot style pills) */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Popular:</span>
              {[
                { name: "Stripe", slug: "stripe" },
                { name: "CloudScale Hosting", slug: "cloudscale" },
                { name: "Banking & Finance", slug: "banking-finance" },
                { name: "Shopify", slug: "shopify" },
                { name: "Tata Group", slug: "tata" },
              ].map((tag) => (
                <button
                  key={tag.slug}
                  type="button"
                  onClick={() => router.push(`/search?q=${tag.name}`)}
                  className="rounded-full bg-white border border-slate-200 px-3 py-1.5 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/50 transition-colors cursor-pointer font-medium shadow-2xs"
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Action CTA & Star Teaser Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/writereview">
              <Button
                variant="emerald"
                size="md"
                className="font-bold shadow-md shadow-emerald-700/15 flex items-center gap-2 px-6 py-3 rounded-full cursor-pointer bg-emerald-600 hover:bg-emerald-700"
              >
                <Sparkles className="w-4 h-4 text-emerald-100" />
                <span>Write a Review</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link href="/companies">
              <button
                type="button"
                className="px-6 py-3 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-sm font-semibold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-slate-500" />
                <span>Browse All Companies</span>
              </button>
            </Link>
          </div>

          {/* Trustpilot-Style Interactive Star Rating Strip */}
          <div className="mt-8 max-w-md mx-auto p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3 text-xs">
            <span className="text-slate-700 font-semibold">Rate a company you used:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => router.push(`/writereview?rating=${star}`)}
                  className="w-7 h-7 rounded-xs flex items-center justify-center transition-all cursor-pointer hover:scale-110"
                  style={{
                    backgroundColor:
                      star <= (hoverRating || 0) ? "#059669" : "#e2e8f0",
                  }}
                  title={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                  <Star className="w-4 h-4 fill-white text-white" />
                </button>
              ))}
            </div>
            <Link
              href="/writereview"
              className="text-emerald-700 hover:text-emerald-800 font-bold hidden sm:inline"
            >
              Start →
            </Link>
          </div>

          {/* Trustpilot-Style Stats Bar (White/Light Theme) */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-200">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors text-center">
              <p className="text-2xl sm:text-3xl font-black text-slate-900">2.4M+</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Verified Reviews
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors text-center">
              <p className="text-2xl sm:text-3xl font-black text-emerald-700">98,000+</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Registered Businesses
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors text-center">
              <p className="text-2xl sm:text-3xl font-black text-slate-900">99.8%</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Spam Shield Rate
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors text-center">
              <p className="text-2xl sm:text-3xl font-black text-amber-500">4.8 / 5</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Trust Integrity Score
              </p>
            </div>
          </div>

          {/* Demo Data Disclaimer Badge with Warning Sign (PRESERVED) */}
          <div className="mt-8 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-xs text-amber-900 shadow-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Warning / Demo Data:</strong> Platform statistics shown above are mock preview values.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY DISCOVERY SECTION (Connected to Live Database) */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-widest">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Live Industry Directory</span>
              </div>
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

          {loadingCategories ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-44 rounded-2xl bg-white border border-slate-200/80 p-6 animate-pulse flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-slate-200" />
                    <div className="w-16 h-6 rounded-md bg-slate-200" />
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="w-3/4 h-5 rounded bg-slate-200" />
                    <div className="w-1/2 h-4 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <FolderOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No categories currently found</p>
              <p className="text-xs text-slate-500 mt-1">Categories are syncing with the database.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => {
                const IconComponent = categoryIconMap[cat.iconName] || Building2;
                const style = categoryStyles[cat.slug] || {
                  bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
                };
                const count =
                  typeof cat.companyCount === "number"
                    ? cat.companyCount
                    : cat._count?.companies || 0;

                return (
                  <Link
                    key={cat.slug || cat.id}
                    href={`/categories/${cat.slug}`}
                    className="group block"
                  >
                    <Card
                      hover
                      className="h-full border-slate-200/80 group-hover:border-emerald-500/40 transition-all duration-200 p-6 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl border ${style.bg} transition-transform duration-200 group-hover:scale-105`}
                          >
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                            <span className="text-emerald-700 font-extrabold">{count}</span>
                            <span className="text-slate-500 font-medium">
                              {count === 1 ? "company" : "companies"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-5">
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {cat.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {cat.description ||
                              "Browse verified company profiles, ratings, and customer reviews."}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-semibold group-hover:text-emerald-700">
                        <span>Explore Directory</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 3. RECENT VERIFIED REVIEWS SHOWCASE (Connected to Live Database) */}
      <section className="py-16 sm:py-20 bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
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

          {/* Admin Management Bar (Visible to Platform Admin) */}
          {user?.role === "ADMIN" && (
            <div className="mb-6 p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-slate-800 shadow-md">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 rounded-full bg-purple-400 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Admin Active:
                </span>
                <span className="text-xs text-slate-300">
                  You have administrative control over all public reviews and business curation.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link href="/admin/reviews">
                  <Button variant="emerald" size="sm" className="font-bold text-xs">
                    Admin Review Console
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Sample Data Warning Alert Banner with Warning Sign */}
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

          {/* Business Spotlight / Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 shrink-0 mr-1">
              Filter by Business:
            </span>
            <button
              type="button"
              onClick={() => setSelectedCompanyFilter("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${selectedCompanyFilter === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
            >
              All Businesses
            </button>
            {availableCompanies.map((comp) => (
              <button
                key={comp.slug}
                type="button"
                onClick={() => setSelectedCompanyFilter(comp.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${selectedCompanyFilter === comp.slug
                    ? "bg-emerald-600 text-white font-bold shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                {comp.name}
              </button>
            ))}
          </div>

          {loadingReviews ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 space-y-4 animate-pulse border-slate-200">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <div className="h-5 w-36 bg-slate-200 rounded"></div>
                    <div className="h-4 w-20 bg-slate-200 rounded"></div>
                  </div>
                  <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-slate-200 rounded"></div>
                    <div className="h-3 w-5/6 bg-slate-200 rounded"></div>
                    <div className="h-3 w-2/3 bg-slate-200 rounded"></div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <div className="h-4 w-24 bg-slate-200 rounded"></div>
                    <div className="h-4 w-12 bg-slate-200 rounded"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : recentReviews.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300">
              <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No reviews published yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                Be the first customer to share your experience with a registered company.
              </p>
              <Link href="/writereview" className="inline-block mt-4">
                <Button variant="emerald" size="sm">
                  Write a Review
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentReviews.map((rev) => {
                const companyName = rev.company?.name || "Verified Company";
                const companySlug = rev.company?.slug || "";
                const authorName = rev.user
                  ? `${rev.user.firstName || ""} ${rev.user.lastName || ""}`.trim() || "Verified Reviewer"
                  : "Verified Reviewer";
                const isVerified = rev.verificationStatus === "VERIFIED";

                return (
                  <Card
                    key={rev.id}
                    className="flex flex-col justify-between border-slate-200/90 shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div>
                      {/* Company & Rating Header */}
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/companies/${companySlug}`}
                            className="font-bold text-slate-900 hover:text-emerald-600 transition-colors flex items-center gap-1.5 line-clamp-1"
                          >
                            <Building2 className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
                            <span className="truncate">{companyName}</span>
                          </Link>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                            Demo Data
                          </span>
                        </div>
                        <div className="shrink-0 ml-2">
                          <StarRating rating={rev.rating} size="sm" />
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {rev.title}
                      </h4>

                      <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {rev.content}
                      </p>

                      {/* Official Company Response Preview if present */}
                      {rev.response && (
                        <div className="mt-3 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100/80 text-[11px] text-emerald-950">
                          <div className="flex items-center gap-1 font-semibold text-emerald-800 mb-1">
                            <MessageSquare className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>Official Response from {companyName}</span>
                          </div>
                          <p className="text-emerald-900/85 line-clamp-2 italic">
                            &ldquo;{rev.response.content}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-slate-900">{authorName}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Badge variant={isVerified ? "verified" : "secondary"} size="sm">
                            {isVerified ? "Verified Buyer" : "Customer"}
                          </Badge>
                          <span className="text-[11px] text-slate-400">
                            • {formatTimeAgo(rev.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-slate-600">
                        <button
                          type="button"
                          onClick={(e) => handleHelpfulVote(e, rev.id)}
                          disabled={votedReviews[rev.id] || votingId === rev.id}
                          className={`flex items-center gap-1 transition-colors cursor-pointer ${votedReviews[rev.id]
                              ? "text-emerald-600 font-bold"
                              : "hover:text-emerald-600"
                            }`}
                          title="Mark this review as helpful"
                        >
                          <ThumbsUp
                            className={`w-3.5 h-3.5 ${votedReviews[rev.id] ? "fill-emerald-600 text-emerald-600" : ""
                              }`}
                          />
                          <span>{rev.helpfulCount || 0}</span>
                        </button>
                        {rev.response && (
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
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. THE COMPLAINT-REVIEW STANDARD (3 PILLARS) */}
      <section className="py-16 sm:py-24 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
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
