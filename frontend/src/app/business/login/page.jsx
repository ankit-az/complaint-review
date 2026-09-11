"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/store/AuthContext";
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Building2,
  CheckCircle2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

function BusinessLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams?.get("redirect");
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res?.success) {
        const user = res.data?.user;
        if (redirectParam) {
          router.push(redirectParam);
        } else if (user?.role === "BUSINESS" || user?.role === "ADMIN") {
          router.push("/business/dashboard");
        } else {
          router.push("/business/claim");
        }
      }
    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFillAdmin = () => {
    setEmail("admin@complaint-review.com");
    setPassword("Admin@123456");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4 relative z-10">
        <Link href="/business" className="inline-flex items-center gap-2 mb-4 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-105">
            <Shield className="h-5 w-5 stroke-[2.4]" />
          </div>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Sign In to <span className="text-emerald-400">Business Portal</span>
        </h2>
        <p className="mt-2 text-xs text-slate-400 max-w-sm mx-auto">
          Manage your verified company listing, respond to customer reviews, and monitor TrustScore analytics.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-slate-800/20 shadow-2xl space-y-6">
          {/* Error Banner */}
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Business Email Address"
              type="email"
              placeholder="owner@yourcompany.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-emerald-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  icon={Lock}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="emerald"
              size="lg"
              className="w-full font-bold shadow-lg shadow-emerald-500/20"
              isLoading={isLoading}
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">Need Demo Access?</span>
              <button
                type="button"
                onClick={handleQuickFillAdmin}
                className="text-[11px] font-semibold text-emerald-600 hover:underline cursor-pointer"
              >
                Auto-fill Demo Admin
              </button>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              admin@complaint-review.com / Admin@123456
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2 text-center text-xs text-slate-500">
            <div>
              Don't have a business account yet?{" "}
              <Link
                href="/business/register"
                className="font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
              >
                Register your business <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div>
              Already listed in our directory?{" "}
              <Link href="/business/claim" className="font-semibold text-slate-700 hover:underline">
                Claim existing listing
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Return to Consumer Site
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BusinessLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xs">Loading...</div>}>
      <BusinessLoginContent />
    </Suspense>
  );
}
