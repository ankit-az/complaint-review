import React from "react";
import Link from "next/link";
import { Building2, ShieldCheck, MessageSquare, Check, AlertCircle, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Business Guidelines & Code of Conduct — Complaint-Review",
  description: "Rules, etiquette, and compliance guidelines for verified business accounts on Complaint-Review.",
};

export default function BusinessGuidelinesPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/guidelines"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to General Guidelines
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-4">
            <Building2 className="w-3.5 h-3.5" />
            Merchant Guidelines
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
            Business Review Guidelines & Code of Conduct
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            How verified merchants and enterprise accounts must interact with consumers, resolve customer disputes, and manage reviews.
          </p>
        </div>

        {/* Standards */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8 text-slate-700 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              1. Constructive Public Responses
            </h2>
            <p>
              When responding to consumer reviews or negative complaints, maintain a professional, empathetic tone. Acknowledge customer frustration, state facts objectively, and provide a direct resolution channel (such as a support ticket ID or senior resolution email).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              2. Strict Non-Incentivization Rule
            </h2>
            <p className="mb-2">
              It is strictly forbidden under FTC regulations and Complaint-Review policy to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Offer gift cards, discounts, free goods, or cash in exchange for positive reviews or review removal.</li>
              <li>Filter review invitations (review gating) to only invite happy customers while silencing critical customers.</li>
              <li>Ask employees, contractors, or agency partners to post reviews for your business.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-emerald-600" />
              3. Dispute Flags & Investigation Process
            </h2>
            <p>
              If you believe a review is entirely fabricated or violates our community guidelines (e.g., posted by someone who never transacted with you), you may flag it directly from your Business Dashboard. Our automated and human moderation team will investigate evidence within 48 hours.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span>Ready to manage your presence?</span>
            <Link
              href="/business"
              className="font-semibold text-emerald-600 hover:underline"
            >
              Go to Business Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
