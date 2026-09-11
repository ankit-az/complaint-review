"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  Building2,
  Search,
  CheckCircle2,
  ExternalLink,
  Star,
  FolderOpen,
  Sparkles,
} from "lucide-react";
import Card from "@/components/ui/Card";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Pagination from "@/components/ui/Pagination";

function CompanyLogo({ src, name }) {
  const [hasError, setHasError] = useState(false);
  const initial = name ? name[0].toUpperCase() : "C";

  if (!src || hasError) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white font-black text-base shrink-0 shadow-xs">
        {initial}
      </div>
    );
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-900 font-bold text-base shrink-0 overflow-hidden p-1.5 shadow-xs group-hover:border-emerald-500/50 transition-colors">
      <img
        src={src}
        alt={name}
        className="h-full w-full object-contain"
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 12;

  const fetchCompanies = async (query = "", page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      params.set("page", page.toString());
      params.set("limit", limit.toString());

      const res = await api.get(`/companies?${params.toString()}`);
      if (res?.success && res.data?.companies) {
        setCompanies(res.data.companies);
        if (res.data.pagination) {
          setCurrentPage(res.data.pagination.page || page);
          setTotalPages(res.data.pagination.totalPages || 1);
          setTotalCount(res.data.pagination.total || res.data.companies.length);
        }
      }
    } catch (err) {
      console.error("Failed to load companies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies(searchTerm, currentPage);
  }, [currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCompanies(searchTerm, 1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Directory
          </p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Explore Registered Companies
          </h1>
          <p className="mt-1 text-xs text-slate-500 max-w-xl">
            {totalCount > 0 ? (
              <span>Showing {companies.length} of {totalCount} total verified & unclaimed company profiles.</span>
            ) : (
              <span>Check company trust ratings, customer complaints, and review distributions.</span>
            )}
          </p>
        </div>

        <form onSubmit={handleSearch} className="w-full md:w-80 flex gap-2">
          <Input
            icon={Search}
            placeholder="Search companies (e.g. Google)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-base font-bold text-slate-800">No companies found</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn't find any companies matching "{searchTerm}". Try a different keyword or check your spelling.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((comp) => (
              <Link
                key={comp.id}
                href={`/companies/${comp.slug}`}
                className="group block"
              >
                <Card
                  hover
                  className="h-full border-slate-200/80 group-hover:border-emerald-500/40 transition-all flex flex-col justify-between bg-white rounded-2xl p-6"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <CompanyLogo src={comp.logoUrl} name={comp.name} />
                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                            {comp.name}
                          </h3>
                          {comp.category && (
                            <span className="text-[11px] font-semibold text-slate-500 truncate block">
                              {comp.category.name}
                            </span>
                          )}
                        </div>
                      </div>

                      {comp.isVerified ? (
                        <Badge variant="verified" size="sm">
                          Verified
                        </Badge>
                      ) : !comp.isClaimed ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                          Unclaimed
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-4 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {comp.description || "Official business profile listed on ComplaintReview."}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <StarRating rating={comp.overallRating} size="sm" showScore />
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 font-medium">
                        {comp.reviewCount || 0} reviews
                      </span>
                    </div>

                    <span className="font-semibold text-emerald-600 group-hover:underline">
                      View profile →
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500 font-medium order-2 sm:order-1">
                Showing page <span className="font-bold text-slate-800">{currentPage}</span> of{" "}
                <span className="font-bold text-slate-800">{totalPages}</span> ({totalCount} total listings)
              </p>
              <div className="order-1 sm:order-2">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
