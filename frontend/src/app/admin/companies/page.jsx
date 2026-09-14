"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  Building2,
  Search,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Filter,
  RefreshCw,
  Ban,
  RotateCcw,
  Star,
  Globe,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Pagination from "@/components/ui/Pagination";

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [isVerifiedFilter, setIsVerifiedFilter] = useState("ALL");
  const [isClaimedFilter, setIsClaimedFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchCompanies = async (currentPage = page) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage,
        limit: 15,
      });

      if (search.trim()) params.append("search", search.trim());
      if (isVerifiedFilter !== "ALL") params.append("isVerified", isVerifiedFilter);
      if (isClaimedFilter !== "ALL") params.append("isClaimed", isClaimedFilter);

      const res = await api.get(`/admin/companies?${params.toString()}`);
      if (res?.success && res.data) {
        setCompanies(res.data.companies || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setTotalCount(res.data.pagination?.total || 0);
      } else {
        setError(res?.message || "Failed to load companies");
      }
    } catch (err) {
      console.error("Fetch companies error:", err);
      setError(err.message || "Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies(1);
    setPage(1);
  }, [isVerifiedFilter, isClaimedFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCompanies(1);
    setPage(1);
  };

  const handleToggleVerification = async (companyId, currentVerified) => {
    try {
      const res = await api.patch(`/admin/companies/${companyId}`, {
        isVerified: !currentVerified,
      });
      if (res?.success) {
        setActionMessage(`Company verification ${!currentVerified ? "granted" : "revoked"}`);
        setTimeout(() => setActionMessage(null), 3000);
        fetchCompanies(page);
      }
    } catch (err) {
      alert("Failed to update verification: " + err.message);
    }
  };

  const handleToggleSuspension = async (companyId, currentSuspended) => {
    const action = currentSuspended ? "reinstate" : "suspend";
    if (!window.confirm(`Are you sure you want to ${action} this company?`)) return;
    try {
      const res = await api.patch(`/admin/companies/${companyId}`, {
        isSuspended: !currentSuspended,
      });
      if (res?.success) {
        setActionMessage(`Company successfully ${currentSuspended ? "reinstated" : "suspended"}`);
        setTimeout(() => setActionMessage(null), 3000);
        fetchCompanies(page);
      }
    } catch (err) {
      alert("Failed to update suspension: " + err.message);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-purple-400" />
            Companies Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Directory curation, enterprise verification badges, and listing status oversight.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">
            Total Enterprises: <strong className="text-white">{totalCount}</strong>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchCompanies(page)}
            className="border-slate-700 text-slate-300 text-xs gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {actionMessage}
          </span>
          <button onClick={() => setActionMessage(null)}>✕</button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company by name or slug..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </form>

        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto text-xs">
          <div className="flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400 font-semibold text-[11px]">Verification:</span>
            <select
              value={isVerifiedFilter}
              onChange={(e) => setIsVerifiedFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">All Companies</option>
              <option value="true">Verified Only</option>
              <option value="false">Unverified</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-slate-400 font-semibold text-[11px]">Claim Status:</span>
            <select
              value={isClaimedFilter}
              onChange={(e) => setIsClaimedFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">All Listings</option>
              <option value="true">Claimed</option>
              <option value="false">Unclaimed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-3" />
            Loading enterprise directory...
          </div>
        ) : companies.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No companies matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Score &amp; Reviews</th>
                  <th className="py-3.5 px-4">Ownership</th>
                  <th className="py-3.5 px-4">Verified Badge</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {companies.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-200 shrink-0">
                          {c.name?.[0] || "C"}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span className="truncate">{c.name}</span>
                            {c.isSuspended && (
                              <Badge variant="rose" size="sm">Suspended</Badge>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono">/{c.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      {c.category?.name || "Uncategorized"}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-bold text-white">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{c.overallRating?.toFixed(1) || "0.0"}</span>
                        <span className="text-slate-500 font-normal">({c._count?.reviews || c.reviewCount || 0})</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={c.isClaimed ? "emerald" : "outline"} size="sm">
                        {c.isClaimed ? "Claimed" : "Unclaimed"}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleVerification(c.id, c.isVerified)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer border ${
                          c.isVerified
                            ? "bg-emerald-950/80 border-emerald-700 text-emerald-300 hover:bg-emerald-900"
                            : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white"
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {c.isVerified ? "Verified" : "Unverified"}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/companies/${c.slug}`}
                          target="_blank"
                          title="View Public Profile"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleToggleSuspension(c.id, c.isSuspended)}
                          title={c.isSuspended ? "Reinstate Company" : "Suspend Company"}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            c.isSuspended
                              ? "text-emerald-400 hover:bg-emerald-950/40"
                              : "text-slate-400 hover:text-rose-400 hover:bg-rose-950/30"
                          }`}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => {
                setPage(newPage);
                fetchCompanies(newPage);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
