"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Code2,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Shield,
  Star,
  Eye,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StarRating from "@/components/ui/StarRating";

export default function BusinessWidgetsPage() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // Widget customizer states
  const [widgetType, setWidgetType] = useState("badge"); // badge, score, carousel
  const [theme, setTheme] = useState("light"); // light, dark, emerald
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const loadContext = async () => {
      try {
        const res = await api.get("/business/me");
        if (res?.success && res.data?.company) {
          setCompany(res.data.company);
        }
      } catch (err) {
        console.error("Failed to load company for widget:", err);
      } finally {
        setLoading(false);
      }
    };
    loadContext();
  }, []);

  const embedScript = `<!-- ComplaintReview Trust Widget -->
<div 
  id="complaint-review-widget" 
  data-company-slug="${company?.slug || "your-company"}" 
  data-widget-type="${widgetType}" 
  data-theme="${theme}"
></div>
<script src="${typeof window !== "undefined" ? window.location.origin : "https://complaint-review.com"}/api/business/widgets/public/${company?.slug || "slug"}" async></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSaveConfig = async () => {
    try {
      await api.put("/business/widgets", {
        widgetType,
        theme,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert("Failed to save widget configuration");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-slate-200 rounded-xl w-64 animate-pulse" />
        <div className="h-80 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const rating = company?.overallRating || 4.8;
  const count = company?.reviewCount || 24;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Review Widgets Studio</h2>
        <p className="text-xs text-slate-500 mt-1">
          Generate embeddable badges and rating widgets to display verified customer trust on your website.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Widget preferences saved successfully!</span>
        </div>
      )}

      {/* Grid: Customizer on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customizer Controls */}
        <Card className="p-6 border-slate-200 bg-white space-y-6">
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Choose Widget Layout
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "badge", label: "Compact Badge", desc: "Small footer badge" },
                { id: "score", label: "Rating Card", desc: "TrustScore & stars" },
                { id: "carousel", label: "Review Card", desc: "Includes quote" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setWidgetType(item.id)}
                  className={`p-3 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                    widgetType === item.id
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20"
                      : "border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50"
                  }`}
                >
                  <p>{item.label}</p>
                  <p className="text-[10px] text-slate-500 font-normal mt-0.5">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              2. Widget Color Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "light", label: "Clean Light", bg: "bg-white border-slate-300 text-slate-900" },
                { id: "dark", label: "Sleek Dark", bg: "bg-slate-900 border-slate-700 text-white" },
                { id: "emerald", label: "Trust Emerald", bg: "bg-emerald-600 border-emerald-500 text-white" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTheme(item.id)}
                  className={`p-3 rounded-xl text-center border text-xs font-semibold transition-all cursor-pointer ${
                    theme === item.id ? "ring-2 ring-emerald-500 ring-offset-2" : ""
                  } ${item.bg}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Embed Code Snippet */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Copy Embed Code</span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-emerald-600 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
              {embedScript}
            </pre>
          </div>

          <Button
            size="sm"
            variant="emerald"
            onClick={handleSaveConfig}
            className="w-full font-bold"
          >
            Save Widget Configuration
          </Button>
        </Card>

        {/* Live Interactive Preview Box */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-600" /> Live Interactive Preview
            </span>
            <span>Renders exactly on your site</span>
          </div>

          <div className="p-8 rounded-2xl bg-slate-100 border border-slate-200/80 min-h-[320px] flex items-center justify-center">
            {/* Widget Variant 1: Compact Badge */}
            {widgetType === "badge" && (
              <div
                className={`px-4 py-2.5 rounded-xl shadow-md border flex items-center gap-3 transition-all ${
                  theme === "dark"
                    ? "bg-slate-900 text-white border-slate-800"
                    : theme === "emerald"
                    ? "bg-emerald-600 text-white border-emerald-500"
                    : "bg-white text-slate-900 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-1.5 font-black text-sm">
                  <Shield className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                  <span>{rating.toFixed(1)}</span>
                </div>
                <div className="h-4 w-px bg-slate-300/40" />
                <div className="flex flex-col">
                  <StarRating rating={rating} size="sm" />
                  <span className={`text-[10px] font-semibold mt-0.5 ${theme === "light" ? "text-slate-500" : "text-slate-300"}`}>
                    {company?.name || "Company"} • {count} Reviews
                  </span>
                </div>
              </div>
            )}

            {/* Widget Variant 2: Rating Card */}
            {widgetType === "score" && (
              <div
                className={`p-6 rounded-2xl shadow-xl border w-full max-w-sm text-center space-y-3 transition-all ${
                  theme === "dark"
                    ? "bg-slate-900 text-white border-slate-800"
                    : theme === "emerald"
                    ? "bg-emerald-700 text-white border-emerald-600"
                    : "bg-white text-slate-900 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-current/10">
                  <span className="font-bold text-xs truncate">{company?.name || "Company"}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase opacity-90">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified
                  </span>
                </div>

                <div className="py-2">
                  <p className="text-4xl font-black">{rating.toFixed(1)}</p>
                  <div className="flex justify-center mt-1">
                    <StarRating rating={rating} size="md" />
                  </div>
                  <p className={`text-xs mt-2 font-medium ${theme === "light" ? "text-slate-500" : "text-emerald-100"}`}>
                    Based on <strong>{count} customer reviews</strong>
                  </p>
                </div>

                <div className="pt-2 border-t border-current/10 flex items-center justify-between text-[11px] opacity-80">
                  <span>Rated "Excellent"</span>
                  <span>ComplaintReview</span>
                </div>
              </div>
            )}

            {/* Widget Variant 3: Review Carousel Card */}
            {widgetType === "carousel" && (
              <div
                className={`p-6 rounded-2xl shadow-xl border w-full max-w-sm space-y-3 transition-all ${
                  theme === "dark"
                    ? "bg-slate-900 text-white border-slate-800"
                    : theme === "emerald"
                    ? "bg-emerald-700 text-white border-emerald-600"
                    : "bg-white text-slate-900 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <StarRating rating={5} size="sm" />
                  <span className="text-[10px] opacity-70">2 days ago</span>
                </div>

                <p className="text-xs italic leading-relaxed">
                  "Outstanding customer support and transparent resolution. Best experience we've had with {company?.name || "this business"}!"
                </p>

                <div className="pt-2 border-t border-current/10 flex items-center justify-between text-xs">
                  <span className="font-bold text-[11px]">Marcus V. (Verified Buyer)</span>
                  <span className="font-bold text-emerald-400 text-[10px] flex items-center gap-1">
                    <Shield className="w-3 h-3" /> ComplaintReview
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
