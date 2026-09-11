"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import {
  Building2,
  Globe,
  Phone,
  MapPin,
  CheckCircle2,
  Star,
  ExternalLink,
  MessageSquareQuote,
  Clock,
  ThumbsUp,
  Sparkles,
  ArrowLeft,
  Package,
  Shield,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";

export default function CompanyProfilePage() {
  const params = useParams();
  const slug = params?.slug;

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    const fetchCompany = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/companies/${slug}`);
        if (res?.success && res.data?.company) {
          setCompany(res.data.company);
        } else {
          setError("Company not found");
        }
      } catch (err) {
        setError(err.message || "Failed to load company profile");
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        <div className="h-64 bg-slate-200 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-96 bg-slate-200 rounded-2xl animate-pulse lg:col-span-2" />
          <div className="h-96 bg-slate-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full text-center space-y-4 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
          <h1 className="text-xl font-bold text-slate-900">Company Not Found</h1>
          <p className="text-xs text-slate-500">
            The company profile you are looking for does not exist or has been removed.
          </p>
          <Link href="/companies">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Browse All Companies
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const reviews = company.reviews || [];
  const totalReviews = reviews.length;

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Hero Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 pt-6 pb-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 rounded-2xl bg-white text-slate-900 font-black text-2xl flex items-center justify-center shrink-0 shadow-sm border border-slate-200 overflow-hidden p-2">
                {company.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt={company.name}
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      if (e.currentTarget.nextElementSibling) {
                        e.currentTarget.nextElementSibling.classList.remove("hidden");
                      }
                    }}
                  />
                ) : null}
                <span className={`text-slate-800 text-2xl font-black ${company.logoUrl ? "hidden" : ""}`}>
                  {company.name ? company.name[0].toUpperCase() : "C"}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {company.name}
                  </h1>
                  {company.isVerified ? (
                    <Badge variant="verified" size="md">
                      Verified Business
                    </Badge>
                  ) : !company.isClaimed ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      <Building2 className="w-3.5 h-3.5 text-amber-600" /> Unclaimed Profile
                    </span>
                  ) : null}
                </div>

                <p className="text-xs text-slate-500">
                  {company.category?.name || "Registered Business"} •{" "}
                  {[company.city, company.country].filter(Boolean).join(", ") || "Global"}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <StarRating rating={company.overallRating} size="sm" showScore />
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-600 font-semibold">
                    {totalReviews} Customer Reviews
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!company.isClaimed && (
                <Link href={`/business/claim?company=${company.slug}`}>
                  <Button variant="outline" size="md" className="font-bold border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 gap-1.5 shadow-sm">
                    <Shield className="w-4 h-4 text-amber-600" /> Claim Profile
                  </Button>
                </Link>
              )}
              <Link href={`/writereview?company=${company.slug}`}>
                <Button variant="emerald" size="md" className="font-bold gap-2 shadow-sm">
                  <Sparkles className="w-4 h-4 text-amber-300" /> Write a Review
                </Button>
              </Link>
              {company.websiteUrl && (
                <a
                  href={company.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Unclaimed Profile Prominent Notice Banner */}
      {!company.isClaimed && (
        <div className="bg-amber-50/80 border-b border-amber-200 py-3.5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                  Is this your company? Take ownership of this profile
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-600">
                  Anyone authorized by {company.name} can claim this profile for free to reply to customer reviews, upload official brand assets, and manage company details.
                </p>
              </div>
            </div>
            <Link href={`/business/claim?company=${company.slug}`} className="shrink-0 w-full sm:w-auto">
              <Button size="sm" className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs gap-1.5 shadow-sm">
                <Shield className="w-3.5 h-3.5" /> Claim this profile free →
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <Card className="p-6 border-slate-200 bg-white space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">About {company.name}</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {company.description || "No official description provided yet."}
            </p>
          </Card>

          {/* Customer Reviews Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Customer Reviews ({reviews.length})
              </h2>
              <span className="text-xs text-slate-500 font-medium">Showing most recent</span>
            </div>

            {reviews.length === 0 ? (
              <Card className="p-12 text-center border-dashed border-2 border-slate-200 space-y-3">
                <MessageSquareQuote className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-700">No reviews yet for {company.name}</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Have you interacted with this company? Share your experience to help other buyers.
                </p>
                <Link href={`/writereview?company=${company.slug}`} className="inline-block pt-1">
                  <Button variant="emerald" size="sm" className="font-bold">
                    Be the First Reviewer
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <Card key={rev.id} className="p-6 border-slate-200 bg-white space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                          {rev.user?.firstName ? rev.user.firstName[0].toUpperCase() : "U"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {rev.user?.firstName} {rev.user?.lastName || ""}
                            </span>
                            {rev.verificationStatus === "VERIFIED" && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <StarRating rating={rev.rating} size="sm" />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{rev.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1">{rev.content}</p>
                    </div>

                    {/* Official Business Reply Block */}
                    {rev.response && (
                      <div className="mt-4 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>Response from {company.name}</span>
                          </div>
                          <span className="text-[11px] text-emerald-600">
                            {new Date(rev.response.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{rev.response.content}</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Company Trust & Stats Card */}
        <div className="space-y-6">
          {/* TrustScore Card */}
          <Card className="p-6 border-slate-200 bg-white space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Trust & Rating Score
            </h3>

            <div className="text-center py-2 space-y-1">
              <span className="text-4xl font-black text-slate-900">
                {company.overallRating ? company.overallRating.toFixed(1) : "0.0"}
              </span>
              <div className="flex justify-center">
                <StarRating rating={company.overallRating || 0} size="md" />
              </div>
              <p className="text-xs text-slate-500">Based on {totalReviews} genuine customer reviews</p>
            </div>

            {/* Rating distribution breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              {[
                { star: 5, count: company.star5Count || 0 },
                { star: 4, count: company.star4Count || 0 },
                { star: 3, count: company.star3Count || 0 },
                { star: 2, count: company.star2Count || 0 },
                { star: 1, count: company.star1Count || 0 },
              ].map(({ star, count }) => {
                const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="w-6 font-semibold text-slate-600">{star}★</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-slate-400 text-[11px]">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Company Contact Details */}
          <Card className="p-6 border-slate-200 bg-white space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Verified Business Details
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              {company.websiteUrl && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline truncate">
                    {company.websiteUrl}
                  </a>
                </div>
              )}
              {company.contactPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{company.contactPhone}</span>
                </div>
              )}
              {company.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{[company.address, company.city, company.country].filter(Boolean).join(", ")}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Is this your company? Banner */}
          {!company.isClaimed && (
            <Card className="p-5 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/40 text-slate-900 space-y-3 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                  <Building2 className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-amber-950">Do you manage {company.name}?</h4>
              </div>
              <p className="text-[11px] text-amber-900/80 leading-relaxed">
                Claim this business profile to respond directly to customer reviews, upload official logos, and manage your brand reputation.
              </p>
              <Link href={`/business/claim?company=${company.slug}`} className="block pt-1">
                <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs gap-1.5 shadow-sm">
                  <Shield className="w-3.5 h-3.5" /> Claim Profile Free →
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
