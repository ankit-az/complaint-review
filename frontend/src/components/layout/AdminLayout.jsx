"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/store/AuthContext";
import {
  Shield,
  LayoutDashboard,
  MessageSquareQuote,
  Building2,
  Users,
  Flag,
  LogOut,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Lock,
  ArrowLeft,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import Button from "@/components/ui/Button";

const adminNavItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/reviews", label: "Reviews Moderation", icon: MessageSquareQuote },
  { href: "/admin/companies", label: "Companies", icon: Building2 },
  { href: "/admin/users", label: "Users Directory", icon: Users },
  { href: "/admin/reports", label: "Abuse Reports", icon: Flag },
];

export function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: authLoading, login, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // 1. Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-purple-400">
          <div className="w-10 h-10 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            Authenticating Administrator...
          </p>
        </div>
      </div>
    );
  }

  // 2. Access Gate: Not logged in or not ADMIN
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl relative z-10 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-purple-950/60 border border-purple-800/60 text-purple-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8 stroke-[2.2]" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800/80 text-purple-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Shield className="w-3 h-3" /> Security Clearance Required
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Platform Admin Console
            </h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              This area is restricted to authorized platform administrators. Please authenticate with an Administrator account to continue.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Link href="/login" className="block">
              <Button
                variant="emerald"
                size="md"
                className="w-full font-bold shadow-lg shadow-emerald-600/20 cursor-pointer justify-center"
              >
                Sign In to Admin Account
              </Button>
            </Link>

            <Link href="/" className="block">
              <Button
                variant="outline"
                size="md"
                className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Return to Public Site
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Current active item
  const currentItem = adminNavItems.find(
    (item) => pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href))
  ) || adminNavItems[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800/80 shrink-0 sticky top-0 h-screen z-30">
        {/* Header / Brand */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black shadow-md shadow-purple-600/30 transition-transform group-hover:scale-105">
              <Shield className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-white block">
                Complaint<span className="text-purple-400">Admin</span>
              </span>
              <span className="text-[10px] font-semibold text-purple-400/90 tracking-wider uppercase block">
                Control Center
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Platform Management
          </div>
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-purple-900/40 text-purple-200 border border-purple-700/50 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-purple-400" : "text-slate-500"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Footer info & exit */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              Public Website
            </span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </Link>

          {/* User profile & sign out */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-purple-950 text-purple-300 border border-purple-800 flex items-center justify-center text-xs font-bold shrink-0">
                {user.firstName?.[0] || "A"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[10px] text-purple-400 font-mono truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="md:hidden bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-40 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-black">
            <Shield className="w-4 h-4 stroke-[2.4]" />
          </div>
          <span className="font-black text-sm text-white">
            Complaint<span className="text-purple-400">Admin</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-slate-300 hover:bg-slate-800"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[65px] bg-slate-950/95 backdrop-blur-md z-40 p-4 space-y-4 overflow-y-auto">
          <div className="space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-purple-900/50 text-purple-200 border border-purple-700/50"
                      : "text-slate-300 hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-5 h-5 text-purple-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900"
            >
              <span className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Return to Public Site
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 bg-rose-950/20 border border-rose-900/40"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        {/* Top Desktop Bar */}
        <div className="hidden md:flex h-14 bg-slate-900/60 backdrop-blur-sm border-b border-slate-800/80 px-8 items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Admin Console</span>
            <span className="text-slate-600">/</span>
            <span className="text-purple-400 font-bold">{currentItem.label}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-[11px] font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Admin Session
            </div>

            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 text-[11px] py-1 h-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> View Public Site
              </Button>
            </Link>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
