import React from "react";
import Link from "next/link";
import { Lock, Eye, ShieldCheck, Database, Cookie, Mail } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — Complaint-Review",
  description: "Learn how Complaint-Review protects your personal information and privacy.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Last updated: September 10, 2026. We are committed to transparency in how we collect, store, and process your data.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8 text-slate-700 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-600" />
              1. Information We Collect
            </h2>
            <p className="mb-2">
              We collect information you provide directly to us when you create an account, write a review, or communicate with us:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li><strong>Account Details:</strong> Name, email address, password hash, and optional profile picture.</li>
              <li><strong>User Content:</strong> Review text, ratings, evidence attachments, and company responses.</li>
              <li><strong>Technical Signals:</strong> IP address, browser type, device information, and interaction timestamps used strictly for fraud prevention.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" />
              2. How We Use Your Data
            </h2>
            <p>
              Your data is used to provide, maintain, and improve our services, authenticate your identity, detect spam or coordinated fraudulent reviews, and facilitate fair dispute resolution between consumers and businesses.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Cookie className="w-5 h-5 text-emerald-600" />
              3. Cookies and Tracking
            </h2>
            <p>
              We use secure, HTTP-only cookies to store authentication tokens (session management) and prevent cross-site forgery. We do not sell your personal browsing habits to third-party advertising brokers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              4. Data Retention & Security
            </h2>
            <p>
              We implement industry-standard encryption (TLS/HTTPS, salted bcrypt password hashing, and encrypted database connections) to safeguard your data. You may request account deletion at any time.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-slate-400" />
              privacy@complaint-review.com
            </span>
            <div className="flex gap-4">
              <Link href="/terms" className="text-emerald-600 hover:underline">Terms of Service</Link>
              <Link href="/transparency" className="text-emerald-600 hover:underline">Transparency Tech</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
