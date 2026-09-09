"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/AuthContext";
import api from "@/lib/api";
import {
  Shield,
  Building2,
  Mail,
  Lock,
  Globe,
  Phone,
  MapPin,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function BusinessRegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    companyName: "",
    websiteUrl: "",
    contactPhone: "",
    categoryId: "",
    country: "United States",
    city: "",
    address: "",
    jobTitle: "Business Owner",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get("/categories");
        if (res?.success && res.data?.categories) {
          setCategories(res.data.categories);
          if (res.data.categories.length > 0) {
            setFormData((prev) => ({ ...prev, categoryId: res.data.categories[0].id }));
          }
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.post("/business/register", formData);
      if (res?.success) {
        await refreshUser();
        router.push("/business/dashboard");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please verify your details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/business" className="inline-flex items-center gap-2 mb-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-105">
              <Shield className="h-5 w-5 stroke-[2.4]" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Register Your Business on <span className="text-emerald-400">ComplaintReview</span>
          </h2>
          <p className="mt-2 text-xs text-slate-400 max-w-md mx-auto">
            Create your official business account, claim your listing, and start managing verified customer trust.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-800/20 shadow-2xl space-y-6">
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Account Owner Details */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Step 1: Account Owner Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="Alex"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  required
                />
                <Input
                  label="Last Name"
                  placeholder="Morgan"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Input
                  label="Official Business Email"
                  type="email"
                  icon={Mail}
                  placeholder="alex@company.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  autoComplete="email"
                  helperText="Corporate domain email recommended"
                />
                <Input
                  label="Your Job Title"
                  placeholder="e.g. Founder, Marketing Director"
                  value={formData.jobTitle}
                  onChange={(e) => handleChange("jobTitle", e.target.value)}
                  required
                />
              </div>

              <div className="mt-4">
                <Input
                  label="Create Password"
                  type={showPassword ? "text" : "password"}
                  icon={Lock}
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                  autoComplete="new-password"
                  helperText="Must be at least 8 characters"
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
              </div>
            </div>

            <div className="h-px bg-slate-100 my-4" />

            {/* Company Details */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                Step 2: Company Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Registered Company Name"
                  icon={Building2}
                  placeholder="e.g. Acme Technologies, Inc."
                  value={formData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  required
                />

                <Input
                  label="Company Website URL"
                  type="url"
                  icon={Globe}
                  placeholder="https://acme.example"
                  value={formData.websiteUrl}
                  onChange={(e) => handleChange("websiteUrl", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Primary Industry Category
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => handleChange("categoryId", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Contact Phone"
                  type="tel"
                  icon={Phone}
                  placeholder="+1 (555) 000-0000"
                  value={formData.contactPhone}
                  onChange={(e) => handleChange("contactPhone", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <Input
                  label="Country"
                  placeholder="United States"
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                />
                <Input
                  label="City"
                  placeholder="San Francisco"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
                <Input
                  label="Headquarters Address"
                  placeholder="100 Market St"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              </div>
            </div>

            {/* Trust Pledge Note */}
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-[11px] text-emerald-900 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                By registering, you commit to upholding ComplaintReview's Trust & Transparency Guidelines. Paying for reviews, offering incentives for positive reviews, or fabricating complaints will result in permanent listing de-certification.
              </span>
            </div>

            <Button
              type="submit"
              variant="emerald"
              size="lg"
              isLoading={isLoading}
              className="w-full font-bold shadow-md shadow-emerald-600/20"
            >
              Complete Registration & Open Dashboard <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Already registered?{" "}
              <Link href="/business/login" className="font-bold text-emerald-600 hover:underline">
                Sign in to portal
              </Link>
            </span>
            <Link href="/business/claim" className="font-semibold text-slate-700 hover:underline">
              Claim existing company →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
