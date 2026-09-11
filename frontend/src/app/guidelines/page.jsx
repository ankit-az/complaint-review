import React from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, BookOpen, AlertTriangle, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Review Guidelines & Policy — Complaint-Review",
  description: "Rules and guidelines for writing constructive, authentic reviews on Complaint-Review.",
};

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
            Review Guidelines & Community Policy
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Our guidelines ensure Complaint-Review remains the most trusted source of real consumer experiences. Every review must follow these principles.
          </p>
        </div>

        {/* Dos and Don'ts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Do */}
          <div className="bg-white rounded-2xl border border-emerald-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-700 font-bold mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>What to Do</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span><strong>Write from first-hand experience:</strong> Review companies you have personally transacted with or used.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span><strong>Be specific and factual:</strong> Include dates, clear details, order numbers or dispute context.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span><strong>Remain constructive:</strong> Explain what went wrong or what went well with courteous language.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span><strong>Update your review:</strong> If the company resolves your issue, update your rating to reflect the outcome.</span>
              </li>
            </ul>
          </div>

          {/* Don't */}
          <div className="bg-white rounded-2xl border border-rose-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-rose-700 font-bold mb-4">
              <XCircle className="w-5 h-5 text-rose-600" />
              <span>What is Prohibited</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span><strong>No incentivized or fake reviews:</strong> Reviews for payment, discounts, or gifts will be permanently deleted.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span><strong>No personal identifying information:</strong> Do not post private phone numbers, home addresses, or staff full names.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span><strong>No hate speech or harassment:</strong> Profanity, hate speech, threats, and defamatory attacks are strictly prohibited.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span><strong>No competitor sabotage:</strong> Business owners or employees may not review their direct competitors.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Business link callout */}
        <div className="bg-emerald-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-base mb-1">Are you a business owner?</h3>
            <p className="text-xs text-emerald-200">
              Read our specific guidelines on how to respond to customer complaints and claim your profile.
            </p>
          </div>
          <Link
            href="/guidelines/business"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-xl transition-colors shrink-0"
          >
            Business Guidelines
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
