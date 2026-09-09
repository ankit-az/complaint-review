"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/AuthContext";
import {
  User,
  Shield,
  Star,
  Building2,
  Clock,
  LogOut,
  Mail,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Settings,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("reviews");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <p className="text-xs text-slate-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 text-white shadow-md mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-2xl font-black">
              {user.firstName ? user.firstName[0].toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight">
                  {user.firstName} {user.lastName}
                </h1>
                <Badge variant="verified" size="sm">
                  {user.role}
                </Badge>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/writereview">
              <Button variant="emerald" size="md" className="gap-2 font-bold">
                <PlusCircle className="w-4 h-4" />
                Write a Review
              </Button>
            </Link>
            <Button
              variant="outline"
              size="md"
              onClick={logout}
              className="border-slate-700 text-slate-200 hover:bg-slate-800 gap-2"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${activeTab === "reviews"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
        >
          My Reviews & Complaints
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("account")}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${activeTab === "account"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
        >
          Account Details
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "reviews" ? (
        <div className="space-y-6">
          <Card className="text-center py-12 border-dashed border-2 border-slate-200">
            <div className="max-w-sm mx-auto space-y-3">
              <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                You haven't submitted any reviews yet
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Had an experience with a business? Search for any company to rate them,
                leave feedback, or report a service complaint.
              </p>
              <div className="pt-2">
                <Link href="/companies">
                  <Button variant="emerald" size="sm">
                    Browse Companies
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="max-w-2xl space-y-6">
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Profile Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  First Name
                </p>
                <p className="font-bold text-slate-800 mt-1">{user.firstName}</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  Last Name
                </p>
                <p className="font-bold text-slate-800 mt-1">{user.lastName}</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  Email Address
                </p>
                <p className="font-bold text-slate-800 mt-1">{user.email}</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  Account Role
                </p>
                <p className="font-bold text-slate-800 mt-1">{user.role}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
