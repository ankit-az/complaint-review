"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Car,
  Utensils,
  GraduationCap,
  Home,
  Truck,
  Scale,
  Dumbbell,
  FolderOpen,
  Check,
  ArrowUpRight,
  Users,
  Award,
  Zap,
  Clock,
  HeartHandshake,
  Store,
  ChevronRight,
  X,
  Lock,
  BarChart3,
  Eye,
  Filter,
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

const categoryThemeMap = {
  technology: {
    bg: "bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-600 group-hover:text-white",
    gradient: "from-blue-500/10 to-indigo-500/5",
    tag: "bg-blue-50 text-blue-700",
  },
  "banking-finance": {
    bg: "bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white",
    gradient: "from-emerald-500/10 to-teal-500/5",
    tag: "bg-emerald-50 text-emerald-700",
  },
  "e-commerce": {
    bg: "bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-600 group-hover:text-white",
    gradient: "from-purple-500/10 to-pink-500/5",
    tag: "bg-purple-50 text-purple-700",
  },
  "logistics-shipping": {
    bg: "bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-600 group-hover:text-white",
    gradient: "from-amber-500/10 to-orange-500/5",
    tag: "bg-amber-50 text-amber-700",
  },
  "travel-hospitality": {
    bg: "bg-teal-50 text-teal-600 border-teal-100 group-hover:bg-teal-600 group-hover:text-white",
    gradient: "from-teal-500/10 to-cyan-500/5",
    tag: "bg-teal-50 text-teal-700",
  },
  healthcare: {
    bg: "bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-600 group-hover:text-white",
    gradient: "from-rose-500/10 to-red-500/5",
    tag: "bg-rose-50 text-rose-700",
  },
  "automotive-vehicles": {
    bg: "bg-orange-50 text-orange-600 border-orange-100 group-hover:bg-orange-600 group-hover:text-white",
    gradient: "from-orange-500/10 to-amber-500/5",
    tag: "bg-orange-50 text-orange-700",
  },
  "food-beverages": {
    bg: "bg-yellow-50 text-yellow-600 border-yellow-100 group-hover:bg-yellow-600 group-hover:text-white",
    gradient: "from-yellow-500/10 to-amber-500/5",
    tag: "bg-yellow-50 text-yellow-700",
  },
  "education-training": {
    bg: "bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white",
    gradient: "from-indigo-500/10 to-purple-500/5",
    tag: "bg-indigo-50 text-indigo-700",
  },
  "real-estate": {
    bg: "bg-sky-50 text-sky-600 border-sky-100 group-hover:bg-sky-600 group-hover:text-white",
    gradient: "from-sky-500/10 to-blue-500/5",
    tag: "bg-sky-50 text-sky-700",
  },
};

const STAR_RATING_LABELS = {
  1: { label: "Terrible experience", color: "text-rose-600", bg: "bg-rose-50 border-rose-200" },
  2: { label: "Poor service", color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
  3: { label: "Average & acceptable", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  4: { label: "Great experience", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  5: { label: "Exceptional service!", color: "text-emerald-700", bg: "bg-emerald-100 border-emerald-300" },
};

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  // Search & Autocomplete State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ companies: [], categories: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef(null);

  // Interactive Rating Widget
  const [hoverRating, setHoverRating] = useState(0);

  // Top Rated Companies Leaderboard
  const [topCompanies, setTopCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [companySortTab, setCompanySortTab] = useState("rating"); // "rating" | "reviews"

  // Dynamic Categories from Backend
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Live Backend Reviews State & Business Filter
  const [recentReviews, setRecentReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [votedReviews, setVotedReviews] = useState({});
  const [votingId, setVotingId] = useState(null);
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState("all");
  const [availableCompanies, setAvailableCompanies] = useState([]);

  // "How It Works" Tab
  const [howItWorksTab, setHowItWorksTab] = useState("consumers"); // "consumers" | "businesses"

  // Live Ticker State
  const [tickerIndex, setTickerIndex] = useState(0);
  const tickerItems = [
    { text: "Verified review submitted for CloudScale Hosting", time: "Just now", badge: "Verified" },
    { text: "Apex Logistics resolved an open customer inquiry in <2h", time: "4m ago", badge: "Resolved" },
    { text: "Finova Digital Banking updated their customer guarantee policy", time: "12m ago", badge: "Updated" },
    { text: "New enterprise profile claimed: CloudScale Hosting", time: "25m ago", badge: "Claimed" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerItems.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [tickerItems.length]);

  // Click Outside to Dismiss Search Dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced Live Search Autocomplete
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults({ companies: [], categories: [] });
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await api.get(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res?.success && res.data) {
          setSearchResults({
            companies: Array.isArray(res.data.companies) ? res.data.companies.slice(0, 5) : [],
            categories: Array.isArray(res.data.categories) ? res.data.categories.slice(0, 3) : [],
          });
          setShowSearchDropdown(true);
        }
      } catch (err) {
        console.error("Autocomplete search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    setShowSearchDropdown(false);
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Fetch Top Rated / Trending Companies
  useEffect(() => {
    let isMounted = true;
    async function fetchTopCompanies() {
      try {
        setLoadingCompanies(true);
        const res = await api.get("/companies?limit=8");
        if (isMounted && res?.success && Array.isArray(res.data?.companies)) {
          setTopCompanies(res.data.companies);
          setAvailableCompanies(res.data.companies);
        }
      } catch (err) {
        console.error("Failed to load top companies:", err);
      } finally {
        if (isMounted) setLoadingCompanies(false);
      }
    }
    fetchTopCompanies();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Live Categories
  useEffect(() => {
    let isMounted = true;
    async function fetchCategories() {
      try {
        setLoadingCategories(true);
        const res = await api.get("/categories");
        if (isMounted && res?.success && Array.isArray(res.data?.categories)) {
          const sorted = [...res.data.categories].sort((a, b) => {
            const countA = typeof a.companyCount === "number" ? a.companyCount : 0;
            const countB = typeof b.companyCount === "number" ? b.companyCount : 0;
            if (countB !== countA) return countB - countA;
            return a.name.localeCompare(b.name);
          });
          setCategories(sorted.slice(0, 6));
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        if (isMounted) setLoadingCategories(false);
      }
    }
    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Recent Live Reviews
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
        if (isMounted) console.error("Failed to load live reviews:", err);
      } finally {
        if (isMounted) setLoadingReviews(false);
      }
    }

    fetchRecentReviews();
    return () => {
      isMounted = false;
    };
  }, [selectedCompanyFilter]);

  // Helpful Vote Action
  const handleHelpfulVote = async (e, reviewId) => {
    e.preventDefault();
    e.stopPropagation();
    if (votedReviews[reviewId] || votingId === reviewId) return;

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

  // Sorted Companies based on Active Tab
  const sortedCompanies = [...topCompanies].sort((a, b) => {
    if (companySortTab === "rating") {
      return (b.overallRating || 0) - (a.overallRating || 0);
    }
    return (b.reviewCount || 0) - (a.reviewCount || 0);
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (High-Converting Glassmorphic Design + Live Autocomplete) */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-emerald-50/25 to-slate-50 border-b border-slate-200/80 pt-16 pb-20 lg:pt-24 lg:pb-28">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-200/35 via-teal-100/20 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -top-32 right-10 w-96 h-96 bg-emerald-300/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-teal-300/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center z-10">
          {/* Trust Authority Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/90 px-4 py-1.5 text-xs font-semibold text-emerald-800 shadow-xs backdrop-blur mb-6 hover:border-emerald-300 transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Independent & Transaction-Verified Consumer Directory</span>
          </div>

          {/* Core Value Proposition Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.12]">
            Real Feedback. Real Trust.
            <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              Find Companies That Deliver.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Read verified customer experiences, report unresolved disputes, and discover businesses held to transparent public accountability.
          </p>

          {/* Search Container with Live Autocomplete Dropdown */}
          <div ref={searchContainerRef} className="mt-10 max-w-3xl mx-auto relative">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex flex-col sm:flex-row items-center bg-white rounded-2xl sm:rounded-full p-2 sm:p-2.5 shadow-xl shadow-slate-200/70 border border-slate-200/90 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/15 transition-all"
            >
              <div className="flex items-center gap-3 px-4 flex-1 w-full">
                <Search className="h-5 w-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchResults.companies.length > 0 || searchResults.categories.length > 0) {
                      setShowSearchDropdown(true);
                    }
                  }}
                  placeholder="Search by company name, category, or service..."
                  className="w-full bg-transparent py-3 sm:py-3.5 text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setShowSearchDropdown(false);
                    }}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <Button
                type="submit"
                variant="emerald"
                size="lg"
                className="w-full sm:w-auto shrink-0 font-bold px-8 sm:px-10 py-3.5 rounded-xl sm:rounded-full shadow-md shadow-emerald-700/20 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-all"
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </form>

            {/* LIVE AUTOCOMPLETE DROPDOWN */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                {searchResults.companies.length === 0 && searchResults.categories.length === 0 ? (
                  <div className="p-6 text-center text-sm text-slate-500">
                    No matching companies or categories found for &ldquo;{searchQuery}&rdquo;.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                    {/* Matching Companies */}
                    {searchResults.companies.length > 0 && (
                      <div className="p-3">
                        <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Companies
                        </div>
                        {searchResults.companies.map((company) => (
                          <Link
                            key={company.id}
                            href={`/companies/${company.slug}`}
                            onClick={() => setShowSearchDropdown(false)}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 font-black flex items-center justify-center text-sm shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                {company.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                    {company.name}
                                  </h4>
                                  {company.isVerified && (
                                    <Badge variant="verified" size="sm">
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-1">
                                  {company.category?.name || "Business Services"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <div className="text-right">
                                <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  <span>{Number(company.overallRating || 0).toFixed(1)}</span>
                                </div>
                                <p className="text-[11px] text-slate-400">
                                  {company.reviewCount || 0} reviews
                                </p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Matching Categories */}
                    {searchResults.categories.length > 0 && (
                      <div className="p-3 bg-slate-50/50">
                        <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Categories
                        </div>
                        {searchResults.categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/categories/${cat.slug}`}
                            onClick={() => setShowSearchDropdown(false)}
                            className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white transition-colors group cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5">
                              <FolderOpen className="w-4 h-4 text-emerald-600" />
                              <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                                {cat.name}
                              </span>
                            </div>
                            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                              View Directory <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Search Footer */}
                    <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        Search query: <strong className="text-slate-800">&ldquo;{searchQuery}&rdquo;</strong>
                      </span>
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                      >
                        Press Enter to see all results <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Popular Search Tags */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-500">Trending:</span>
              {[
                { name: "CloudScale Hosting", query: "CloudScale" },
                { name: "Apex Logistics", query: "Apex" },
                { name: "Finova Banking", query: "Finova" },
                { name: "Technology", query: "Technology" },
                { name: "Shipping & Freight", query: "Logistics" },
              ].map((tag) => (
                <button
                  key={tag.name}
                  type="button"
                  onClick={() => {
                    setSearchQuery(tag.query);
                    router.push(`/search?q=${encodeURIComponent(tag.query)}`);
                  }}
                  className="rounded-full bg-white border border-slate-200/90 px-3 py-1 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all cursor-pointer font-medium shadow-2xs"
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Star Rating Simulator Box */}
          <div className="mt-10 max-w-xl mx-auto p-4 rounded-2xl bg-white border border-slate-200/90 shadow-md shadow-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="text-center sm:text-left">
              <span className="text-slate-900 font-bold text-sm block">
                Recently used a service?
              </span>
              <span className="text-slate-500 text-xs">
                {hoverRating > 0 ? (
                  <span className={`font-semibold ${STAR_RATING_LABELS[hoverRating]?.color}`}>
                    {STAR_RATING_LABELS[hoverRating]?.label}
                  </span>
                ) : (
                  "Select a star rating to write a review"
                )}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => router.push(`/writereview?rating=${star}`)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
                    star <= (hoverRating || 0)
                      ? star <= 2
                        ? "bg-rose-500 scale-110"
                        : star === 3
                        ? "bg-amber-500 scale-110"
                        : "bg-emerald-600 scale-110"
                      : "bg-slate-100 hover:bg-slate-200"
                  }`}
                  title={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= (hoverRating || 0)
                        ? "fill-white text-white"
                        : "fill-slate-300 text-slate-400"
                    }`}
                  />
                </button>
              ))}
            </div>

            <Link href="/writereview">
              <Button
                variant="emerald"
                size="sm"
                className="font-bold px-4 rounded-xl cursor-pointer text-xs"
              >
                Write Review →
              </Button>
            </Link>
          </div>

          {/* Real-time Activity Ticker Pill */}
          <div className="mt-8 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-xs text-slate-700 shadow-2xs backdrop-blur transition-all">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="font-semibold text-emerald-800">{tickerItems[tickerIndex].badge}:</span>
              <span className="truncate max-w-xs sm:max-w-md">{tickerItems[tickerIndex].text}</span>
              <span className="text-slate-400 shrink-0 text-[11px]">• {tickerItems[tickerIndex].time}</span>
            </div>
          </div>

          {/* Trust Platform Core Metrics */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-200/80">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all text-center">
              <div className="flex items-center justify-center gap-1 text-slate-900 mb-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-2xl sm:text-3xl font-black">100%</span>
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Human Verified
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-700 mb-1">
                <Lock className="w-5 h-5 text-emerald-600" />
                <span className="text-2xl sm:text-3xl font-black">0%</span>
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pay-to-Remove Policy
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all text-center">
              <div className="flex items-center justify-center gap-1 text-slate-900 mb-1">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-2xl sm:text-3xl font-black">&lt;24h</span>
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Average Business Reply
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all text-center">
              <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="text-2xl sm:text-3xl font-black">4.9 / 5</span>
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Platform Integrity Score
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TRENDING & TOP-RATED BUSINESSES (Leaderboard Showcase) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-widest">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Verified Business Directory</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
                Top Rated & Trending Companies
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Businesses held to the highest customer service resolution standards.
              </p>
            </div>

            {/* Sort Toggle Tabs */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200/80 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setCompanySortTab("rating")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  companySortTab === "rating"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Highest Rated
              </button>
              <button
                type="button"
                onClick={() => setCompanySortTab("reviews")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  companySortTab === "reviews"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Most Reviewed
              </button>
            </div>
          </div>

          {loadingCompanies ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-56 rounded-2xl bg-white border border-slate-200 p-5 animate-pulse flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-slate-200" />
                    <div className="w-16 h-5 rounded bg-slate-200" />
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="w-3/4 h-5 rounded bg-slate-200" />
                    <div className="w-1/2 h-3 rounded bg-slate-200" />
                  </div>
                  <div className="w-full h-8 rounded bg-slate-200 mt-4" />
                </div>
              ))}
            </div>
          ) : sortedCompanies.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
              <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No companies currently available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {sortedCompanies.slice(0, 8).map((comp) => {
                const initial = comp.name ? comp.name.charAt(0).toUpperCase() : "C";
                const rating = Number(comp.overallRating || 0).toFixed(1);
                const reviewCount = comp.reviewCount || 0;

                return (
                  <Card
                    key={comp.id || comp.slug}
                    hover
                    className="h-full border-slate-200/90 hover:border-emerald-500/40 transition-all p-5 flex flex-col justify-between group shadow-xs hover:shadow-md"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-black flex items-center justify-center text-base shrink-0 group-hover:bg-emerald-600 transition-colors shadow-2xs">
                          {initial}
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80 shrink-0">
                          {comp.category?.name || "Business"}
                        </span>
                      </div>

                      <Link href={`/companies/${comp.slug}`} className="block">
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                          {comp.name}
                        </h3>
                      </Link>

                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {comp.description || "Verified corporate profile with published ratings and resolution track record."}
                      </p>

                      {/* Star Rating Strip */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <StarRating rating={comp.overallRating || 0} size="sm" />
                          <span className="text-xs font-bold text-slate-900">{rating}</span>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">
                          {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                        </span>
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <Link
                        href={`/companies/${comp.slug}`}
                        className="font-bold text-slate-700 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                      >
                        <span>View Profile</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>

                      <Link
                        href={`/writereview?company=${comp.slug}`}
                        className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        Review
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/companies">
              <Button
                variant="outline"
                size="md"
                className="font-bold text-slate-700 hover:text-slate-900 border-slate-300 rounded-full px-6 cursor-pointer"
              >
                Browse All Registered Companies ({availableCompanies.length}+) →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CATEGORY DISCOVERY SECTION (Dynamic Live Categories) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-widest">
                <FolderOpen className="w-4 h-4 text-emerald-600" />
                <span>Industry Sectors</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
                Explore Companies by Industry
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Find trusted providers across key consumer and enterprise sectors.
              </p>
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
              <p className="text-sm font-semibold text-slate-700">No categories found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => {
                const IconComponent = categoryIconMap[cat.iconName] || Building2;
                const theme = categoryThemeMap[cat.slug] || {
                  bg: "bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white",
                  gradient: "from-emerald-500/10 to-teal-500/5",
                  tag: "bg-emerald-50 text-emerald-700",
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
                      className="h-full border-slate-200/90 group-hover:border-emerald-500/50 transition-all duration-200 p-6 flex flex-col justify-between bg-white relative overflow-hidden"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl border ${theme.bg} transition-all duration-200 shadow-2xs`}
                          >
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${theme.tag}`}>
                            <span>{count} {count === 1 ? "company" : "companies"}</span>
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

                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-semibold group-hover:text-emerald-700">
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

      {/* ========================================================================= */}
      {/* 4. RECENT VERIFIED REVIEWS SHOWCASE (Live Stream) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Live Feedback Stream</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
                Recent Authentic Reviews
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Real customer testimonials and documented company dispute resolutions.
              </p>
            </div>
            <Link
              href="/companies"
              className="mt-3 sm:mt-0 text-sm font-bold text-slate-700 hover:text-emerald-600 flex items-center gap-1"
            >
              See all reviews
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Admin Management Bar (Visible only when logged in as ADMIN) */}
          {user?.role === "ADMIN" && (
            <div className="mb-6 p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-slate-800 shadow-md">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 rounded-full bg-purple-400 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Admin Console Active:
                </span>
                <span className="text-xs text-slate-300">
                  You have full moderation control over all community reviews.
                </span>
              </div>
              <Link href="/admin/reviews">
                <Button variant="emerald" size="sm" className="font-bold text-xs">
                  Open Review Moderation →
                </Button>
              </Link>
            </div>
          )}

          {/* Business Spotlight Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            <button
              type="button"
              onClick={() => setSelectedCompanyFilter("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCompanyFilter === "all"
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  selectedCompanyFilter === comp.slug
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
                    className="flex flex-col justify-between border-slate-200/90 shadow-sm hover:shadow-md transition-shadow group bg-white"
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

                      {/* Official Company Response */}
                      {rev.response && (
                        <div className="mt-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-950">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-1">
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Official Response from {companyName}</span>
                          </div>
                          <p className="text-emerald-900/90 line-clamp-2 italic">
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
                          className={`flex items-center gap-1 transition-colors cursor-pointer ${
                            votedReviews[rev.id]
                              ? "text-emerald-600 font-bold"
                              : "hover:text-emerald-600"
                          }`}
                          title="Mark this review as helpful"
                        >
                          <ThumbsUp
                            className={`w-3.5 h-3.5 ${
                              votedReviews[rev.id] ? "fill-emerald-600 text-emerald-600" : ""
                            }`}
                          />
                          <span>{rev.helpfulCount || 0}</span>
                        </button>
                        {rev.response && (
                          <span
                            className="flex items-center gap-1 text-emerald-700 font-semibold"
                            title="Company replied to this review"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            Resolved
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

      {/* ========================================================================= */}
      {/* 5. HOW IT WORKS (Interactive Dual-Track: Consumers & Businesses) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-xs uppercase tracking-widest mb-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Transparent Process</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              How Complaint-Review Powers Authentic Trust
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Built from the ground up to eliminate fake reviews, pay-to-remove schemes, and corporate silencing.
            </p>

            {/* Toggle Track */}
            <div className="mt-6 inline-flex items-center p-1 rounded-xl bg-slate-200/80 border border-slate-300/80 text-xs font-bold">
              <button
                type="button"
                onClick={() => setHowItWorksTab("consumers")}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  howItWorksTab === "consumers"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Users className="w-4 h-4 text-emerald-600" />
                For Everyday Consumers
              </button>
              <button
                type="button"
                onClick={() => setHowItWorksTab("businesses")}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  howItWorksTab === "businesses"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Store className="w-4 h-4 text-blue-600" />
                For Registered Businesses
              </button>
            </div>
          </div>

          {/* How It Works Content Cards */}
          {howItWorksTab === "consumers" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-black flex items-center justify-center text-sm mb-4 border border-emerald-100">
                  01
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  1. Search Any Business
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Look up service providers, e-commerce stores, or SaaS tools. Read real experiences and verified buyer ratings before making a payment.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-black flex items-center justify-center text-sm mb-4 border border-emerald-100">
                  02
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  2. Share Your Experience
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Post detailed reviews with receipt or order verification. Unbiased algorithm protects against corporate manipulation.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-black flex items-center justify-center text-sm mb-4 border border-emerald-100">
                  03
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  3. Get Public Resolution
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Businesses are notified instantly. Verified customer service teams respond directly and solve complaints under public eyes.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-black flex items-center justify-center text-sm mb-4 border border-blue-100">
                  01
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  1. Claim Free Official Profile
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Verify business domain ownership and set up your verified profile with official contact details, branding, and location info.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-black flex items-center justify-center text-sm mb-4 border border-blue-100">
                  02
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  2. Monitor Customer Feedback
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Receive live alerts the moment a review or dispute is posted. Track sentiment analytics, rating breakdown, and response times.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-black flex items-center justify-center text-sm mb-4 border border-blue-100">
                  03
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  3. Respond & Build Reputation
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Demonstrate proactive customer care. Resolve issues publicly and turn negative customer experiences into trust anchors.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. RADICAL TRANSPARENCY STANDARD (4 Pillars - Premium Dark Section) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1 text-xs font-semibold text-emerald-400 mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>Consumer Protection Standard</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              A Platform Built on Radical Consumer Transparency
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
              Unlike legacy review websites, Complaint-Review cannot be manipulated by pay-to-remove
              schemes or astroturfing campaigns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur hover:border-emerald-500/40 transition-colors">
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

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur hover:border-blue-500/40 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6 border border-blue-500/20">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Weighted Rating Distribution
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our score engine prevents artificial rating spikes. We calculate
                time-decayed metrics and verified buyer weighting to reflect current service quality.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur hover:border-amber-500/40 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6 border border-amber-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Public Accountability
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Businesses cannot delete negative feedback. Instead, verified business
                owners can respond directly, resolve customer disputes, and demonstrate accountability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. HIGH-CONVERTING DUAL CTA SECTION */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-emerald-50 backdrop-blur">
              <Sparkles className="w-3.5 h-3.5" />
              <span>For Consumers & Businesses</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
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
                className="bg-slate-950 hover:bg-slate-900 text-white font-bold shadow-xl px-6 cursor-pointer"
              >
                Claim Your Business Free
              </Button>
            </Link>
            <Link href="/writereview">
              <Button
                variant="outline"
                size="lg"
                className="border-white/40 text-white hover:bg-white/10 font-bold px-6 cursor-pointer"
              >
                Write a Review
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
