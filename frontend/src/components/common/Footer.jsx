import React from "react";
import Link from "next/link";
import { Shield, CheckCircle2, Heart, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      {/* Trust Commitment Strip */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-4 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Zero tolerance for fake reviews and paid ratings.</span>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Platform Status: Operational
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Worldwide Trust Index
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-emerald-400 border border-slate-700">
                <Shield className="h-5 w-5 fill-emerald-500/20 stroke-emerald-400 stroke-[2.2]" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Complaint<span className="text-emerald-400">Review</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              The independent review and complaint intelligence platform connecting
              honest consumers with transparent businesses. Built on accountability,
              genuine human feedback, and automated fraud prevention.
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Real Experiences. Verified Trust.
              </span>
            </div>
          </div>

          {/* Col 2: Popular Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore Categories
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/categories/technology"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Software & Technology
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/e-commerce"
                  className="hover:text-emerald-400 transition-colors"
                >
                  E-Commerce & Online Stores
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/banking-finance"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Banking & Financial Services
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/travel-hospitality"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Travel & Hospitality
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/healthcare"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Health & Wellness
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-emerald-400 font-semibold hover:underline"
                >
                  Browse all categories →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Businesses */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              For Businesses
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/business"
                  className="hover:text-emerald-400 transition-colors font-medium text-emerald-300"
                >
                  Claim Your Free Business Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/business/dashboard"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Business Portal Login
                </Link>
              </li>
              <li>
                <Link
                  href="/business#features"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Reputation & Dispute Resolution
                </Link>
              </li>
              <li>
                <Link
                  href="/business#pricing"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Business Trust Solutions
                </Link>
              </li>
              <li>
                <Link
                  href="/guidelines/business"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Business Review Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Transparency */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Trust & Community
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/guidelines"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Review Guidelines & Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/transparency"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Our Anti-Fraud Technology
                </Link>
              </li>
              <li>
                <Link
                  href="/report-abuse"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Report Inappropriate Content
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Complaint-Review, Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Engineered for radical consumer transparency</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
