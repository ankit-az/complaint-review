"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import {
  Laptop,
  CreditCard,
  ShoppingBag,
  ShieldCheck,
  Plane,
  HeartPulse,
  Car,
  Utensils,
  GraduationCap,
  Home,
  Wrench,
  Sparkles,
  Dumbbell,
  Scale,
  Megaphone,
  Wifi,
  Zap,
  Film,
  Dog,
  Truck,
  PartyPopper,
  Factory,
  Heart,
  Baby,
  Building2,
  FolderOpen,
  ArrowRight,
  ArrowLeft,
  Search,
  Star,
  CheckCircle2,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";

import { getCategoryBySlug } from "@/data/categoriesData";

const iconMap = {
  Laptop,
  CreditCard,
  ShoppingBag,
  ShieldCheck,
  Plane,
  HeartPulse,
  Car,
  Utensils,
  GraduationCap,
  Home,
  Wrench,
  Sparkles,
  Dumbbell,
  Scale,
  Megaphone,
  Wifi,
  Zap,
  Film,
  Dog,
  Truck,
  PartyPopper,
  Factory,
  Heart,
  Baby,
  Building2,
};

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  const [category, setCategory] = useState(() => (slug ? getCategoryBySlug(slug) : null));
  const [companies, setCompanies] = useState(() => {
    const fallback = slug ? getCategoryBySlug(slug) : null;
    return fallback?.companies || [];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    const fetchCategory = async () => {
      try {
        const res = await api.get(`/categories/${slug}`);
        if (res?.success && res.data?.category) {
          setCategory(res.data.category);
          setCompanies(res.data.category.companies || []);
          setError(null);
        } else {
          const fallback = getCategoryBySlug(slug);
          if (fallback) {
            setCategory(fallback);
            setCompanies(fallback.companies || []);
            setError(null);
          } else {
            setError("Category not found");
          }
        }
      } catch (err) {
        // Fall back gracefully to internal dataset for live Vercel
        const fallback = getCategoryBySlug(slug);
        if (fallback) {
          setCategory(fallback);
          setCompanies(fallback.companies || []);
          setError(null);
        } else {
          setError(err.message || "Failed to load category details");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        <div className="h-40 bg-slate-200 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full text-center space-y-4 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <FolderOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h1 className="text-xl font-bold text-slate-900">Category Not Found</h1>
          <p className="text-xs text-slate-500">
            The category you are looking for does not exist or has been modified.
          </p>
          <Link href="/categories">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Browse All Categories
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[category.iconName] || Building2;
  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Category Hero Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-4">
            <Link href="/categories" className="hover:text-emerald-600 transition-colors">
              Categories
            </Link>
            <span>/</span>
            <span className="text-slate-800">{category.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                <IconComponent className="h-8 w-8" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {category.name}
                </h1>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                  {category.description || "Explore and compare customer reviews for verified companies in this category."}
                </p>
                <div className="mt-2 text-xs font-semibold text-emerald-700">
                  {companies.length} {companies.length === 1 ? "company" : "companies"} listed in this sector
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/writereview">
                <Button variant="emerald" size="sm" className="font-bold gap-1.5 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Write a Review
                </Button>
              </Link>
              <Link href="/business/register">
                <Button variant="outline" size="sm" className="font-bold gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> List Your Business
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Search Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Companies in {category.name}
          </h2>

          <div className="w-72">
            <Input
              icon={Search}
              placeholder="Filter companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {companies.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 border-slate-200 bg-white space-y-3">
            <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">
              No registered companies in {category.name} yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Be the first to review a business in this sector or register your company to establish trust.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link href="/writereview">
                <Button variant="emerald" size="sm" className="font-bold">
                  Write a Review Now
                </Button>
              </Link>
              <Link href="/business/register">
                <Button variant="outline" size="sm">
                  Register Your Business
                </Button>
              </Link>
            </div>
          </Card>
        ) : filteredCompanies.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
            No companies matched "{searchTerm}".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((comp) => (
              <Link key={comp.id} href={`/companies/${comp.slug}`} className="group block">
                <Card
                  hover
                  className="h-full border-slate-200/80 group-hover:border-emerald-500/40 transition-all flex flex-col justify-between p-5 bg-white"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-base shrink-0 group-hover:bg-emerald-600 transition-colors">
                          {comp.logoUrl ? (
                            <img src={comp.logoUrl} alt={comp.name} className="h-full w-full object-cover rounded-xl" />
                          ) : (
                            comp.name ? comp.name[0].toUpperCase() : "C"
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {comp.name}
                          </h3>
                          <span className="text-[11px] text-slate-400">
                            {[comp.city, comp.country].filter(Boolean).join(", ") || "Global"}
                          </span>
                        </div>
                      </div>

                      {comp.isVerified && (
                        <Badge variant="verified" size="sm">
                          Verified
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {comp.description || "Registered business profile on ComplaintReview."}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <StarRating rating={comp.overallRating || 0} size="sm" showScore />
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 font-medium">
                        {comp.reviewCount || 0} reviews
                      </span>
                    </div>

                    <span className="font-semibold text-emerald-600 group-hover:underline">
                      View Profile →
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
