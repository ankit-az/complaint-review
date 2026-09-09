"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/store/AuthContext";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/ui/StarRating";
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Building2,
  ExternalLink,
  ArrowLeft,
  Filter,
  Check,
  Flag,
  RotateCcw,
  Sparkles,
  Lock,
} from "lucide-react";

export default function AdminReviewsPage() {
  const { user, login } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedCompany, setSelectedCompany] = useState("ALL");
  const [availableCompanies, setAvailableCompanies] = useState([]);

  // Action feedback
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    document.title = "Admin Review Management | ComplaintReview";
  }, []);

  // Fetch all reviews and companies
  const fetchAdminData = async () => {
    if (!user || user.role !== "ADMIN") return;
    setLoading(true);
    setError(null);
    try {
      const [reviewsRes, companiesRes] = await Promise.all([
        api.get("/admin/reviews?limit=50"),
        api.get("/companies?limit=50"),
      ]);

      if (reviewsRes?.success && Array.isArray(reviewsRes.data?.reviews)) {
        setReviews(reviewsRes.data.reviews);
      }
      if (companiesRes?.success && Array.isArray(companiesRes.data?.companies)) {
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
    if (user?.role === "ADMIN") {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [user]);

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
        setActionMessage(`Review status updated to ${newStatus}`);
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      alert(err.message || "Failed to update review status");
    }
  };

  // Toggle Verified Buyer Status
  const handleToggleVerification = async (reviewId, currentVerification) => {
    const nextVerification =
      currentVerification === "VERIFIED" ? "UNVERIFIED" : "VERIFIED";
    try {
      const res = await api.patch(`/admin/reviews/${reviewId}/status`, {
        verificationStatus: nextVerification,
      });
      if (res?.success) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId
              ? { ...r, verificationStatus: nextVerification }
              : r
          )
        );
        setActionMessage(`Verification set to ${nextVerification}`);
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      alert(err.message || "Failed to update verification status");
    }
  };

  // Delete Review Permanently
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to permanently delete this review?")) {
      return;
    }
    try {
      const res = await api.delete(`/admin/reviews/${reviewId}`);
      if (res?.success) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        setActionMessage("Review permanently deleted from database");
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      alert(err.message || "Failed to delete review");
    }
  };

  // Quick Admin Login
  const handleAdminQuickLogin = async () => {
    try {
      await login("admin@complaint-review.com", "Admin@123456");
    } catch (err) {
      alert("Admin login failed: " + err.message);
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
      r.user?.firstName?.toLowerCase().includes(query) ||
      r.user?.lastName?.toLowerCase().includes(query);

    return matchesStatus && matchesCompany && matchesSearch;
  });

  // Calculate Metrics
  const totalCount = reviews.length;
  const publishedCount = reviews.filter((r) => r.status === "PUBLISHED").length;
  const flaggedCount = reviews.filter((r) => r.status === "FLAGGED").length;
  const verifiedCount = reviews.filter((r) => r.verificationStatus === "VERIFIED").length;

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-slate-50">
        <div className="max-w-md w-full text-center space-y-4 bg-white p-8 rounded-2xl border border-slate-200 shadow-md">
          <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center mx-auto mb-2">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Administrator Access Required
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            You must be authenticated with an Administrator account to curate authentic reviews and moderate platform content.
          </p>
          <div className="pt-4 flex flex-col gap-2.5">
            <Button
              type="button"
              variant="emerald"
              size="md"
              className="w-full font-bold shadow-xs cursor-pointer"
              onClick={handleAdminQuickLogin}
            >
              Sign In as Administrator (1-Click)
            </Button>
            <Link href="/">
              <Button variant="outline" size="md" className="w-full font-semibold">
                Return to Home Page
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Admin Top Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest mb-1.5">
                <span className="flex h-2 w-2 rounded-full bg-purple-400"></span>
                <span>Platform Admin Console</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Authentic Reviews Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Curate live authentic customer reviews, moderate spam, and spotlight business feedback.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-700 text-slate-200 hover:bg-slate-800 font-semibold gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> View Homepage Live Feed
                </Button>
              </Link>
              <Button
                variant="emerald"
                size="sm"
                className="font-bold gap-1.5 shadow-sm"
                onClick={fetchAdminData}
              >
                <RotateCcw className="w-3.5 h-3.5" /> Refresh Data
              </Button>
            </div>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <p className="text-slate-400 font-semibold">Total Reviews</p>
              <p className="text-xl font-black text-white mt-0.5">{totalCount}</p>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <p className="text-slate-400 font-semibold">Published (Live)</p>
              <p className="text-xl font-black text-emerald-400 mt-0.5">{publishedCount}</p>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <p className="text-slate-400 font-semibold">Flagged / Pending</p>
              <p className="text-xl font-black text-amber-400 mt-0.5">{flaggedCount}</p>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <p className="text-slate-400 font-semibold">Verified Buyers</p>
              <p className="text-xl font-black text-teal-300 mt-0.5">{verifiedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter & List Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {actionMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2 animate-fade-in shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Filter Toolbar */}
        <Card className="p-4 sm:p-5 border-slate-200 bg-white shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reviews by title, company, user..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Company Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500">Business:</span>
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:border-emerald-600"
                >
                  <option value="ALL">All Businesses</option>
                  {availableCompanies.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:border-emerald-600"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PUBLISHED">Published (Active)</option>
                  <option value="FLAGGED">Flagged</option>
                  <option value="REMOVED">Removed</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Reviews List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8 space-y-3">
            <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No reviews found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No review records match your current business, status, or search filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((rev) => {
              const isPublished = rev.status === "PUBLISHED";
              const isVerifiedBuyer = rev.verificationStatus === "VERIFIED";

              return (
                <Card
                  key={rev.id}
                  className="p-5 border-slate-200 bg-white hover:border-slate-300 transition-shadow space-y-4"
                >
                  {/* Top Bar: Company, Rating, Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <Link
                        href={`/companies/${rev.company?.slug || ""}`}
                        className="font-bold text-slate-900 hover:text-emerald-600 flex items-center gap-1.5 text-sm"
                      >
                        <Building2 className="w-4 h-4 text-slate-400" />
                        {rev.company?.name || "Company"}
                      </Link>
                      <StarRating rating={rev.rating} size="sm" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isPublished
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : rev.status === "FLAGGED"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-rose-50 text-rose-800 border-rose-200"
                        }`}
                      >
                        {rev.status}
                      </span>

                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isVerifiedBuyer
                            ? "bg-teal-50 text-teal-800 border-teal-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {isVerifiedBuyer ? "Verified Buyer" : "Unverified"}
                      </span>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      {rev.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {rev.content}
                    </p>

                    {rev.response && (
                      <div className="mt-3 p-3 rounded-lg bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950">
                        <span className="font-bold text-emerald-800 block mb-1">
                          Official Company Response:
                        </span>
                        <p className="italic text-emerald-900/90">&ldquo;{rev.response.content}&rdquo;</p>
                      </div>
                    )}
                  </div>

                  {/* User & Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
                    <div>
                      <span className="font-semibold text-slate-800">
                        {rev.user ? `${rev.user.firstName} ${rev.user.lastName}` : "Anonymous"}
                      </span>
                      <span className="mx-1.5">•</span>
                      <span>{rev.user?.email || "No email"}</span>
                      <span className="mx-1.5">•</span>
                      <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                      <span className="mx-1.5">•</span>
                      <span>{rev.helpfulCount || 0} helpful votes</span>
                    </div>

                    {/* Admin Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[11px] h-7 px-2.5 font-semibold"
                        onClick={() =>
                          handleToggleVerification(rev.id, rev.verificationStatus)
                        }
                      >
                        {isVerifiedBuyer ? "Unmark Verified" : "Mark Verified Buyer"}
                      </Button>

                      {isPublished ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[11px] h-7 px-2.5 text-amber-700 hover:bg-amber-50 border-amber-200 font-semibold"
                          onClick={() => handleUpdateStatus(rev.id, "FLAGGED")}
                        >
                          <Flag className="w-3 h-3 mr-1" /> Flag Review
                        </Button>
                      ) : (
                        <Button
                          variant="emerald"
                          size="sm"
                          className="text-[11px] h-7 px-2.5 font-semibold"
                          onClick={() => handleUpdateStatus(rev.id, "PUBLISHED")}
                        >
                          <Check className="w-3 h-3 mr-1" /> Publish to Home
                        </Button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteReview(rev.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
