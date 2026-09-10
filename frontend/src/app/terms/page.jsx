import React from "react";
import Link from "next/link";
import { FileText, Shield, Scale, AlertCircle, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Terms of Service — Complaint-Review",
  description: "Read our terms of service and rules for using the Complaint-Review platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-4">
            <Scale className="w-3.5 h-3.5" />
            Legal Agreement
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
            Terms of Service
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Last updated: September 10, 2026. Please read these terms carefully before using Complaint-Review.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8 text-slate-700 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Complaint-Review (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time with prior notice on this page.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              2. User Accounts & Responsibilities
            </h2>
            <p className="mb-2">
              When creating an account, you must provide accurate, current, and complete information. You are responsible for safeguarding your password and account activities.
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>You must be at least 18 years old to create an account.</li>
              <li>You may not impersonate any person or entity.</li>
              <li>You agree not to post defamatory, offensive, or unlawful content.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              3. Review Integrity & Consumer Experience
            </h2>
            <p>
              All reviews must represent genuine, first-hand consumer experiences. Businesses may not incentivize, manipulate, or fabricate reviews. Any attempts to artificially inflate ratings or submit fraudulent reviews will result in account suspension and public fraud warnings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-emerald-600" />
              4. Dispute Resolution & Content Moderation
            </h2>
            <p>
              Complaint-Review is an open platform committed to neutral facilitation. We reserve the right, but have no obligation, to remove or edit content that violates our policies or community standards.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span>Questions regarding our terms?</span>
            <div className="flex gap-4">
              <Link href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</Link>
              <Link href="/guidelines" className="text-emerald-600 hover:underline">Review Guidelines</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
