"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Calendar,
  Search,
  Sparkles,
  ShieldCheck,
  Building2,
  FileCheck,
  CheckCircle2,
  Mail,
  TrendingUp,
  Star,
} from "lucide-react";
import BlogNavbar from "@/components/blog/BlogNavbar";
import Pagination from "@/components/ui/Pagination";
import api from "@/lib/api";

export default function BlogHomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPage, setSearchPage] = useState(1);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  // Fetch all articles from backend API
  useEffect(() => {
    let isMounted = true;
    async function loadBackendBlogs() {
      try {
        setLoading(true);
        const res = await api.get("/blogs?limit=50");
        if (isMounted && res?.success && Array.isArray(res.data?.posts)) {
          setPosts(res.data.posts);
        }
      } catch (err) {
        console.error("Failed to load blog posts from API:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadBackendBlogs();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter posts by search query if user searches
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.categoryName?.toLowerCase().includes(q) ||
        p.categoryLabel?.toLowerCase().includes(q)
    );
  }, [searchQuery, posts]);

  // Group posts by category
  const trendsPosts = useMemo(
    () => posts.filter((p) => p.categorySlug === "trends-in-trust").slice(0, 3),
    [posts]
  );
  const reviewsMatterPosts = useMemo(
    () => posts.filter((p) => p.categorySlug === "reviews-matter").slice(0, 3),
    [posts]
  );
  const buyConfidencePosts = useMemo(
    () => posts.filter((p) => p.categorySlug === "buy-with-confidence").slice(0, 3),
    [posts]
  );
  const trustStoriesPosts = useMemo(
    () => posts.filter((p) => p.categorySlug === "trust-stories").slice(0, 3),
    [posts]
  );

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 flex flex-col">
      {/* SECOND NAVBAR (Directly underneath main site Navbar) */}
      <BlogNavbar
        activeCategory="featured"
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setSearchPage(1);
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full space-y-16">
        {/* SEARCH RESULTS VIEW (If searching) */}
        {searchResults !== null ? (
          <div>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
              <div>
                <h2 className="text-2xl font-black text-[#001736] tracking-tight">
                  Search Results for &quot;{searchQuery}&quot;
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Found {searchResults.length} {searchResults.length === 1 ? "article" : "articles"}
                </p>
              </div>
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Clear search
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 shadow-2xs">
                <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 mb-1">No matching articles</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  We could not find any stories matching your search query. Try another keyword.
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 bg-[#001736] text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Reset search
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {searchResults
                    .slice((searchPage - 1) * 6, searchPage * 6)
                    .map((post) => (
                      <ArticleCard key={post.id} post={post} />
                    ))}
                </div>
                {Math.ceil(searchResults.length / 6) > 1 && (
                  <div className="pt-8 flex justify-center">
                    <Pagination
                      currentPage={searchPage}
                      totalPages={Math.ceil(searchResults.length / 6)}
                      onPageChange={(p) => setSearchPage(p)}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <>
            {/* HERO SECTION: AD / SHOWCASE ABOUT OUR WEBSITE */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#001736] via-[#05224d] to-[#01142d] text-white rounded-3xl p-8 sm:p-12 lg:p-14 shadow-xl border border-slate-800">
              {/* Background ambient accents */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 left-20 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left pitch */}
                <div className="lg:col-span-7 space-y-5">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white">
                    Real Reviews. Authentic Feedback.
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                      Zero Paid Censorship.
                    </span>
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
                    Complaint-Review is the independent consumer platform where genuine transactions speak louder than marketing budgets. We verify real purchase receipts, audit anomaly spikes, and prohibit pay-to-delete schemes so you can always buy with total peace of mind.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-3">
                    <Link
                      href="/companies"
                      className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-[#001736] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md hover:scale-[1.02]"
                    >
                      <Building2 className="w-4 h-4" />
                      Explore Verified Companies
                    </Link>
                    <Link
                      href="/writereview"
                      className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all border border-white/20"
                    >
                      <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                      Write a Genuine Review
                    </Link>
                    <Link
                      href="/transparency"
                      className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white underline underline-offset-4 py-2"
                    >
                      Our Anti-Fraud Technology →
                    </Link>
                  </div>
                </div>

                {/* Right highlight metrics / cards */}
                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h2 className="text-sm font-bold text-white mb-1">100% Unbribable</h2>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Businesses cannot pay us to remove negative reviews or alter their genuine rating.
                    </p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl">
                    <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center mb-3">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <h2 className="text-sm font-bold text-white mb-1">Receipt Auditing</h2>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Verified customer receipts receive cryptographic badges that buyers trust.
                    </p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center mb-3">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <h2 className="text-sm font-bold text-white mb-1">Dispute Support</h2>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Public resolution channels bridge customer complaints with corporate action.
                    </p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center mb-3">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h2 className="text-sm font-bold text-white mb-1">AI Anti-Fraud</h2>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Behavioral telemetry automatically detects AI spam and astroturfing rings.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 1: TRENDS IN TRUST */}
            <section className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h2 className="text-2xl font-black text-[#001736] tracking-tight">
                    Trends in Trust
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    The latest industry analysis on consumer behavior, verification, and AI moderation
                  </p>
                </div>
                <Link
                  href="/blog/trends-in-trust"
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
                >
                  See more
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {loading && posts.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-72 rounded-2xl bg-stone-200/70 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {trendsPosts.map((post) => (
                    <ArticleCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </section>

            {/* SECTION 2: REVIEWS MATTER */}
            <section className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h2 className="text-2xl font-black text-[#001736] tracking-tight">
                    Reviews Matter
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Why authentic customer feedback fuels ethical business growth and consumer empowerment
                  </p>
                </div>
                <Link
                  href="/blog/reviews-matter"
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
                >
                  See more
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {loading && posts.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-72 rounded-2xl bg-stone-200/70 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {reviewsMatterPosts.map((post) => (
                    <ArticleCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </section>

            {/* SECTION 3: BUY WITH CONFIDENCE */}
            <section className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h2 className="text-2xl font-black text-[#001736] tracking-tight">
                    Buy With Confidence
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Practical checklists, scam warnings, and shopping safety guidelines for smart buyers
                  </p>
                </div>
                <Link
                  href="/blog/buy-with-confidence"
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
                >
                  See more
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {loading && posts.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-72 rounded-2xl bg-stone-200/70 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {buyConfidencePosts.map((post) => (
                    <ArticleCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </section>

            {/* SECTION 4: TRUST STORIES */}
            <section className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h2 className="text-2xl font-black text-[#001736] tracking-tight">
                    Trust Stories
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-world accounts of consumers and companies uniting to resolve complaints
                  </p>
                </div>
                <Link
                  href="/blog/trust-stories"
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
                >
                  See more
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {loading && posts.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-72 rounded-2xl bg-stone-200/70 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {trustStoriesPosts.map((post) => (
                    <ArticleCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* NEWSLETTER DIGEST */}
        <div className="bg-[#001736] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-lg">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
              Stay ahead of consumer trends & verification insights
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Join over 45,000 consumers and business leaders who receive our weekly breakdown on online trust, anti-fraud algorithms, and reputation management.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 bg-emerald-900/60 border border-emerald-500/40 px-4 py-3 rounded-xl text-emerald-200 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You are subscribed! We will send our next edition directly to your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white text-slate-900 text-xs sm:text-sm pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-[#001736] font-bold text-xs sm:text-sm rounded-xl transition-colors shrink-0 cursor-pointer shadow-sm"
                >
                  Subscribe Free
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Article Card Component
function ArticleCard({ post }) {
  return (
    <article className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group">
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-block bg-[#001736]/90 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            {post.categoryName || post.categoryLabel}
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2.5">
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-[#001736] tracking-tight leading-snug mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
            {post.excerpt}
          </p>
        </div>

        <div className="pt-4 border-t border-stone-100 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <img
              src={post.author?.avatar}
              alt={post.author?.name}
              className="w-7 h-7 rounded-full object-cover border border-stone-200"
            />
            <span className="text-xs font-semibold text-slate-800">
              {post.author?.name}
            </span>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
          >
            Read
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}
