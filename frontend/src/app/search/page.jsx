"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  Search,
  Building2,
  FolderOpen,
  ArrowRight,
  Star,
  CheckCircle2,
} from "lucide-react";
import Card from "@/components/ui/Card";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState({ companies: [], categories: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSearchInput(query);
    if (!query.trim()) return;

    async function performSearch() {
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        if (res?.success && res.data) {
          setResults({
            companies: res.data.companies || [],
            categories: res.data.categories || [],
          });
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }
    performSearch();
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Search Directory
        </h1>
        <p className="mt-2 text-xs text-slate-500">
          Find businesses, service providers, and categories across ComplaintReview.
        </p>

        <form onSubmit={handleSearch} className="mt-6 flex items-center gap-2">
          <Input
            icon={Search}
            placeholder="Search company or category..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="text-base py-3"
          />
          <Button type="submit" variant="emerald" size="lg" className="px-6 shrink-0">
            Search
          </Button>
        </form>
      </div>

      {/* Query Result Details */}
      {query && (
        <div className="mb-8">
          <p className="text-xs text-slate-500">
            Showing results for: <span className="font-bold text-slate-900">"{query}"</span>
          </p>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : query && results.companies.length === 0 && results.categories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No matching results</p>
          <p className="text-xs text-slate-500 mt-1">
            Try searching for "Stripe", "Hosting", or browse categories.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Matching Companies */}
          {results.companies.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                Companies ({results.companies.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.companies.map((comp) => (
                  <Link
                    key={comp.id}
                    href={`/companies/${comp.slug}`}
                    className="group block"
                  >
                    <Card hover className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-sm shrink-0 group-hover:bg-emerald-600 transition-colors">
                          {comp.name[0].toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {comp.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <StarRating rating={comp.overallRating} size="sm" showScore />
                            <span className="text-slate-300">•</span>
                            <span className="text-[11px] text-slate-500">
                              {comp.reviewCount} reviews
                            </span>
                          </div>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Matching Categories */}
          {results.categories.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-emerald-600" />
                Categories ({results.categories.length})
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {results.categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="group block"
                  >
                    <Card hover className="p-4 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                        {cat.name}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
