"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/store/AuthContext";
import api from "@/lib/api";
import {
  Shield,
  Search,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Lock,
  Sparkles,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";

function ClaimBusinessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetSlug = searchParams?.get("company") || searchParams?.get("slug");
  const { user, refreshUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("Business Owner / Executive");
  const [contactEmail, setContactEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompanies = async (query = "") => {
    setLoading(true);
    try {
      const endpoint = query
        ? `/companies?q=${encodeURIComponent(query)}&limit=30`
        : "/companies?limit=30";
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

  // If a company slug was provided in the query params (e.g. ?company=google)
  useEffect(() => {
    if (!targetSlug) return;
    const fetchTargetCompany = async () => {
      try {
        const res = await api.get(`/companies/${targetSlug}`);
        if (res?.success && res.data?.company) {
          const comp = res.data.company;
          setSelectedCompany(comp);
          setSearchQuery(comp.name);
          // If already logged in and company is unclaimed, open claim modal
          if (user && !comp.isClaimed) {
            setContactEmail(user.email || "");
            setClaimModalOpen(true);
          }
        }
      } catch (err) {
        console.error("Failed to load targeted company for claim:", err);
      }
    };
    fetchTargetCompany();
  }, [targetSlug, user]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCompanies(searchQuery);
  };

  const handleOpenClaimModal = (company) => {
    if (!user) {
      router.push(`/business/login?redirect=${encodeURIComponent(`/business/claim?company=${company.slug}`)}`);
      return;
    }
    setSelectedCompany(company);
    setContactEmail(user.email || "");
    setError(null);
    setClaimModalOpen(true);
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCompany) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await api.post("/business/claim", {
        companyId: selectedCompany.id,
        jobTitle,
        contactEmail,
      });

      if (res?.success) {
        await refreshUser();
        setClaimModalOpen(false);
        router.push("/business/dashboard");
      }
    } catch (err) {
      setError(err.message || "Failed to claim company. Please check ownership criteria.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            Official Business Listing Claim
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Claim Your Company Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Take official ownership of your company listing. Anyone from the company can claim their profile to respond to reviews, update company details, and display verified TrustScore badges.
          </p>
        </div>

        {/* Targeted Company Banner (if arrived with ?company=slug) */}
        {selectedCompany && !selectedCompany.isClaimed && (
          <div className="bg-gradient-to-r from-amber-50 via-amber-50/70 to-orange-50 border border-amber-300/80 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-xl bg-white border border-amber-200 overflow-hidden p-1.5 shrink-0 flex items-center justify-center shadow-xs">
                {selectedCompany.logoUrl ? (
                  <img
                    src={selectedCompany.logoUrl}
                    alt={selectedCompany.name}
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      if (e.currentTarget.nextElementSibling) {
                        e.currentTarget.nextElementSibling.classList.remove("hidden");
                      }
                    }}
                  />
                ) : null}
                <span className={`font-black text-slate-800 text-base ${selectedCompany.logoUrl ? "hidden" : ""}`}>
                  {selectedCompany.name[0]}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{selectedCompany.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    Selected to Claim
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  {selectedCompany.websiteUrl || selectedCompany.category?.name || "Ready for instant claiming"}
                </p>
              </div>
            </div>

            <Button
              onClick={() => handleOpenClaimModal(selectedCompany)}
              variant="emerald"
              className="font-bold shrink-0 shadow-sm gap-1.5 w-full sm:w-auto"
            >
              <Shield className="w-4 h-4 text-amber-300" /> Claim {selectedCompany.name} Now
            </Button>
          </div>
        )}

        {/* Search Bar */}
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              icon={Search}
              placeholder="Search company name (e.g. Google, Apple, Amazon)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <Button type="submit" variant="emerald" className="font-bold shrink-0">
              Search
            </Button>
          </form>
        </div>

        {/* Results Grid */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-40 rounded-xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : companies.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                Company not found in our database?
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No problem! You can register a brand new business profile in seconds.
              </p>
              <Link href="/business/register" className="inline-block pt-2">
                <Button variant="emerald" size="sm">
                  Register New Company Listing →
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {companies.map((comp) => (
                <Card
                  key={comp.id}
                  className="p-5 border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow bg-white"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden p-1 shadow-xs">
                          {comp.logoUrl ? (
                            <img
                              src={comp.logoUrl}
                              alt={comp.name}
                              className="h-full w-full object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                if (e.currentTarget.nextElementSibling) {
                                  e.currentTarget.nextElementSibling.classList.remove("hidden");
                                }
                              }}
                            />
                          ) : null}
                          <span className={`text-slate-700 font-bold ${comp.logoUrl ? "hidden" : ""}`}>
                            {comp.name ? comp.name[0].toUpperCase() : "C"}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-slate-900 truncate">
                            {comp.name}
                          </h3>
                          {comp.category && (
                            <p className="text-[11px] text-slate-500 truncate">
                              {comp.category.name}
                            </p>
                          )}
                        </div>
                      </div>

                      {comp.isClaimed ? (
                        <Badge variant="verified" size="sm">
                          Claimed
                        </Badge>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Unclaimed
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {comp.description || "Registered company profile on ComplaintReview."}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">
                      ★ {comp.overallRating?.toFixed(1) || "0.0"} ({comp.reviewCount || 0} reviews)
                    </span>

                    {comp.isClaimed ? (
                      <span className="text-xs text-slate-400 font-medium">Already Managed</span>
                    ) : (
                      <Button
                        size="sm"
                        variant="emerald"
                        onClick={() => handleOpenClaimModal(comp)}
                        className="font-bold text-xs gap-1"
                      >
                        Claim Profile
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Bottom alternative */}
        <div className="text-center pt-8 border-t border-slate-200 text-xs text-slate-500">
          Can't find your company?{" "}
          <Link href="/business/register" className="font-bold text-emerald-600 hover:underline">
            Register a new company from scratch
          </Link>
        </div>
      </div>

      {/* Claim Confirmation Modal */}
      <Modal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        title={`Claim "${selectedCompany?.name}"`}
        description="Verify your authorization to manage this business on ComplaintReview."
      >
        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleClaimSubmit} className="space-y-4">
          <Input
            label="Your Official Job Title"
            placeholder="e.g. Managing Director, Operations Head, Marketing Lead"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />

          <Input
            label="Corporate Email Address"
            type="email"
            placeholder="you@companydomain.com"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            required
            helperText="Matches your registered organization domain"
          />

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-600 flex items-start gap-2">
            <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <span>
              By claiming, you confirm that you are an authorized representative of {selectedCompany?.name}.
              Claiming gives you full control to respond to customer reviews and update business information.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setClaimModalOpen(false)}
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
              Confirm & Claim Business
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function ClaimBusinessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 py-12 flex items-center justify-center">
        <div className="animate-pulse text-xs text-slate-500 font-semibold">Loading claim directory...</div>
      </div>
    }>
      <ClaimBusinessContent />
    </Suspense>
  );
}
