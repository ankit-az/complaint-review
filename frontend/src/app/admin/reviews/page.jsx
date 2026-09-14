"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/ui/StarRating";
import {
  MessageSquareQuote,
  Search,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Building2,
  ExternalLink,
  Filter,
  Check,
  Flag,
  RotateCcw,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedCompany, setSelectedCompany] = useState("ALL");
  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [reviewsRes, companiesRes] = await Promise.all([
        api.get("/admin/reviews?limit=50"),
        api.get("/companies?limit=50"),
      ]);

      if (reviewsRes?.success && reviewsRes.data?.reviews) {
        setReviews(reviewsRes.data.reviews);
      }
      if (companiesRes?.success && companiesRes.data?.companies) {
        setAvailableCompanies(companiesRes.data.companies);
      }
    } catch (err) {
      console.error("Admin reviews fetch error:", err);
      setError(err.message || "Failed to load admin reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Update Review Status
  const handleUpdateStatus = async (reviewId, newStatus) => {
    try {
      const res = await api.patch(`/admin/reviews/${reviewId}/status`, {
        status: newStatus,
      });
      if (res?.success) {
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, status: newStatus } : r))
        );
        setActionMessage(`Review marked as ${newStatus}`);
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      alert(err.message || "Failed to update review status");
    }
  };

  // Toggle Verification Status
  const handleToggleVerification = async (reviewId, currentVerification) => {
    const nextStatus = currentVerification === "VERIFIED" ? "UNVERIFIED" : "VERIFIED";
    try {
      const res = await api.patch(`/admin/reviews/${reviewId}/status`, {
        verificationStatus: nextStatus,
      });
      if (res?.success) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId ? { ...r, verificationStatus: nextStatus } : r
          )
        );
        setActionMessage(`Verification status set to ${nextStatus}`);
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      alert(err.message || "Failed to toggle verification");
    }
  };

  // Delete Review Permanently
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to permanently delete this review?")) return;
    try {
      const res = await api.delete(`/admin/reviews/${reviewId}`);
      if (res?.success) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        setActionMessage("Review permanently deleted");
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      alert(err.message || "Failed to delete review");
    }
  };

  // Filter reviews client-side
  const filteredReviews = reviews.filter((r) => {
    const matchesStatus =
      statusFilter === "ALL" || r.status === statusFilter;
    const matchesCompany =
      selectedCompany === "ALL" || r.company?.slug === selectedCompany;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      r.title?.toLowerCase().includes(query) ||
      r.content?.toLowerCase().includes(query) ||
      r.company?.name?.toLowerCase().includes(query) ||
      r.user?.email?.toLowerCase().includes(query) ||
      r.user?.firstName?.toLowerCase().includes(query) ||
      r.user?.lastName?.toLowerCase().includes(query);

    return matchesStatus && matchesCompany && matchesSearch;
  });

  const totalCount = reviews.length;
  const publishedCount = reviews.filter((r) => r.status === "PUBLISHED").length;
  const flaggedCount = reviews.filter((r) => r.status === "FLAGGED").length;
  const verifiedCount = reviews.filter((r) => r.verificationStatus === "VERIFIED").length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <MessageSquareQuote className="w-6 h-6 text-purple-400" />
            Authentic Reviews Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Curate live customer reviews, moderate spam, and verify buyer authenticity.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchAdminData}
          disabled={loading}
          className="border-slate-700 text-slate-300 text-xs gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-purple-400" : ""}`} />
          Refresh Reviews
        </Button>
      </div>

      {/* Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
          <p className="text-slate-400 font-semibold">Total Loaded</p>
          <p className="text-2xl font-black text-white mt-1">{totalCount}</p>
        </div>
        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
          <p className="text-slate-400 font-semibold">Published (Live)</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{publishedCount}</p>
        </div>
        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
          <p className="text-slate-400 font-semibold">Flagged / Pending</p>
          <p className="text-2xl font-black text-amber-400 mt-1">{flaggedCount}</p>
        </div>
        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
          <p className="text-slate-400 font-semibold">Verified Buyers</p>
          <p className="text-2xl font-black text-purple-400 mt-1">{verifiedCount}</p>
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

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews by title, company, user..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold text-[11px]">Business:</span>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">All Businesses</option>
              {availableCompanies.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published (Active)</option>
              <option value="FLAGGED">Flagged</option>
              <option value="REMOVED">Removed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-slate-900 rounded-2xl border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 rounded-2xl border border-slate-800 p-8 space-y-3">
          <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
          <h2 className="text-base font-bold text-white">No reviews found</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No review records match your current business, status, or search filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((rev) => {
            const isPublished = rev.status === "PUBLISHED";
            const isVerifiedBuyer = rev.verificationStatus === "VERIFIED";

            return (
              <div
                key={rev.id}
                className="p-5 border border-slate-800 bg-slate-900 rounded-2xl space-y-4 hover:border-slate-700 transition-all"
              >
                {/* Top Bar: Company, Rating, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <Link
                      href={`/companies/${rev.company?.slug || ""}`}
                      target="_blank"
                      className="font-bold text-white hover:text-purple-400 flex items-center gap-1.5 text-sm"
                    >
                      <Building2 className="w-4 h-4 text-slate-500" />
                      {rev.company?.name || "Company"}
                    </Link>
                    <StarRating rating={rev.rating} size="sm" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        isPublished
                          ? "emerald"
                          : rev.status === "FLAGGED"
                          ? "rose"
                          : "outline"
                      }
                      size="sm"
                    >
                      {rev.status}
                    </Badge>

                    <button
                      type="button"
                      onClick={() => handleToggleVerification(rev.id, rev.verificationStatus)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-colors ${
                        isVerifiedBuyer
                          ? "bg-purple-950/80 text-purple-300 border-purple-800 hover:bg-purple-900"
                          : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3" />
                      {isVerifiedBuyer ? "Verified Buyer" : "Unverified"}
                    </button>
                  </div>
                </div>

                {/* Review Content */}
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">
                    {rev.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {rev.content}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
                    <span>
                      By <strong className="text-slate-400">{rev.user?.firstName} {rev.user?.lastName}</strong> ({rev.user?.email})
                    </span>
                    <span>•</span>
                    <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Company Response if exists */}
                {rev.response && (
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
                    <p className="font-bold text-purple-400 flex items-center gap-1 text-[11px] mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Official Company Response:
                    </p>
                    <p className="text-slate-300 italic">"{rev.response.content}"</p>
                  </div>
                )}

                {/* Moderation Actions Toolbar */}
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {!isPublished ? (
                      <Button
                        variant="emerald"
                        size="sm"
                        onClick={() => handleUpdateStatus(rev.id, "PUBLISHED")}
                        className="text-xs font-semibold gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve &amp; Publish
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(rev.id, "FLAGGED")}
                        className="border-amber-800/80 text-amber-400 hover:bg-amber-950/40 text-xs font-semibold gap-1"
                      >
                        <Flag className="w-3.5 h-3.5" /> Flag Review
                      </Button>
                    )}

                    {rev.status !== "REMOVED" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(rev.id, "REMOVED")}
                        className="border-slate-700 text-slate-400 hover:bg-slate-800 text-xs font-semibold"
                      >
                        Set as Removed
                      </Button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteReview(rev.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
