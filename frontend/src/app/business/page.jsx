"use client";

import React from "react";
import Link from "next/link";
import {
  Shield,
  Star,
  CheckCircle2,
  TrendingUp,
  MessageSquareQuote,
  Send,
  BarChart3,
  Code2,
  ArrowRight,
  Building2,
  Lock,
  Sparkles,
  Users,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StarRating from "@/components/ui/StarRating";

export default function BusinessLandingPage() {
  return (
    <div className="bg-white min-h-screen text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative mx-auto max-w-5xl text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Turn Real Customer Trust Into Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Greatest Advantage
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Manage your online reputation, respond to genuine customer reviews, invite buyers, and showcase verified trust badges that convert visitors into loyal customers.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/business/register">
              <Button variant="emerald" size="lg" className="w-full sm:w-auto font-bold gap-2 shadow-lg shadow-emerald-500/20">
                Create Free Business Account <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/business/login">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-slate-700 text-white hover:bg-slate-800"
              >
                Log In to Business Portal
              </Button>
            </Link>
            <Link href="/business/claim">
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/60"
              >
                Claim Existing Profile →
              </Button>
            </Link>
          </div>

          {/* Social Proof Strip */}
          <div className="pt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Verified Business Profiles</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>100% Anti-Fraud Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Proven 28% Conversion Lift</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Banner */}
      <section className="bg-emerald-600 text-white py-8 px-4">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-black">92%</p>
            <p className="text-xs text-emerald-100 font-medium mt-1">
              Consumers read reviews before buying
            </p>
          </div>
          <div>
            <p className="text-3xl font-black">+28%</p>
            <p className="text-xs text-emerald-100 font-medium mt-1">
              Average boost in checkout conversions
            </p>
          </div>
          <div>
            <p className="text-3xl font-black">4.8★</p>
            <p className="text-xs text-emerald-100 font-medium mt-1">
              Average rating for verified businesses
            </p>
          </div>
          <div>
            <p className="text-3xl font-black">0%</p>
            <p className="text-xs text-emerald-100 font-medium mt-1">
              Tolerance for fake or paid reviews
            </p>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Enterprise-Grade Tools
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
            Everything You Need to Own Your Market Reputation
          </h2>
          <p className="text-sm text-slate-600 mt-3">
            Manage feedback, improve customer satisfaction, and turn glowing reviews into organic revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card hover className="p-6 border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <MessageSquareQuote className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Real-Time Review Inbox & Replies
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter by star rating, responded status, and customer sentiment. Post official company responses that appear directly on your public listing.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-emerald-600">
              Explore Review Management →
            </div>
          </Card>

          <Card hover className="p-6 border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Automated Customer Invitations
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Invite buyers to review their experience right after purchase via dedicated links or email invitations. Track open, send, and review rates in real time.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-emerald-600">
              Explore Invitation Engine →
            </div>
          </Card>

          <Card hover className="p-6 border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Actionable Feedback Analytics
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Understand customer perception with automated topic clustering. Track sentiment across Customer Service, Product Quality, Delivery, and Pricing.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-emerald-600">
              Explore Deep Analytics →
            </div>
          </Card>

          <Card hover className="p-6 border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Embeddable Trust Widgets
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add live TrustScore badges, star carousels, and verified review cards to your website. Fully customizable with light, dark, and emerald themes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-emerald-600">
              Explore Widget Studio →
            </div>
          </Card>

          <Card hover className="p-6 border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Multi-Location Management
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Manage branch offices, store locations, and regional service hubs under a unified business account with localized address listings.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-emerald-600">
              Explore Branch Hub →
            </div>
          </Card>

          <Card hover className="p-6 border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Official Business Verification
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit corporate registration and tax documents to earn the prestigious Verified Business badge, protecting your brand from impostors.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-emerald-600">
              Explore Verification →
            </div>
          </Card>
        </div>
      </section>

      {/* Interactive Widget Demo Preview */}
      <section className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-5xl mx-auto text-center space-y-4 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Interactive Preview
          </span>
          <h2 className="text-3xl font-black">
            Showcase Your Trust Directly on Your Website
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Businesses that display verified review badges on their homepage and checkout pages see immediate trust and conversion improvements.
          </p>
        </div>

        {/* Live Widget Sample Card */}
        <div className="max-w-xl mx-auto p-6 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                S
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Stripe, Inc.</h4>
                <p className="text-[11px] text-slate-500">Financial Technology & Payments</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
            </span>
          </div>

          <div className="py-6 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-black text-slate-900">4.8</span>
              <span className="text-slate-400 text-sm">/ 5.0</span>
            </div>
            <div className="flex justify-center">
              <StarRating rating={4.8} size="md" />
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Based on <strong>24 verified customer reviews</strong> on ComplaintReview
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-emerald-600">Rated "Excellent"</span>
            <span className="text-[11px]">Independent & Fraud-Protected</span>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-20 px-4 text-center bg-emerald-50 border-t border-emerald-100">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Ready to Build Authentic Trust with Your Customers?
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Get started today. Claim your profile, start collecting authentic reviews, and build a lasting reputation that drives sales.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/business/register">
              <Button variant="emerald" size="lg" className="font-bold gap-2 shadow-md">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/business/claim">
              <Button variant="outline" size="lg" className="border-slate-300">
                Claim Your Existing Profile
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
