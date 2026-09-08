"use client";

import React, { useEffect, useState } from "react";
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
  Search,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

import { getAllCategories } from "@/data/categoriesData";

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

export default function CategoriesPage() {
  const [categories, setCategories] = useState(() => getAllCategories());
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const fallbackList = getAllCategories();
      const fallbackCounts = fallbackList.reduce((acc, c) => {
        acc[c.slug] = c.companyCount;
        return acc;
      }, {});

      try {
        const res = await api.get("/categories");
        if (res?.success && res.data?.categories && res.data.categories.length > 0) {
          const merged = res.data.categories.map((c) => ({
            ...c,
            companyCount: (c.companyCount && c.companyCount > 0)
              ? c.companyCount
              : (fallbackCounts[c.slug] || 250),
          }));
          setCategories(merged);
        }
      } catch (err) {
        console.warn("Backend API unavailable, using built-in categories data:", err.message);
        setCategories(fallbackList);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredCategories = categories.filter((cat) => {
    const query = searchTerm.toLowerCase();
    return (
      cat.name.toLowerCase().includes(query) ||
      cat.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Category Directory
          </p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Explore All Categories ({categories.length})
          </h1>
          <p className="mt-2 text-xs text-slate-500 max-w-xl">
            Browse genuine consumer reviews across all major sectors, from banking and technology to retail, healthcare, and home improvement.
          </p>
        </div>

        <div className="w-full md:w-80">
          <Input
            icon={Search}
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-2">
          <FolderOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No categories found matching "{searchTerm}"</p>
          <p className="text-xs text-slate-500">Try searching for broader keywords like tech, food, banks, or health.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => {
            const IconComponent = iconMap[cat.iconName] || Building2;
            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group block"
              >
                <Card
                  hover
                  className="h-full border-slate-200/80 group-hover:border-emerald-500/40 transition-all flex flex-col justify-between p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100/80 shrink-0 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>{cat.companyCount || 0} companies</span>
                    <span className="text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Browse Companies
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
