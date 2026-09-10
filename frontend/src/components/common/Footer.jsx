"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, CheckCircle2, Globe } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // Hide consumer footer on dedicated SaaS business dashboard routes
  if (pathname?.startsWith("/business/") && pathname !== "/business") {
    return null;
  }

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      {/* Trust Commitment Strip */}
      <div className="border-b border-slate-800/80 bg-slate-900/50 py-4 px-4 sm:px-6 lg:px-8">
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
          {/* Col 1: Brand, Mission & Social Links */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-emerald-400 border border-slate-800">
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
            <div className="pt-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-3">
                Real Experiences. Verified Trust.
              </span>
              {/* Social Follow Links */}
              <div className="flex items-center gap-2.5 text-slate-400">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors border border-slate-700/60"
                  aria-label="Facebook"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors border border-slate-700/60"
                  aria-label="X"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors border border-slate-700/60"
                  aria-label="Instagram"
                >
                  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"></circle>
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors border border-slate-700/60"
                  aria-label="LinkedIn"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors border border-slate-700/60"
                  aria-label="YouTube"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
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

          {/* Col 4: Trust & Community */}
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

        {/* Security & reCAPTCHA Notice Strip */}
        <div className="mt-10 pt-6 border-t border-slate-800/80">
          <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
            This site is protected by reCAPTCHA. We collect device and interaction signals for security purposes as described in our{" "}
            <Link href="/privacy" className="text-slate-300 underline hover:text-white">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="mt-6 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
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
