"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Flag, AlertTriangle, CheckCircle2, Send, ShieldAlert, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ReportAbusePage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    url: "",
    reason: "fake_review",
    details: "",
    email: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold mb-4">
            <ShieldAlert className="w-3.5 h-3.5" />
            Integrity Support
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
            Report Inappropriate Content or Abuse
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            If you encounter fraudulent reviews, hate speech, harassment, or violations of our community policies, let us know immediately.
          </p>
        </div>

        {/* Form or Success State */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Report Received</h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
                Thank you for helping keep Complaint-Review trusted. Our trust & safety moderation team will investigate this report within 24–48 hours.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setForm({ url: "", reason: "fake_review", details: "", email: "" });
                }}
              >
                Submit another report
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  URL of Review or Profile *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.complaint-review.com/companies/..."
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Reason for Report *
                </label>
                <select
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                >
                  <option value="fake_review">Suspected Fake or Incentivized Review</option>
                  <option value="hate_speech">Hate Speech, Harassment, or Profanity</option>
                  <option value="pii">Private Identifying Information (Phone, Address)</option>
                  <option value="competitor">Competitor Sabotage / Conflict of Interest</option>
                  <option value="impersonation">Impersonation or False Claims</option>
                  <option value="other">Other Community Violation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Detailed Explanation *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please provide specific details or evidence supporting your report..."
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Your Contact Email (Optional for updates)
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  Submit Report for Investigation
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
