"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/store/AuthContext";
import Button from "@/components/ui/Button";
import {
  Search,
  Star,
  Plus,
  X,
  ExternalLink,
  CheckCircle2,
  Building2,
  Sparkles,
  ChevronRight,
  Globe,
  Calendar,
  Lock,
  AlertCircle,
  Loader2,
  ArrowRight,
  Check,
} from "lucide-react";

// Star rating block matching the ComplaintReview emerald design system
function StarSquares({ rating, count }) {
  // Matching the color theme from StarRating.jsx:
  // 5 stars: bg-emerald-600
  // 4 stars: bg-emerald-500
  // 3 stars: bg-amber-500
  // 2 stars: bg-orange-500
  // 1 star:  bg-rose-500
  const getBoxColor = (index, ratingValue) => {
    if (index < Math.floor(ratingValue)) {
      if (ratingValue >= 4.5) return "bg-emerald-600";
      if (ratingValue >= 4.0) return "bg-emerald-500";
      if (ratingValue >= 3.0) return "bg-amber-500";
      if (ratingValue >= 2.0) return "bg-orange-500";
      return "bg-rose-500";
    }
    return "bg-slate-200";
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-5 h-5 flex items-center justify-center rounded-xs ${getBoxColor(
              i,
              rating
            )}`}
          >
            <svg
              className="w-3.5 h-3.5 fill-white text-white"
              viewBox="0 0 24 24"
            >
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
          </div>
        ))}
      </div>
      <span className="text-xs font-semibold text-slate-700">
        {rating} {count !== undefined ? `(${count})` : ""}
      </span>
    </div>
  );
}

// Comprehensive initial companies including Tata, Reliance, Infosys, and global top brands
const INITIAL_COMPANIES = [
  {
    id: "apple",
    name: "Apple",
    website: "www.apple.com",
    rating: 1.7,
    reviewCount: 12638,
    category: "Consumer Electronics & Tech",
    fallbackIcon: "🍎",
  },
  {
    id: "tata",
    name: "Tata Group",
    website: "www.tata.com",
    rating: 4.5,
    reviewCount: 18420,
    category: "Conglomerate & Enterprise",
    fallbackIcon: "🏢",
  },
  {
    id: "tcs",
    name: "Tata Consultancy Services (TCS)",
    website: "www.tcs.com",
    rating: 4.3,
    reviewCount: 9240,
    category: "Software & Technology Services",
    fallbackIcon: "💻",
  },
  {
    id: "tata-motors",
    name: "Tata Motors",
    website: "www.tatamotors.com",
    rating: 4.1,
    reviewCount: 7150,
    category: "Automotive & Electric Vehicles",
    fallbackIcon: "🚗",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    website: "www.microsoft.com",
    rating: 4.2,
    reviewCount: 8410,
    category: "Software & Cloud Services",
    fallbackIcon: "💻",
  },
  {
    id: "amazon",
    name: "Amazon",
    website: "www.amazon.com",
    rating: 2.1,
    reviewCount: 24590,
    category: "E-Commerce & Logistics",
    fallbackIcon: "📦",
  },
  {
    id: "google",
    name: "Google",
    website: "www.google.com",
    rating: 4.5,
    reviewCount: 19204,
    category: "Search & Internet Services",
    fallbackIcon: "🌐",
  },
  {
    id: "stripe",
    name: "Stripe",
    website: "www.stripe.com",
    rating: 4.8,
    reviewCount: 3412,
    category: "Financial Infrastructure",
    fallbackIcon: "💳",
  },
  {
    id: "reliance",
    name: "Reliance Industries",
    website: "www.ril.com",
    rating: 4.3,
    reviewCount: 11450,
    category: "Telecom, Retail & Energy",
    fallbackIcon: "⚡",
  },
  {
    id: "infosys",
    name: "Infosys",
    website: "www.infosys.com",
    rating: 4.2,
    reviewCount: 6890,
    category: "Consulting & IT Services",
    fallbackIcon: "💻",
  },
  {
    id: "samsung",
    name: "Samsung",
    website: "www.samsung.com",
    rating: 3.8,
    reviewCount: 14200,
    category: "Consumer Electronics",
    fallbackIcon: "📱",
  },
];

function WriteReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, register: registerUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [companies, setCompanies] = useState(INITIAL_COMPANIES);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [addCompanyModalOpen, setAddCompanyModalOpen] = useState(false);
  const [writeReviewModalOpen, setWriteReviewModalOpen] = useState(false);

  // Reference for detecting click outside search bar
  const searchContainerRef = useRef(null);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [experienceDate, setExperienceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // First Login prompt modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authFirstName, setAuthFirstName] = useState("");
  const [authLastName, setAuthLastName] = useState("");
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Add Company Form state
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyWebsite, setNewCompanyWebsite] = useState("");
  const [newCompanyCategory, setNewCompanyCategory] = useState("Software & Technology");

  useEffect(() => {
    document.title = "Write a Review | ComplaintReview";
  }, []);

  // Pre-load company from url query (?company=slug)
  useEffect(() => {
    const compSlug = searchParams ? searchParams.get("company") : null;
    if (!compSlug) return;

    async function loadPreselectedCompany() {
      try {
        const res = await api.get(`/companies/${compSlug}`);
        if (res?.success && res.data?.company) {
          const c = res.data.company;
          const preselected = {
            id: c.id,
            slug: c.slug,
            name: c.name,
            website: c.websiteUrl || `www.${c.slug}.com`,
            rating: c.overallRating || 4.5,
            reviewCount: c.reviewCount || 0,
            category: c.category?.name || "General",
            fallbackIcon: "🏢",
          };
          setSelectedCompany(preselected);
          setWriteReviewModalOpen(true);
        }
      } catch (err) {
        console.warn("Could not pre-load company from query param:", err);
      }
    }

    loadPreselectedCompany();
  }, [searchParams]);

  // Restore drafted review text from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cr_review_draft");
      if (saved) {
        const d = JSON.parse(saved);
        if (d.title) setReviewTitle(d.title);
        if (d.body) setReviewBody(d.body);
        if (d.rating) setReviewRating(d.rating);
      }
    } catch (e) {}
  }, []);

  // Auto-save draft on change
  useEffect(() => {
    if (reviewTitle || reviewBody) {
      try {
        localStorage.setItem(
          "cr_review_draft",
          JSON.stringify({
            title: reviewTitle,
            body: reviewBody,
            rating: reviewRating,
          })
        );
      } catch (e) {}
    }
  }, [reviewTitle, reviewBody, reviewRating]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live backend API company query with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setDropdownOpen(false);
      return;
    }

    setDropdownOpen(true);

    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/companies?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res?.success && res.data?.companies?.length > 0) {
          const apiCompanies = res.data.companies.map((c) => ({
            id: c.id,
            slug: c.slug,
            name: c.name,
            website: c.websiteUrl || `www.${c.slug || c.name.toLowerCase().replace(/\s+/g, "")}.com`,
            rating: c.overallRating || 0,
            reviewCount: c.reviewCount || 0,
            category: c.category?.name || "General",
            fallbackIcon: "🏢",
          }));

          setCompanies((prev) => {
            const existingNames = new Set(prev.map((p) => p.name.toLowerCase()));
            const newComps = apiCompanies.filter(
              (ac) => !existingNames.has(ac.name.toLowerCase())
            );
            return newComps.length > 0 ? [...prev, ...newComps] : prev;
          });
        }
      } catch {
        // Fallback gracefully to local matches
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter companies based on search
  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenReviewModal = (company) => {
    setSelectedCompany(company);
    setReviewRating(5);
    setReviewHoverRating(0);
    setReviewSubmitted(false);
    setShowAuthModal(false);
    setSubmitError(null);
    setWriteReviewModalOpen(true);
    setDropdownOpen(false);
  };

  const handleAddCompanySubmit = (e) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;

    const formattedWebsite = newCompanyWebsite.trim().startsWith("http")
      ? newCompanyWebsite.trim()
      : `www.${newCompanyWebsite.trim().replace(/^https?:\/\//, "")}`;

    const newComp = {
      id: newCompanyName.toLowerCase().replace(/\s+/g, "-"),
      name: newCompanyName.trim(),
      website: formattedWebsite || `www.${newCompanyName.toLowerCase().replace(/\s+/g, "")}.com`,
      rating: 5.0,
      reviewCount: 0,
      category: newCompanyCategory,
      fallbackIcon: "🏢",
    };

    setCompanies([newComp, ...companies]);
    setNewCompanyName("");
    setNewCompanyWebsite("");
    setAddCompanyModalOpen(false);
    setDropdownOpen(false);

    // Open review modal immediately for this new company
    handleOpenReviewModal(newComp);
  };

  // Perform actual review submission to backend API
  const performReviewSubmission = async (targetCompany = selectedCompany) => {
    if (!targetCompany) return;
    setSubmittingReview(true);
    setSubmitError(null);

    try {
      const payload = {
        companyId: targetCompany.id,
        companySlug: targetCompany.slug || (typeof targetCompany.id === "string" ? targetCompany.id : null),
        companyName: targetCompany.name,
        rating: reviewRating,
        title: reviewTitle.trim(),
        content: reviewBody.trim(),
      };

      const res = await api.post("/reviews", payload);
      if (res?.success) {
        setReviewSubmitted(true);
        setShowAuthModal(false);
        try {
          localStorage.removeItem("cr_review_draft");
        } catch (e) {}
      } else {
        setSubmitError(res?.message || "Failed to publish review. Please try again.");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setSubmitError(err.message || "Failed to submit review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewBody.trim()) return;

    // First Login enforcement! If not logged in, prompt user to log in first
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    await performReviewSubmission();
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      if (authMode === "login") {
        await login(authEmail, authPassword);
      } else {
        await registerUser({
          firstName: authFirstName,
          lastName: authLastName,
          email: authEmail,
          password: authPassword,
        });
      }
      // Successfully authenticated! Proceed with review submission directly
      await performReviewSubmission();
    } catch (err) {
      setAuthError(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      await login("demo@complaint-review.com", "Admin@123456");
      await performReviewSubmission();
    } catch (err) {
      setAuthError(err.message || "Demo login failed");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* 1. HERO SECTION (Harmonized Mint-Emerald Banner - NO overflow-hidden so dropdown is never cut off) */}
      <section className="w-full bg-gradient-to-b from-[#a7f3d0] via-[#bbf7d0] to-[#c7f9db]/80 border-b border-emerald-300/40 py-16 sm:py-20 md:py-24 px-4 text-center relative">
        {/* Background glow wrapped in its own container with overflow-hidden */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/40 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto relative z-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-black text-slate-900 tracking-tight leading-tight">
            Share your experience
          </h1>
          <p className="text-base sm:text-lg text-slate-800 font-medium mt-3 mb-8">
            Help others make the right choice.
          </p>

          {/* Search bar container with high z-index and ref for outside-click */}
          <div ref={searchContainerRef} className="relative max-w-2xl mx-auto z-40">
            <div className="relative flex items-center w-full bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200/80 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/15">
              <Search className="w-5 h-5 text-slate-400 ml-6 mr-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => {
                  if (searchQuery.trim().length > 0) setDropdownOpen(true);
                }}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setDropdownOpen(true);
                }}
                placeholder="Find a company to review"
                className="w-full py-4 sm:py-5 pr-6 bg-transparent text-slate-900 placeholder:text-slate-400 font-normal text-base sm:text-lg outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setDropdownOpen(false);
                  }}
                  className="mr-5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live dropdown results - floating with high z-50, never cut off */}
            {dropdownOpen && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 text-left max-h-96 overflow-y-auto">
                {filteredCompanies.length > 0 ? (
                  <div className="py-2 divide-y divide-slate-100">
                    {filteredCompanies.map((comp) => (
                      <button
                        key={comp.id}
                        type="button"
                        onClick={() => handleOpenReviewModal(comp)}
                        className="w-full px-5 py-3.5 hover:bg-emerald-50/60 flex items-center justify-between text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center text-xl font-bold shrink-0">
                            {comp.fallbackIcon || comp.name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{comp.name}</p>
                            <p className="text-xs text-slate-500">{comp.website}</p>
                          </div>
                        </div>
                        <StarSquares rating={comp.rating} count={comp.reviewCount} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 sm:p-7 text-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold text-slate-900 mb-1">
                      No companies found matching &ldquo;{searchQuery}&rdquo;
                    </p>
                    <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto leading-relaxed">
                      Can&apos;t find this company? Add its listing to be the first to write a verified review.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setNewCompanyName(searchQuery);
                        setAddCompanyModalOpen(true);
                        setDropdownOpen(false);
                      }}
                      className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-6 py-2.5 transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add &ldquo;{searchQuery}&rdquo;</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. READY TO WRITE YOUR REVIEW? SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Ready to write your review?
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select a company below or search above to share your experience.
            </p>
          </div>
        </div>

        {/* Company Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCompanies.slice(0, 4).map((company) => (
            <div
              key={company.id}
              onClick={() => handleOpenReviewModal(company)}
              className="group border border-slate-200/90 rounded-2xl p-4 bg-white hover:border-emerald-400 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Product/Packaging Image Box */}
                <div className="w-full h-36 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-4 relative overflow-hidden group-hover:bg-emerald-50/40 group-hover:border-emerald-100 transition-colors">
                  {company.id === "apple" ? (
                    // Realistic iPhone / Apple Box Mockup inspired by reference
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-28 bg-white border border-slate-300 rounded-lg shadow-sm p-1.5 flex flex-col items-center justify-between">
                        <div className="w-full flex justify-center pt-0.5">
                          <svg className="w-3.5 h-3.5 fill-slate-800" viewBox="0 0 170 170">
                            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.66-7.83-11.91-14.36-5.83-8.91-10.45-18.91-13.86-30-3.41-11.1-5.12-21.57-5.12-31.42 0-14.13 3.69-25.76 11.07-34.89 7.39-9.13 16.59-13.78 27.6-13.96 4.7 0 10.02 1.25 15.96 3.75 5.94 2.5 9.94 3.79 12.01 3.79 1.7 0 5.63-1.29 11.79-3.87 6.16-2.58 11.28-3.79 15.36-3.64 11.53.54 20.84 4.79 27.93 12.75-9.89 6.01-14.75 14.39-14.58 25.13.18 8.44 3.33 15.44 9.46 21 6.13 5.56 13.5 8.79 22.11 9.69-2.01 6.16-4.42 12.26-7.23 18.31zM119.22 31.81c0-6.9 2.54-13.25 7.62-19.05 5.08-5.8 11.39-9.49 18.93-11.07.18 1.16.27 2.19.27 3.09 0 6.8-2.61 13.31-7.83 19.53-5.22 6.22-11.64 9.96-19.26 11.22-.17-1.07-.27-2.07-.27-3.01z" />
                          </svg>
                        </div>
                        <div className="w-14 h-16 bg-slate-900 rounded-md flex items-center justify-center p-1">
                          <div className="w-full h-full bg-slate-800 rounded flex flex-col items-center justify-center text-[7px] text-slate-400 font-mono">
                            <span className="text-white font-bold">iPhone</span>
                          </div>
                        </div>
                        <div className="w-8 h-1 bg-slate-200 rounded-full" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-2xl font-bold text-slate-800">
                      {company.fallbackIcon || company.name[0]}
                    </div>
                  )}
                </div>

                {/* Company Info */}
                <h3 className="font-bold text-slate-950 text-base mt-3 group-hover:text-emerald-600 transition-colors">
                  {company.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{company.website}</p>
              </div>

              {/* Star Rating & Review count */}
              <div className="mt-3 pt-2 border-t border-slate-100">
                <StarSquares
                  rating={company.rating}
                  count={company.reviewCount}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. "CAN'T FIND A COMPANY?" SECTION (App download banner completely excluded per user request) */}
      <section className="py-16 sm:py-20 text-center max-w-xl mx-auto px-4 border-t border-slate-200/80 relative z-10">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
          Can&apos;t find a company?
        </h3>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          It might not be listed on ComplaintReview yet. Add it and be the first to write a review.
        </p>
        <button
          type="button"
          onClick={() => setAddCompanyModalOpen(true)}
          className="rounded-full border-2 border-emerald-600 text-emerald-700 bg-white hover:bg-emerald-600 hover:text-white font-semibold px-7 py-2.5 text-sm transition-all duration-200 mt-6 inline-flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add company</span>
        </button>
      </section>

      {/* 4. ADD COMPANY MODAL */}
      {addCompanyModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setAddCompanyModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-emerald-600 mb-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                New Listing
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Add a new company
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Add a company profile to write the first review and help others make informed choices.
            </p>

            <form onSubmit={handleAddCompanySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Website URL *
                </label>
                <input
                  type="text"
                  required
                  value={newCompanyWebsite}
                  onChange={(e) => setNewCompanyWebsite(e.target.value)}
                  placeholder="e.g. acme.com or www.acme.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={newCompanyCategory}
                  onChange={(e) => setNewCompanyCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm bg-white"
                >
                  <option value="Software & Technology">Software & Technology</option>
                  <option value="Banking & Financial Services">Banking & Financial Services</option>
                  <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                  <option value="Travel & Hospitality">Travel & Hospitality</option>
                  <option value="Health & Wellness">Health & Wellness</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAddCompanyModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-xs font-semibold shadow-xs cursor-pointer transition-colors"
                >
                  Add &amp; Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. WRITE A REVIEW MODAL */}
      {writeReviewModalOpen && selectedCompany && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 my-8">
            <button
              onClick={() => setWriteReviewModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {reviewSubmitted ? (
              <div className="text-center py-6 sm:py-8">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4 animate-bounce" />
                <h3 className="text-2xl font-black text-slate-900">
                  Review Published Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto">
                  Thank you, <strong className="text-slate-900">{user?.firstName || "Community Member"}</strong>! Your authentic review for <strong className="text-slate-900">{selectedCompany.name}</strong> has been saved and is now live on the platform.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/" className="w-full sm:w-auto">
                    <Button variant="emerald" size="md" className="w-full font-bold shadow-md">
                      View on Home Page
                    </Button>
                  </Link>
                  <Link href={`/companies/${selectedCompany.slug || selectedCompany.id}`} className="w-full sm:w-auto">
                    <Button variant="outline" size="md" className="w-full font-semibold">
                      View Company Profile
                    </Button>
                  </Link>
                </div>
              </div>
            ) : showAuthModal ? (
              /* In-Modal Auth Form */
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Sign In to Submit Your Review
                    </h3>
                    <p className="text-xs text-slate-500">
                      Only logged in members can publish to ensure authentic reviews
                    </p>
                  </div>
                </div>

                {/* Draft saved preview */}
                <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                  <div className="line-clamp-1">
                    <span className="font-bold text-slate-900">{selectedCompany.name}</span>
                    <span className="text-slate-400 mx-1.5">•</span>
                    <span className="text-amber-500 font-bold">{"★".repeat(reviewRating)}</span>
                    <span className="text-slate-600 ml-1.5 font-medium">{reviewTitle}</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-bold shrink-0 ml-2 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Draft Preserved
                  </span>
                </div>

                {authError && (
                  <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{authError}</span>
                  </div>
                )}

                {/* Auth Mode Toggle */}
                <div className="flex border-b border-slate-200 mb-4">
                  <button
                    type="button"
                    onClick={() => { setAuthMode("login"); setAuthError(null); }}
                    className={`pb-2 text-xs font-bold transition-colors cursor-pointer border-b-2 mr-4 ${
                      authMode === "login"
                        ? "border-emerald-600 text-emerald-700"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode("register"); setAuthError(null); }}
                    className={`pb-2 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
                      authMode === "register"
                        ? "border-emerald-600 text-emerald-700"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Create Free Account
                  </button>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                  {authMode === "register" && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">First Name</label>
                        <input
                          type="text"
                          required
                          value={authFirstName}
                          onChange={(e) => setAuthFirstName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600"
                          placeholder="Marcus"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          required
                          value={authLastName}
                          onChange={(e) => setAuthLastName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600"
                          placeholder="Vance"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <Button
                      type="submit"
                      variant="emerald"
                      size="md"
                      className="w-full font-bold shadow-xs"
                      disabled={authLoading || submittingReview}
                    >
                      {authLoading || submittingReview ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting Review...
                        </span>
                      ) : authMode === "login" ? (
                        "Sign In & Submit Review"
                      ) : (
                        "Create Account & Submit Review"
                      )}
                    </Button>

                    <button
                      type="button"
                      onClick={handleQuickDemoLogin}
                      disabled={authLoading || submittingReview}
                      className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer text-center"
                    >
                      ⚡ Quick Sign-In as Demo User (Marcus Vance)
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowAuthModal(false)}
                      className="text-xs text-slate-500 hover:text-slate-800 text-center pt-1 cursor-pointer"
                    >
                      Cancel and return to review draft
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                {/* Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center text-2xl font-bold">
                    {selectedCompany.fallbackIcon || selectedCompany.name[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                      {selectedCompany.name}
                    </h3>
                    <p className="text-xs text-slate-500">{selectedCompany.website}</p>
                  </div>
                </div>

                {!user && (
                  <div className="mb-4 p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Writing as a guest. When you submit, you will be prompted to sign in so your review is authenticated.
                    </span>
                  </div>
                )}

                {submitError && (
                  <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{submitError}</span>
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Star selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Rate your recent experience *
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((starIndex) => {
                        const activeRating = reviewHoverRating || reviewRating;
                        const isFilled = starIndex <= activeRating;
                        let boxBg = "bg-slate-200";
                        if (isFilled) {
                          if (activeRating >= 5) boxBg = "bg-emerald-600";
                          else if (activeRating === 4) boxBg = "bg-emerald-500";
                          else if (activeRating === 3) boxBg = "bg-amber-500";
                          else if (activeRating === 2) boxBg = "bg-orange-500";
                          else boxBg = "bg-rose-500";
                        }

                        return (
                          <button
                            key={starIndex}
                            type="button"
                            onMouseEnter={() => setReviewHoverRating(starIndex)}
                            onMouseLeave={() => setReviewHoverRating(0)}
                            onClick={() => setReviewRating(starIndex)}
                            className={`w-9 h-9 rounded-md flex items-center justify-center transition-all cursor-pointer ${boxBg} hover:scale-105`}
                          >
                            <svg className="w-5 h-5 fill-white text-white" viewBox="0 0 24 24">
                              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                            </svg>
                          </button>
                        );
                      })}
                      <span className="text-xs font-bold text-slate-700 ml-2">
                        {reviewRating} of 5 stars
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Give your review a title *
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="What's most important to know?"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm"
                    />
                  </div>

                  {/* Body */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tell us about your experience *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={reviewBody}
                      onChange={(e) => setReviewBody(e.target.value)}
                      placeholder="What made your experience great or what could be improved? Keep it honest and helpful."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm resize-none"
                    />
                  </div>

                  {/* Date of experience */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Date of experience
                    </label>
                    <input
                      type="date"
                      value={experienceDate}
                      onChange={(e) => setExperienceDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs text-slate-700 bg-white"
                    />
                  </div>

                  {/* Submit buttons */}
                  <div className="pt-3 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setWriteReviewModalOpen(false)}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <Button
                      type="submit"
                      variant="emerald"
                      size="md"
                      disabled={submittingReview}
                      className="font-bold shadow-xs cursor-pointer gap-1.5"
                    >
                      {submittingReview ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Publishing...
                        </>
                      ) : !user ? (
                        <>
                          <Lock className="w-4 h-4" />
                          Sign In &amp; Submit Review
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Submit Verified Review
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function WriteReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      }
    >
      <WriteReviewContent />
    </Suspense>
  );
}
