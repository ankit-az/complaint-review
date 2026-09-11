import React from "react";
import Link from "next/link";
import { ShieldCheck, Cpu, Fingerprint, Activity, CheckCircle2, Lock } from "lucide-react";

export const metadata = {
  title: "Anti-Fraud & Transparency Technology — Complaint-Review",
  description: "Learn how Complaint-Review uses automated fraud detection and verification algorithms to protect review integrity.",
};

export default function TransparencyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
            Anti-Fraud Technology & Trust Transparency
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            How our multi-layered behavioral heuristics and algorithmic checks ensure you can trust every rating on Complaint-Review.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Fingerprint className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-base">Sybil & Sockpuppet Detection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We monitor device fingerprinting, IP reputation clusters, and rapid account generation patterns to block coordinated spam attacks and astroturfing campaigns before reviews go live.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-base">Anomaly Spike Detection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When a company suddenly receives an abnormal volume of 1-star or 5-star reviews outside their standard baseline, our system places the profile under investigation and alerts our moderation team.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-base">Verified Purchase Signals</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Consumers can upload order confirmations, receipts, and service tickets. Verified purchase reviews receive distinct badges and higher weighting in overall company TrustScore calculations.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-base">Zero Pay-to-Delete Policy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlike traditional rating directories, businesses cannot pay us to remove critical reviews, alter their TrustScore, or silence consumer feedback. Our revenue comes from enterprise tools, not censorship.
            </p>
          </div>
        </div>

        {/* Action Link */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span className="text-slate-600">Spot something suspicious that slipped through?</span>
          <Link
            href="/report-abuse"
            className="text-rose-600 font-semibold hover:underline"
          >
            Report content violation →
          </Link>
        </div>
      </div>
    </div>
  );
}
