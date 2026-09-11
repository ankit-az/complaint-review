"use client";

import React, { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Share2,
  Bookmark,
  CheckCircle2,
  FolderOpen,
} from "lucide-react";
import BlogNavbar from "@/components/blog/BlogNavbar";
import Pagination from "@/components/ui/Pagination";
import api from "@/lib/api";

export default function BlogDynamicRoute({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug;

  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setNotFound(false);

        // 1. Fetch categories from backend API
        const catRes = await api.get("/blogs/categories");
        const loadedCategories =
          catRes?.success && Array.isArray(catRes.data?.categories)
            ? catRes.data.categories
            : [];
        if (isMounted) setCategories(loadedCategories);

        // 2. Check if slug matches a category archive
        const categoryMatch = loadedCategories.find(
          (c) => c.slug === slug || c.id === slug
        );

        if (categoryMatch && categoryMatch.slug !== "featured") {
          // Fetch articles in this category
          const postsRes = await api.get(
            `/blogs?category=${categoryMatch.slug}&limit=50`
          );
          if (
            isMounted &&
            postsRes?.success &&
            Array.isArray(postsRes.data?.posts)
          ) {
            setPosts(postsRes.data.posts);
          }
        } else {
          // Fetch single article from backend API
          const articleRes = await api.get(`/blogs/${slug}`).catch(() => null);
          if (isMounted && articleRes?.success && articleRes.data?.post) {
            const currentPost = articleRes.data.post;
            setPost(currentPost);

            // Fetch related articles in same category
            const relRes = await api
              .get(`/blogs?category=${currentPost.categorySlug}&limit=4`)
              .catch(() => null);
            if (
              isMounted &&
              relRes?.success &&
              Array.isArray(relRes.data?.posts)
            ) {
              setRelatedPosts(
                relRes.data.posts
                  .filter((p) => p.slug !== currentPost.slug)
                  .slice(0, 3)
              );
            }
          } else if (isMounted) {
            setNotFound(true);
          }
        }
      } catch (err) {
        console.error("Failed to load blog resource from API:", err);
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] text-slate-900 flex flex-col">
        <BlogNavbar activeCategory={slug} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-6">
          <div className="h-6 w-32 bg-stone-200/80 rounded-md animate-pulse" />
          <div className="h-10 w-3/4 bg-stone-200/80 rounded-xl animate-pulse" />
          <div className="h-64 sm:h-80 w-full bg-stone-200/80 rounded-2xl animate-pulse" />
          <div className="space-y-3 pt-6">
            <div className="h-4 w-full bg-stone-200/80 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-stone-200/80 rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-stone-200/80 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // 1. Check if slug matched a category archive
  const categoryMatch = categories.find(
    (c) => c.slug === slug || c.id === slug
  );

  if (categoryMatch && categoryMatch.slug !== "featured") {
    return <CategoryArchiveView category={categoryMatch} posts={posts} />;
  }

  // 2. If not found or no post
  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-[#faf8f5] text-slate-900 flex flex-col">
        <BlogNavbar activeCategory="featured" />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
          <FolderOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h1 className="text-2xl font-black text-[#001736]">
            Article or Category Not Found
          </h1>
          <p className="text-sm text-slate-600">
            The blog article or category you requested does not exist or has
            been moved.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#001736] text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog Home
          </Link>
        </div>
      </div>
    );
  }

  // 3. Render Article Detail View
  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 flex flex-col">
      <BlogNavbar activeCategory={post.categorySlug} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
          <Link href="/blog" className="text-emerald-800 hover:underline">
            Blog
          </Link>
          <span>/</span>
          <Link
            href={`/blog/${post.categorySlug}`}
            className="text-emerald-800 hover:underline"
          >
            {post.categoryName || post.categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-slate-400 truncate max-w-[200px] sm:max-w-none">
            {post.title}
          </span>
        </div>

        {/* Category Pill */}
        <div className="mb-4">
          <Link
            href={`/blog/${post.categorySlug}`}
            className="inline-block bg-[#001736] hover:bg-slate-800 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-colors"
          >
            {post.categoryName || post.categoryLabel}
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#001736] tracking-tight leading-tight mb-6">
          {post.title}
        </h1>

        {/* Meta & Author Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-200 mb-8 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <img
              src={post.author?.avatar}
              alt={post.author?.name}
              className="w-11 h-11 rounded-full object-cover border border-stone-300 shadow-2xs"
            />
            <div>
              <p className="font-bold text-slate-900 text-sm">
                {post.author?.name}
              </p>
              <p className="text-slate-500 text-[11px]">{post.author?.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Hero Featured Image */}
        <div className="rounded-2xl overflow-hidden mb-10 shadow-sm border border-stone-200">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-72 sm:h-96 object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-stone-200/80 shadow-2xs space-y-6 text-base text-slate-700 leading-relaxed">
          <p className="text-lg font-medium text-slate-800 leading-relaxed border-b border-stone-100 pb-6">
            {post.excerpt}
          </p>

          {post.content ? (
            post.content.split("\n\n").map((para, idx) => (
              <p key={idx} className="whitespace-pre-line leading-relaxed">
                {para.trim()}
              </p>
            ))
          ) : (
            <p className="whitespace-pre-line leading-relaxed">{post.excerpt}</p>
          )}

          {/* Pullquote */}
          <div className="bg-[#fbf5ed] border-l-4 border-emerald-600 p-6 rounded-r-2xl my-8">
            <p className="text-base font-semibold text-[#001736] italic mb-1">
              &quot;True consumer trust is never built on an artificial 5.0 score—it is forged in transparent, accountable problem resolution when issues arise.&quot;
            </p>
            <span className="text-xs text-slate-500 font-medium">
              — Complaint-Review Trust &amp; Safety Team
            </span>
          </div>

          <h2 className="text-2xl font-bold text-[#001736] pt-4">
            Key Takeaways for Consumers and Ethical Merchants
          </h2>
          <ul className="list-disc list-inside space-y-2.5 text-slate-600 pl-2">
            <li>
              <strong>Always look for Verified Buyer badges:</strong> Confirmed
              receipts prove real transaction history.
            </li>
            <li>
              <strong>Inspect the company&apos;s response rate:</strong> How brands
              handle 2-star and 3-star complaints reveals their authentic customer
              service ethos.
            </li>
            <li>
              <strong>Beware of sudden positive volume spikes:</strong> An
              abnormal wave of uniform praise within 48 hours is often a red flag
              for review manipulation.
            </li>
          </ul>
        </div>

        {/* Social Sharing & Action bar */}
        <div className="flex items-center justify-between py-6 mt-8 border-y border-stone-200 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                isBookmarked
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : "bg-white border-stone-200 hover:bg-stone-50 text-slate-700"
              }`}
            >
              <Bookmark
                className={`w-3.5 h-3.5 ${isBookmarked ? "fill-emerald-700" : ""}`}
              />
              {isBookmarked ? "Saved" : "Save article"}
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-slate-700 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copied ? "Link copied!" : "Share"}
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Verified Editorial Article</span>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-stone-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#001736] tracking-tight">
                More in {post.categoryName || post.categoryLabel}
              </h3>
              <Link
                href={`/blog/${post.categorySlug}`}
                className="text-xs font-bold text-emerald-800 hover:underline"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      {r.date}
                    </span>
                    <h4 className="text-sm font-bold text-[#001736] group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2">
                      {r.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {r.excerpt}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-800">
                    <span>Read article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#001736] text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Blog Categories
          </Link>
        </div>
      </article>
    </div>
  );
}

// Category Archive View Component with Next/Prev Pagination
function CategoryArchiveView({ category, posts }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // 3 stories per page to test pagination smoothly
  const sectionRef = useRef(null);

  const categoryPosts = posts.filter((p) => p.categorySlug === category.slug);
  const totalPages = Math.max(1, Math.ceil(categoryPosts.length / itemsPerPage));

  // Slice for current page
  const currentPosts = categoryPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 flex flex-col">
      <BlogNavbar activeCategory={category.slug} />

      <div
        ref={sectionRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full space-y-10"
      >
        {/* Category Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-2xs">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Featured
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#001736] tracking-tight mb-2">
                {category.label || category.name}
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                {category.description}
              </p>
            </div>

            <div className="shrink-0 bg-[#faf8f5] px-5 py-3 rounded-2xl border border-stone-200 text-center">
              <span className="text-2xl font-black text-[#001736] block">
                {categoryPosts.length}
              </span>
              <span className="text-xs text-slate-500 font-medium">Articles</span>
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-8">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <h2 className="text-xl font-bold text-[#001736] tracking-tight">
              All Stories in {category.label || category.name}
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-block bg-[#001736]/90 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {category.label || category.name}
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
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="pt-8 flex flex-col items-center gap-3">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
              <p className="text-xs text-slate-500">
                Showing articles {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, categoryPosts.length)} of{" "}
                {categoryPosts.length}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
