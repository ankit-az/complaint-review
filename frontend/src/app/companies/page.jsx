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
} from "lucide-react";
import Card from "@/components/ui/Card";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async (query = "") => {
    setLoading(true);
    try {
      const endpoint = query ? `/companies?q=${encodeURIComponent(query)}` : "/companies";
      const res = await api.get(endpoint);
      if (res?.success && res.data?.companies) {
        setCompanies(res.data.companies);
      }
    } catch (err) {
      console.error("Failed to load companies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCompanies(searchTerm);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Directory
          </p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Explore Registered Companies
          </h1>
          <p className="mt-2 text-xs text-slate-500 max-w-xl">
            Check company trust ratings, customer complaints, and review distributions.
          </p>
        </div>

        <form onSubmit={handleSearch} className="w-full md:w-80">
          <Input
            icon={Search}
            placeholder="Filter companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No companies found</p>
          <p className="text-xs text-slate-500 mt-1">Try a different search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((comp) => (
            <Link
              key={comp.id}
              href={`/companies/${comp.slug}`}
              className="group block"
            >
              <Card
                hover
                className="h-full border-slate-200/80 group-hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-base shrink-0 group-hover:bg-emerald-600 transition-colors">
                        {comp.name ? comp.name[0].toUpperCase() : "C"}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {comp.name}
                        </h3>
                        {comp.category && (
                          <span className="text-[11px] font-semibold text-slate-500">
                            {comp.category.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {comp.isVerified && (
                      <Badge variant="verified" size="sm">
                        Verified
                      </Badge>
                    )}
                  </div>

                  <p className="mt-4 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {comp.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <StarRating rating={comp.overallRating} size="sm" showScore />
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-medium">
                      {comp.reviewCount} reviews
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
      )}
    </div>
  );
}
