"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  Shield,
  Star,
  MessageSquareQuote,
  Send,
  BarChart3,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Code2,
  PlusCircle,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StarRating from "@/components/ui/StarRating";
import Modal from "@/components/ui/Modal";

export default function BusinessDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Response Modal state
  const [selectedReview, setSelectedReview] = useState(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseContent, setResponseContent] = useState("");
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.get("/business/dashboard");
      if (res?.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleOpenRespond = (review) => {
    setSelectedReview(review);
    setResponseContent(review.response?.content || "");
    setResponseModalOpen(true);
  };

  const handleSaveResponse = async (e) => {
    e.preventDefault();
    if (!selectedReview) return;
    setIsSubmittingResponse(true);

    try {
      const res = await api.post(`/business/reviews/${selectedReview.id}/response`, {
        content: responseContent,
      });
      if (res?.success) {
        setResponseModalOpen(false);
        fetchDashboard();
      }
    } catch (err) {
      alert(err.message || "Failed to submit response");
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-28 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">Failed to load dashboard</h3>
        <p className="text-xs text-slate-500">{error}</p>
        <Button size="sm" variant="outline" onClick={fetchDashboard}>
          Retry Loading
        </Button>
      </div>
    );
  }

  const { company, metrics, ratingDistribution, recentReviews } = data;
  const totalReviews = metrics.totalReviews || 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Overview
            </span>
            {company.isVerified ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" /> Verified Business
              </span>
            ) : (
              <Link
                href="/business/settings"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
              >
                Verification Pending →
              </Link>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{company.name}</h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Welcome to your centralized business command center. Monitor consumer perception, respond to public reviews, and manage reputation assets.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/business/invitations">
            <Button variant="emerald" size="sm" className="font-bold gap-1.5 shadow-sm">
              <Send className="w-3.5 h-3.5" /> Invite Customers
            </Button>
          </Link>
          <Link href="/business/widgets">
            <Button variant="outline" size="sm" className="border-slate-700 text-slate-200 hover:bg-slate-800 gap-1.5">
              <Code2 className="w-3.5 h-3.5" /> Get Widget
            </Button>
          </Link>
        </div>
      </div>

      {/* 6 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4 border-slate-200 bg-white">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">TrustScore</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-slate-900">{metrics.trustScore}</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <div className="mt-2">
            <StarRating rating={parseFloat(metrics.trustScore) || 0} size="sm" />
          </div>
        </Card>

        <Card className="p-4 border-slate-200 bg-white">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Rating</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-slate-900">{metrics.averageRating}</span>
            <span className="text-xs text-slate-400">stars</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2">
            {metrics.averageRating >= 4 ? "★ Top Rated" : "★ Good"}
          </p>
        </Card>

        <Card className="p-4 border-slate-200 bg-white">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Reviews</p>
          <div className="mt-1">
            <span className="text-2xl font-black text-slate-900">{metrics.totalReviews}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Verified public feedback</p>
        </Card>

        <Card className="p-4 border-slate-200 bg-white">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">This Month</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-slate-900">{metrics.reviewsThisMonth}</span>
            <span className="text-xs text-emerald-600 font-bold">new</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Last 30 rolling days</p>
        </Card>

        <Card className="p-4 border-slate-200 bg-white">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Unanswered</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-2xl font-black ${metrics.unansweredReviews > 0 ? "text-amber-600" : "text-emerald-600"}`}>
              {metrics.unansweredReviews}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Requires response</p>
        </Card>

        <Card className="p-4 border-slate-200 bg-white">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Response Rate</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-emerald-600">{metrics.responseRate}%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Official reply coverage</p>
        </Card>
      </div>

      {/* Grid: Rating Breakdown & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rating Distribution */}
        <Card className="p-6 border-slate-200 bg-white lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Rating Distribution</h3>
            <span className="text-xs text-slate-500">{totalReviews} reviews</span>
          </div>

          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingDistribution[stars] || 0;
              const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
              return (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <span className="w-8 font-semibold text-slate-700">{stars} ★</span>
                  <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        stars >= 4
                          ? "bg-emerald-500"
                          : stars === 3
                          ? "bg-amber-400"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-slate-500 font-medium">{percentage}%</span>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <Link
              href="/business/analytics"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center justify-between"
            >
              <span>View In-Depth Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        {/* Action Center & Growth */}
        <Card className="p-6 border-slate-200 bg-white lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Reputation Action Hub</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Proactive actions to boost customer trust and review volume.
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                  <Send className="w-4 h-4" /> Send Review Requests
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Companies that invite buyers actively collect 4x more verified reviews and maintain higher TrustScores.
                </p>
                <Link href="/business/invitations" className="inline-block pt-1">
                  <Button size="sm" variant="emerald" className="text-xs font-bold">
                    Invite Customers Now
                  </Button>
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                  <Code2 className="w-4 h-4" /> Install Trust Widget
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Showcase your 4.8★ rating on your website header, footer, or checkout page to reduce purchase hesitation.
                </p>
                <Link href="/business/widgets" className="inline-block pt-1">
                  <Button size="sm" variant="outline" className="text-xs font-bold">
                    Customize Widget
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Official Response SLA: <strong>Within 24 Hours</strong></span>
            <Link href="/business/reviews" className="font-semibold text-emerald-600 hover:underline">
              Go to Reviews Inbox →
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Reviews Inbox Quick Table */}
      <Card className="p-6 border-slate-200 bg-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Customer Reviews</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest feedback submitted by verified buyers and users.
            </p>
          </div>
          <Link href="/business/reviews">
            <Button variant="outline" size="sm" className="text-xs font-semibold">
              View All Reviews ({totalReviews})
            </Button>
          </Link>
        </div>

        {recentReviews.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            <MessageSquareQuote className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="font-semibold">No customer reviews yet.</p>
            <p className="mt-1">Invite your customers to write your first review!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <StarRating rating={rev.rating} size="sm" />
                    <span className="text-xs font-bold text-slate-900">{rev.title}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{rev.user ? `${rev.user.firstName} ${rev.user.lastName || ""}` : "Customer"}</span>
                    <span>•</span>
                    <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {rev.content}
                </p>

                {/* Response State */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                  {rev.response ? (
                    <div className="flex items-center gap-2 text-emerald-700 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Responded on {new Date(rev.response.createdAt).toLocaleDateString()}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-amber-700 font-semibold text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Unanswered — Customer awaiting response</span>
                    </div>
                  )}

                  <Button
                    variant={rev.response ? "outline" : "emerald"}
                    size="sm"
                    onClick={() => handleOpenRespond(rev)}
                    className="text-xs font-bold py-1 px-2.5"
                  >
                    {rev.response ? "Edit Response" : "Respond to Review"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Response Modal */}
      <Modal
        isOpen={responseModalOpen}
        onClose={() => setResponseModalOpen(false)}
        title={`Respond to "${selectedReview?.title}"`}
        description="Your response will be publicly displayed on your company profile under this review."
      >
        <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
          <div className="flex items-center gap-2">
            <StarRating rating={selectedReview?.rating || 5} size="sm" />
            <span className="font-bold text-slate-800">
              {selectedReview?.user?.firstName} {selectedReview?.user?.lastName}
            </span>
          </div>
          <p className="text-slate-600 italic">"{selectedReview?.content}"</p>
        </div>

        <form onSubmit={handleSaveResponse} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Official Company Response
            </label>
            <textarea
              rows={5}
              required
              placeholder="Thank the customer, acknowledge their feedback, or explain how their complaint is being resolved..."
              value={responseContent}
              onChange={(e) => setResponseContent(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setResponseModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="emerald"
              size="sm"
              isLoading={isSubmittingResponse}
              className="font-bold"
            >
              Publish Response
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
