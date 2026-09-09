"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Camera,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Save,
  Eye,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import StarRating from "@/components/ui/StarRating";

export default function BusinessProfilePage() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logoUrl: "",
    coverImageUrl: "",
    websiteUrl: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    city: "",
    country: "",
    categoryId: "",
    socialLinks: {
      twitter: "",
      linkedin: "",
      facebook: "",
      instagram: "",
    },
    businessHours: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 6:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
  });

  const [companyStats, setCompanyStats] = useState({
    overallRating: 4.8,
    reviewCount: 0,
    isVerified: false,
    slug: "",
  });

  const fetchProfileAndCategories = async () => {
    setLoading(true);
    try {
      const [profileRes, catRes] = await Promise.all([
        api.get("/business/profile"),
        api.get("/categories"),
      ]);

      if (catRes?.success && catRes.data?.categories) {
        setCategories(catRes.data.categories);
      }

      if (profileRes?.success && profileRes.data?.company) {
        const comp = profileRes.data.company;
        setFormData({
          name: comp.name || "",
          description: comp.description || "",
          logoUrl: comp.logoUrl || "",
          coverImageUrl: comp.coverImageUrl || "",
          websiteUrl: comp.websiteUrl || "",
          contactEmail: comp.contactEmail || "",
          contactPhone: comp.contactPhone || "",
          address: comp.address || "",
          city: comp.city || "",
          country: comp.country || "",
          categoryId: comp.categoryId || "",
          socialLinks: comp.socialLinks || {
            twitter: "",
            linkedin: "",
            facebook: "",
            instagram: "",
          },
          businessHours: comp.businessHours || {
            monday: "9:00 AM - 6:00 PM",
            tuesday: "9:00 AM - 6:00 PM",
            wednesday: "9:00 AM - 6:00 PM",
            thursday: "9:00 AM - 6:00 PM",
            friday: "9:00 AM - 6:00 PM",
            saturday: "Closed",
            sunday: "Closed",
          },
        });

        setCompanyStats({
          overallRating: comp.overallRating || 0.0,
          reviewCount: comp.reviewCount || 0,
          isVerified: comp.isVerified,
          slug: comp.slug,
        });
      }
    } catch (err) {
      setError(err.message || "Failed to load company profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndCategories();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (network, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [network]: value },
    }));
  };

  const handleHoursChange = (day, value) => {
    setFormData((prev) => ({
      ...prev,
      businessHours: { ...prev.businessHours, [day]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const res = await api.put("/business/profile", formData);
      if (res?.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-slate-200 rounded-xl w-64 animate-pulse" />
        <div className="h-96 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Company Profile</h2>
          <p className="text-xs text-slate-500 mt-1">
            Customize how your brand appears on ComplaintReview to millions of potential customers.
          </p>
        </div>

        {companyStats.slug && (
          <a
            href={`/companies/${companyStats.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors self-start sm:self-auto"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Public Page
          </a>
        )}
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile updated successfully! All changes are now live on your public page.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Edit Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Identity */}
          <Card className="p-6 border-slate-200 bg-white space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" /> Basic Brand Information
            </h3>

            <Input
              label="Company Legal / Display Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">About the Company</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe your company, core products, services, and commitment to customer satisfaction..."
                className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Logo Image URL"
                placeholder="https://example.com/logo.png"
                value={formData.logoUrl}
                onChange={(e) => handleChange("logoUrl", e.target.value)}
                helperText="Square 400x400 PNG or SVG recommended"
              />
              <Input
                label="Cover Banner URL"
                placeholder="https://example.com/banner.jpg"
                value={formData.coverImageUrl}
                onChange={(e) => handleChange("coverImageUrl", e.target.value)}
                helperText="1200x400 landscape format recommended"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Industry Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleChange("categoryId", e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </Card>

          {/* Contact Details */}
          <Card className="p-6 border-slate-200 bg-white space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" /> Contact & Location Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Official Website URL"
                type="url"
                icon={Globe}
                value={formData.websiteUrl}
                onChange={(e) => handleChange("websiteUrl", e.target.value)}
              />
              <Input
                label="Support / Contact Email"
                type="email"
                icon={Mail}
                value={formData.contactEmail}
                onChange={(e) => handleChange("contactEmail", e.target.value)}
              />
              <Input
                label="Customer Support Phone"
                type="tel"
                icon={Phone}
                value={formData.contactPhone}
                onChange={(e) => handleChange("contactPhone", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Headquarters Address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
              <Input
                label="Country"
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
              />
            </div>
          </Card>

          {/* Social Profiles & Hours */}
          <Card className="p-6 border-slate-200 bg-white space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Social Links & Operating Hours
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="X (Twitter) Profile"
                placeholder="https://x.com/yourhandle"
                value={formData.socialLinks?.twitter || ""}
                onChange={(e) => handleSocialChange("twitter", e.target.value)}
              />
              <Input
                label="LinkedIn Company Page"
                placeholder="https://linkedin.com/company/yourhandle"
                value={formData.socialLinks?.linkedin || ""}
                onChange={(e) => handleSocialChange("linkedin", e.target.value)}
              />
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Weekly Operating Hours
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map(
                  (day) => (
                    <div key={day} className="flex items-center justify-between gap-2">
                      <span className="capitalize font-semibold text-slate-600 w-24">{day}:</span>
                      <input
                        type="text"
                        value={formData.businessHours?.[day] || ""}
                        onChange={(e) => handleHoursChange(day, e.target.value)}
                        className="flex-1 rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </Card>

          <Button type="submit" variant="emerald" size="lg" isLoading={isSaving} className="font-bold gap-2">
            <Save className="w-4 h-4" /> Save Profile Changes
          </Button>
        </div>

        {/* Right Column: Live Interactive Card Preview */}
        <div className="space-y-4">
          <div className="sticky top-24 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-600" /> Live Public Preview
              </span>
              <span>Consumer View</span>
            </div>

            <Card className="border-slate-200 bg-white overflow-hidden shadow-md">
              {/* Cover Banner */}
              <div
                className="h-28 bg-slate-800 bg-cover bg-center relative"
                style={{
                  backgroundImage: formData.coverImageUrl ? `url(${formData.coverImageUrl})` : undefined,
                }}
              >
                {!formData.coverImageUrl && (
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800 opacity-90" />
                )}
              </div>

              <div className="p-5 pt-0 relative space-y-4">
                {/* Logo & Verification Badge */}
                <div className="flex items-end justify-between -mt-8 mb-2">
                  <div className="h-16 w-16 rounded-2xl bg-white border-2 border-white shadow-md flex items-center justify-center font-bold text-xl text-slate-900 overflow-hidden bg-slate-100">
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl} alt="Logo" className="h-full w-full object-cover" />
                    ) : (
                      formData.name ? formData.name[0].toUpperCase() : "B"
                    )}
                  </div>

                  {companyStats.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {formData.name || "Company Name"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formData.city && formData.country ? `${formData.city}, ${formData.country}` : "Headquarters"}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <StarRating rating={companyStats.overallRating} size="sm" showScore />
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 font-medium">
                    {companyStats.reviewCount} reviews
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {formData.description || "Company description will appear here..."}
                </p>

                <div className="pt-3 border-t border-slate-100 text-xs space-y-1.5 text-slate-500">
                  {formData.websiteUrl && (
                    <div className="flex items-center gap-2 truncate">
                      <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{formData.websiteUrl}</span>
                    </div>
                  )}
                  {formData.contactPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{formData.contactPhone}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
