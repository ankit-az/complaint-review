"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import api from "@/lib/api";

const DEFAULT_BLOG_TABS = [
  { id: "featured", slug: "featured", href: "/blog", label: "Featured" },
  { id: "trends-in-trust", slug: "trends-in-trust", href: "/blog/trends-in-trust", label: "Trends in Trust" },
  { id: "reviews-matter", slug: "reviews-matter", href: "/blog/reviews-matter", label: "Reviews Matter" },
  { id: "buy-with-confidence", slug: "buy-with-confidence", href: "/blog/buy-with-confidence", label: "Buy With Confidence" },
  { id: "trust-stories", slug: "trust-stories", href: "/blog/trust-stories", label: "Trust Stories" },
];

export default function BlogNavbar({
  activeCategory = "featured",
  searchQuery = "",
  onSearchChange,
}) {
  const router = useRouter();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [categories, setCategories] = useState(DEFAULT_BLOG_TABS);

  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        const res = await api.get("/blogs/categories");
        if (isMounted && res?.success && Array.isArray(res.data?.categories)) {
          setCategories(res.data.categories);
        }
      } catch {
        // Keeps default navigation tabs
      }
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(localSearch);
    } else if (localSearch.trim()) {
      router.push(`/blog?search=${encodeURIComponent(localSearch.trim())}`);
    }
  };

  return (
    <div className="w-full bg-[#fbf5ed] border-b border-[#ebdcd0] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-3 lg:py-0 gap-3">
          {/* Left section: Blog Title + Category Links */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 lg:gap-8 overflow-x-auto no-scrollbar">
            {/* Blog Brand Heading */}
            <Link
              href="/blog"
              className="font-extrabold text-lg sm:text-xl text-[#001736] tracking-tight whitespace-nowrap hover:opacity-90 py-2.5 transition-opacity"
            >
              The Complaint-Review Blog
            </Link>

            {/* Navigation Category Tabs */}
            <nav className="flex items-center gap-5 sm:gap-7 overflow-x-auto whitespace-nowrap">
              {categories.map((cat) => {
                const isActive =
                  activeCategory === cat.slug ||
                  activeCategory === cat.id ||
                  (activeCategory === "" && cat.slug === "featured");

                return (
                  <Link
                    key={cat.id}
                    href={cat.href || `/blog/${cat.slug}`}
                    className={`relative text-xs sm:text-sm py-3 transition-colors ${
                      isActive
                        ? "font-bold text-[#001736]"
                        : "font-medium text-slate-600 hover:text-[#001736]"
                    }`}
                  >
                    {cat.label || cat.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#001736] rounded-t-xs" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right section: Search Articles */}
          <div className="py-2 lg:py-3 flex items-center justify-end">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
              <input
                type="text"
                value={onSearchChange ? searchQuery : localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  if (onSearchChange) onSearchChange(e.target.value);
                }}
                placeholder="Search articles"
                className="w-full bg-white border border-[#d6cfc5] rounded-xs px-3.5 py-2 pr-9 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#001736] focus:ring-1 focus:ring-[#001736]/20 transition-all shadow-2xs"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
