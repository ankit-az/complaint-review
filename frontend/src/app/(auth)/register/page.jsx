"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/AuthContext";
import {
  Shield,
  Lock,
  Mail,
  User,
  Building2,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.firstName.trim()) {
      setError("Please enter your first name.");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await register(formData);
      if (res?.success) {
        if (formData.role === "BUSINESS") {
          router.push("/business/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-100">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-emerald-400 shadow-sm transition-transform group-hover:scale-105">
              <Shield className="h-5 w-5 fill-emerald-500/20 stroke-emerald-400 stroke-[2.2]" />
            </div>
          </Link>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Create Your Account on <span className="text-emerald-600">ComplaintReview</span>
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Join thousands of authentic consumers and transparent businesses.
          </p>
        </div>

        {/* Account Role Selector */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => handleChange("role", "USER")}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              formData.role === "USER"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <User className="w-4 h-4 text-emerald-600" />
            Consumer Reviewer
          </button>
          <button
            type="button"
            onClick={() => handleChange("role", "BUSINESS")}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              formData.role === "BUSINESS"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="w-4 h-4 text-blue-600" />
            Business Owner
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              icon={User}
              placeholder="Jane"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              required
            />
            <Input
              label="Last Name (Optional)"
              type="text"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="jane.doe@example.com"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            icon={Lock}
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
            autoComplete="new-password"
            helperText="Must be at least 6 characters"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="emerald"
              size="lg"
              isLoading={isLoading}
              className="w-full font-bold shadow-md shadow-emerald-600/20"
            >
              Complete Registration
            </Button>
          </div>
        </form>

        {/* Trust Pledge Note */}
        <div className="flex items-start gap-2 text-[11px] text-slate-500 pt-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            By signing up, you agree to our Terms of Service and Review Integrity Guidelines.
            Fake reviews or spam will result in immediate permanent suspension.
          </span>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
          >
            Sign in here
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
