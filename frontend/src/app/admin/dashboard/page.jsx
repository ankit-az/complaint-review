"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  MessageSquareQuote,
  Building2,
  Users,
  Flag,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Star,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Check,
  Trash2,
  Eye,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const res = await api.get("/admin/dashboard");
      if (res?.success && res.data) {
        setStats(res.data);
      } else {
        setError(res?.message || "Failed to load dashboard statistics.");
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Failed to load statistics.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Inline action to update review status from the live queue
  const handleQuickReviewStatus = async (reviewId, newStatus) => {
    try {
      const res = await api.patch(`/admin/reviews/${reviewId}/status`, { status: newStatus });
      if (res?.success) {
        setActionMessage(`Review marked as ${newStatus}`);
        setTimeout(() => setActionMessage(null), 3000);
        fetchStats();
      }
    } catch (err) {
      alert("Failed to update review status: " + err.message);
    }
  };

  // Inline action to delete review
  const handleQuickDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to permanently delete this review?")) return;
    try {
      const res = await api.delete(`/admin/reviews/${reviewId}`);
      if (res?.success) {
        setActionMessage("Review deleted permanently");
        setTimeout(() => setActionMessage(null), 3000);
        fetchStats();
      }
    } catch (err) {
      alert("Failed to delete review: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse py-6">
        <div className="h-10 bg-slate-900 rounded-xl w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-900 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-slate-900 rounded-2xl" />
          <div className="h-64 bg-slate-900 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl max-w-xl mx-auto my-12">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white">Dashboard Unavailable</h2>
        <p className="text-xs text-slate-400 mt-1 mb-4">{error}</p>
        <Button variant="emerald" size="sm" onClick={fetchStats}>
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Retry Fetch
        </Button>
      </div>
    );
  }

  const overview = stats?.overview || {};
  const recentReviews = stats?.recentReviews || [];
  const recentUsers = stats?.recentUsers || [];
  const recentReports = stats?.recentReports || [];
  const topCompanies = stats?.topCompanies || [];

  // Star percentage calculations
  const totalStarCounts =
    (overview.ratingDistribution?.[5] || 0) +
    (overview.ratingDistribution?.[4] || 0) +
    (overview.ratingDistribution?.[3] || 0) +
    (overview.ratingDistribution?.[2] || 0) +
    (overview.ratingDistribution?.[1] || 0);

  const getStarPercent = (star) => {
    if (!totalStarCounts) return 0;
    return Math.round(((overview.ratingDistribution?.[star] || 0) / totalStarCounts) * 100);
  };

  const actionItemsCount = (overview.pendingReviews || 0) + (overview.flaggedReviews || 0) + (overview.pendingReports || 0);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HERO HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/40 p-6 rounded-2xl border border-slate-800/80 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Overview &amp; Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Admin Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time platform telemetry, moderation queue, user auditing, and company oversight.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStats}
            disabled={refreshing}
            className="border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-semibold gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-purple-400" : ""}`} />
            Refresh Data
          </Button>

          <Link href="/admin/reviews">
            <Button variant="emerald" size="sm" className="text-xs font-bold gap-1.5 shadow-md">
              <MessageSquareQuote className="w-3.5 h-3.5" /> Moderate Reviews
            </Button>
          </Link>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionMessage && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {actionMessage}
          </span>
          <button onClick={() => setActionMessage(null)} className="text-emerald-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* 2. TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reviews */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Reviews
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 flex items-center justify-center">
              <MessageSquareQuote className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-white">{overview.totalReviews || 0}</div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
              <span className="text-emerald-400 font-semibold">{overview.publishedReviews || 0} Live</span>
              <span>•</span>
              <span className="text-purple-400 font-medium">
                {overview.totalReviews ? Math.round(((overview.verifiedReviews || 0) / overview.totalReviews) * 100) : 0}% Verified
              </span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
        </div>

        {/* Listed Companies */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Companies Listed
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-800/60 text-purple-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-white">{overview.totalCompanies || 0}</div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
              <span className="text-purple-300 font-semibold">{overview.claimedCompanies || 0} Claimed</span>
              <span>•</span>
              <span className="text-slate-400">{overview.totalCategories || 0} Categories</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
        </div>

        {/* Platform Users */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Accounts
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-800/60 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-white">{overview.totalUsers || 0}</div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
              <span className="text-blue-300 font-semibold">{overview.consumerUsers || 0} Consumers</span>
              <span>•</span>
              <span className="text-slate-300 font-semibold">{overview.businessUsers || 0} Businesses</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
        </div>

        {/* Action Items */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Requires Action
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-800/60 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-amber-400">{actionItemsCount}</div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
              <span className="text-amber-300 font-semibold">{overview.flaggedReviews || 0} Flagged</span>
              <span>•</span>
              <span className="text-rose-400 font-semibold">{overview.pendingReports || 0} Disputes</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-rose-500" />
        </div>
      </div>

      {/* 3. VISUAL DISTRIBUTION CHARTS & MODERATION METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Analytics */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">Platform Rating Distribution</h2>
              <p className="text-xs text-slate-400 mt-0.5">Aggregated rating telemetry across all verified companies</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-base font-black text-white">{overview.averageRating || "0.0"}</span>
              <span className="text-[10px] text-slate-400">/ 5.0</span>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => {
              const percent = getStarPercent(stars);
              const count = overview.ratingDistribution?.[stars] || 0;
              const barColor =
                stars >= 4
                  ? "bg-emerald-500"
                  : stars === 3
                  ? "bg-amber-500"
                  : "bg-rose-500";

              return (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <span className="font-bold text-slate-300 w-12 flex items-center gap-1">
                    {stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 h-3 rounded-full bg-slate-800/80 overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-16 text-right font-mono text-slate-400 text-[11px]">
                    {count} ({percent}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review Status Telemetry */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white">Review Moderation Telemetry</h2>
                <p className="text-xs text-slate-400 mt-0.5">Real-time status breakdown of customer complaints and reviews</p>
              </div>
              <Badge variant="purple" size="sm">
                Active Policy
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-900/40">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-400">Published (Live)</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white mt-1">
                  {overview.publishedReviews || 0}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Visible on search &amp; profile feeds</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-900/40">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-amber-400">Pending Review</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-white mt-1">
                  {overview.pendingReviews || 0}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Awaiting moderation verification</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-rose-900/40">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-rose-400">Flagged / Under Review</span>
                  <Flag className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-2xl font-black text-white mt-1">
                  {overview.flaggedReviews || 0}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Reported for spam or policy</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">Rejected / Removed</span>
                  <Trash2 className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-2xl font-black text-white mt-1">
                  {overview.rejectedReviews || 0}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Removed due to fraud or terms</p>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Need in-depth moderation tools?</span>
            <Link href="/admin/reviews" className="text-xs font-bold text-purple-400 hover:text-purple-300 inline-flex items-center gap-1">
              Open Full Review Console <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. LIVE MODERATION QUEUE */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Live Reviews Stream</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-400 text-[10px] font-bold border border-purple-800">
                Latest 8 Submissions
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspect submitted reviews and execute 1-click status decisions directly from the stream.
            </p>
          </div>

          <Link href="/admin/reviews">
            <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 text-xs">
              View All Reviews
            </Button>
          </Link>
        </div>

        {recentReviews.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No reviews found on the platform yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80 mt-2">
            {recentReviews.map((review) => (
              <div
                key={review.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-850/40 rounded-xl px-2 transition-colors"
              >
                <div className="space-y-1 min-w-0 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-bold text-white truncate">{review.title}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-purple-400 font-semibold">{review.company?.name}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-amber-400 font-bold">{"★".repeat(review.rating)}</span>
                    
                    <Badge
                      variant={
                        review.status === "PUBLISHED"
                          ? "emerald"
                          : review.status === "FLAGGED"
                          ? "rose"
                          : "amber"
                      }
                      size="sm"
                    >
                      {review.status}
                    </Badge>

                    {review.verificationStatus === "VERIFIED" && (
                      <Badge variant="blue" size="sm">
                        Verified
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1">
                    By <strong className="text-slate-300">{review.user?.firstName} {review.user?.lastName}</strong> ({review.user?.email})
                  </p>
                </div>

                {/* Inline Action Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {review.status !== "PUBLISHED" && (
                    <button
                      type="button"
                      onClick={() => handleQuickReviewStatus(review.id, "PUBLISHED")}
                      title="Approve & Publish"
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/60 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                  )}

                  {review.status !== "FLAGGED" && (
                    <button
                      type="button"
                      onClick={() => handleQuickReviewStatus(review.id, "FLAGGED")}
                      title="Flag for Investigation"
                      className="px-2.5 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/60 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Flag className="w-3.5 h-3.5" /> Flag
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleQuickDeleteReview(review.id)}
                    title="Permanently Remove"
                    className="p-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-900/60 text-rose-400 border border-rose-900/40 text-xs cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. DUAL AUDIT FEEDS: RECENT USERS & TOP COMPANIES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registrations */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">Recent Registrations</h2>
              <p className="text-xs text-slate-400 mt-0.5">Platform user authentication audit</p>
            </div>
            <Link href="/admin/users" className="text-xs font-semibold text-purple-400 hover:underline">
              View All Users
            </Link>
          </div>

          <div className="divide-y divide-slate-800/80 mt-2">
            {recentUsers.map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs shrink-0">
                    {u.firstName?.[0] || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono truncate">{u.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant={u.role === "ADMIN" ? "purple" : u.role === "BUSINESS" ? "emerald" : "outline"}
                    size="sm"
                  >
                    {u.role}
                  </Badge>
                  {u.isSuspended && (
                    <Badge variant="rose" size="sm">
                      Suspended
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Rated / Most Active Companies */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">Top Active Companies</h2>
              <p className="text-xs text-slate-400 mt-0.5">Enterprises with highest review engagement</p>
            </div>
            <Link href="/admin/companies" className="text-xs font-semibold text-purple-400 hover:underline">
              Manage Directory
            </Link>
          </div>

          <div className="divide-y divide-slate-800/80 mt-2">
            {topCompanies.map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <p className="font-bold text-white truncate flex items-center gap-1.5">
                    {c.name}
                    {c.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono truncate">/{c.slug}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-right">
                  <div>
                    <div className="font-black text-white flex items-center justify-end gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {c.overallRating?.toFixed(1) || "0.0"}
                    </div>
                    <span className="text-[10px] text-slate-500">{c.reviewCount || 0} reviews</span>
                  </div>

                  <Link href={`/companies/${c.slug}`} target="_blank">
                    <ExternalLink className="w-4 h-4 text-slate-500 hover:text-white transition-colors" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
