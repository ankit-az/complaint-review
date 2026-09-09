"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  MessageSquareQuote,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  Flag,
  AlertCircle,
  ThumbsUp,
  Building2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";

export default function BusinessReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [responseFilter, setResponseFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [respondModalOpen, setRespondModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [responseContent, setResponseContent] = useState("");
  const [reportReason, setReportReason] = useState("FAKE_REVIEW");
  const [reportDetails, setReportDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        sortBy,
      });

      if (searchTerm) params.append("search", searchTerm);
      if (ratingFilter) params.append("rating", ratingFilter);
      if (responseFilter !== "all") params.append("responseStatus", responseFilter);
      if (verificationFilter) params.append("verificationStatus", verificationFilter);

      const res = await api.get(`/business/reviews?${params.toString()}`);
      if (res?.success && res.data) {
        setReviews(res.data.reviews || []);
        setPagination(res.data.pagination || { page: 1, totalPages: 1, total: 0 });
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [currentPage, ratingFilter, responseFilter, verificationFilter, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchReviews();
  };

  // Open Respond Modal
  const handleOpenRespond = (rev) => {
    setSelectedReview(rev);
    setResponseContent(rev.response?.content || "");
    setRespondModalOpen(true);
  };

  // Submit Official Response
  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!selectedReview) return;
    setIsSubmitting(true);

    try {
      const res = await api.post(`/business/reviews/${selectedReview.id}/response`, {
        content: responseContent,
      });
      if (res?.success) {
        setRespondModalOpen(false);
        setSuccessMessage("Official company response successfully published.");
        setTimeout(() => setSuccessMessage(null), 4000);
        fetchReviews();
      }
    } catch (err) {
      alert(err.message || "Failed to post response");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Response
  const handleDeleteResponse = async (reviewId) => {
    if (!window.confirm("Are you sure you want to remove your official company response?")) {
      return;
    }

    try {
      const res = await api.delete(`/business/reviews/${reviewId}/response`);
      if (res?.success) {
        setSuccessMessage("Response removed.");
        setTimeout(() => setSuccessMessage(null), 3000);
        fetchReviews();
      }
    } catch (err) {
      alert(err.message || "Failed to delete response");
    }
  };

  // Open Report Modal
  const handleOpenReport = (rev) => {
    setSelectedReview(rev);
    setReportReason("FAKE_REVIEW");
    setReportDetails("");
    setReportModalOpen(true);
  };

  // Submit Report
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!selectedReview) return;
    setIsSubmitting(true);

    try {
      const res = await api.post(`/business/reviews/${selectedReview.id}/report`, {
        reason: reportReason,
        details: reportDetails,
      });
      if (res?.success) {
        setReportModalOpen(false);
        setSuccessMessage("Review flagged for investigation by platform integrity team.");
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err) {
      alert(err.message || "Failed to report review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Reviews Inbox</h2>
          <p className="text-xs text-slate-500 mt-1">
            Read, filter, and officially respond to consumer reviews and complaint resolutions.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs self-start sm:self-auto">
          Total Reviews: <strong className="text-slate-900">{pagination.total}</strong>
        </div>
      </div>

      {/* Success Alert Banner */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <Card className="p-4 border-slate-200 bg-white space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <Input
              icon={Search}
              placeholder="Search by review keywords, titles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </form>

          {/* Star Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) => {
              setRatingFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 font-medium focus:border-emerald-500 focus:outline-none"
          >
            <option value="">All Star Ratings</option>
            <option value="5">5 Stars Only</option>
            <option value="4">4 Stars Only</option>
            <option value="3">3 Stars Only</option>
            <option value="2">2 Stars Only</option>
            <option value="1">1 Star Only</option>
          </select>

          {/* Response Status Filter */}
          <select
            value={responseFilter}
            onChange={(e) => {
              setResponseFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 font-medium focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">All Responses</option>
            <option value="unanswered">Unanswered Only</option>
            <option value="answered">Responded Only</option>
          </select>

          {/* Verification Status */}
          <select
            value={verificationFilter}
            onChange={(e) => {
              setVerificationFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 font-medium focus:border-emerald-500 focus:outline-none"
          >
            <option value="">All Verification Statuses</option>
            <option value="VERIFIED">Verified Buyers Only</option>
            <option value="UNVERIFIED">Unverified Only</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 font-medium focus:border-emerald-500 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </Card>

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-44 rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-slate-200">
          <MessageSquareQuote className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No reviews found matching your filters</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try resetting your rating or response status filters to see all customer reviews.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setRatingFilter("");
              setResponseFilter("all");
              setVerificationFilter("");
              setSearchTerm("");
            }}
            className="mt-4 text-xs font-semibold"
          >
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="space-y-5">
          {reviews.map((rev) => (
            <Card key={rev.id} className="p-6 border-slate-200 bg-white space-y-4 hover:shadow-xs transition-shadow">
              {/* Review Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                    {rev.user?.firstName ? rev.user.firstName[0].toUpperCase() : "U"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {rev.user?.firstName} {rev.user?.lastName || ""}
                      </span>
                      {rev.verificationStatus === "VERIFIED" && (
                        <Badge variant="verified" size="sm">
                          Verified Buyer
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Submitted on {new Date(rev.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="flex items-center gap-2">
                  <StarRating rating={rev.rating} size="sm" showScore />
                </div>
              </div>

              {/* Review Content */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{rev.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{rev.content}</p>
              </div>

              {/* Official Response Box (if exists) */}
              {rev.response && (
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Official Response from Company</span>
                    </div>
                    <span className="text-[11px] text-emerald-600">
                      {new Date(rev.response.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{rev.response.content}</p>

                  <div className="pt-2 flex items-center justify-end gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleOpenRespond(rev)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-emerald-700 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteResponse(rev.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5" /> {rev.helpfulCount || 0} found helpful
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleOpenReport(rev)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Flag className="w-3 h-3" /> Report Review
                  </button>

                  <Button
                    variant={rev.response ? "outline" : "emerald"}
                    size="sm"
                    onClick={() => handleOpenRespond(rev)}
                    className="font-bold text-xs"
                  >
                    {rev.response ? "Update Response" : "Respond to Customer"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 text-xs text-slate-600">
              <span>
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total reviews)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage >= pagination.totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                  className="gap-1"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Response Modal */}
      <Modal
        isOpen={respondModalOpen}
        onClose={() => setRespondModalOpen(false)}
        title={`Respond to "${selectedReview?.title}"`}
        description="Your response is published publicly on your company's profile directly below this customer's feedback."
      >
        <form onSubmit={handleSubmitResponse} className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
            <div className="flex items-center gap-2">
              <StarRating rating={selectedReview?.rating || 5} size="sm" />
              <span className="font-bold text-slate-800">
                {selectedReview?.user?.firstName} {selectedReview?.user?.lastName}
              </span>
            </div>
            <p className="text-slate-600 italic">"{selectedReview?.content}"</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Your Official Response
            </label>
            <textarea
              rows={5}
              required
              placeholder="Thank the customer, acknowledge their feedback, or explain how their complaint has been resolved..."
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
              onClick={() => setRespondModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="emerald"
              size="sm"
              isLoading={isSubmitting}
              className="font-bold"
            >
              Publish Response
            </Button>
          </div>
        </form>
      </Modal>

      {/* Report Review Modal */}
      <Modal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Report Problematic Review"
        description="Our platform moderation team will independently evaluate this review against our Integrity Guidelines."
      >
        <form onSubmit={handleSubmitReport} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Reason for Report
            </label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
            >
              <option value="FAKE_REVIEW">Fake review (person never used our services)</option>
              <option value="SPAM">Spam or advertising</option>
              <option value="OFFENSIVE">Inappropriate, abusive, or offensive language</option>
              <option value="CONFLICT_OF_INTEREST">Conflict of interest (competitor, disgruntled ex-employee)</option>
              <option value="OTHER">Other compliance breach</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Specific Evidence & Details
            </label>
            <textarea
              rows={4}
              required
              placeholder="Explain why this review violates platform policy (e.g. no order records match this name, competitor mention)..."
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setReportModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="sm"
              isLoading={isSubmitting}
              className="font-bold"
            >
              Submit Report for Investigation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
