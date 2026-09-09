"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/store/AuthContext";
import api from "@/lib/api";
import {
  Shield,
  LayoutDashboard,
  MessageSquareQuote,
  Send,
  BarChart3,
  Building2,
  MapPin,
  Package,
  Code2,
  Bell,
  Settings,
  LogOut,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import Badge from "@/components/ui/Badge";

const navItems = [
  { href: "/business/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/business/reviews", label: "Reviews Inbox", icon: MessageSquareQuote },
  { href: "/business/invitations", label: "Invitations", icon: Send },
  { href: "/business/analytics", label: "Review Analytics", icon: BarChart3 },
  { href: "/business/profile", label: "Company Profile", icon: Building2 },
  { href: "/business/locations", label: "Branch Locations", icon: MapPin },
  { href: "/business/products", label: "Products & Services", icon: Package },
  { href: "/business/widgets", label: "Review Widgets", icon: Code2 },
  { href: "/business/notifications", label: "Notifications", icon: Bell },
  { href: "/business/settings", label: "Settings", icon: Settings },
];

export function BusinessLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();

  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const fetchBusinessProfile = async () => {
    try {
      const res = await api.get("/business/me");
      if (res?.success && res.data) {
        setBusinessData(res.data);
      }
    } catch (err) {
      console.error("Failed to load business context:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/business/login");
      } else if (user.role !== "BUSINESS" && user.role !== "ADMIN") {
        router.push("/business/claim");
      } else {
        fetchBusinessProfile();
      }
    }
  }, [user, authLoading, router]);

  // Active page title
  const currentNav = navItems.find(
    (item) => pathname === item.href || (item.href !== "/business/dashboard" && pathname.startsWith(item.href))
  );

  const company = businessData?.company;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
            Loading Business Portal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0">
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
          <Link href="/business/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-black shadow-sm">
              <Shield className="h-4 w-4 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight text-white">
                Complaint<span className="text-emerald-400">Review</span>
              </span>
              <span className="text-[9px] -mt-0.5 font-bold uppercase tracking-widest text-emerald-400">
                Business Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Company Card in Sidebar */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-emerald-400 font-bold border border-slate-700 text-base shrink-0">
              {company?.name ? company.name[0].toUpperCase() : "B"}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate">
                {company?.name || "My Business"}
              </h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                {company?.isVerified ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-slate-400">
                    TrustScore: {company?.overallRating ? company.overallRating.toFixed(1) : "0.0"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/business/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-900/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2 text-xs">
          {company?.slug && (
            <Link
              href={`/companies/${company.slug}`}
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 transition-colors"
            >
              <span className="font-medium">Public Profile</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          )}
          <Link
            href="/"
            className="block text-center text-[11px] text-slate-400 hover:text-white transition-colors py-1"
          >
            ← Return to Consumer Site
          </Link>
        </div>
      </aside>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-xs">
          {/* Mobile Menu Button & Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                {currentNav?.label || "Business Portal"}
              </h1>
            </div>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Status Pills */}
            <div className="hidden sm:flex items-center gap-2">
              {company?.isVerified ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Company
                </span>
              ) : (
                <Link
                  href="/business/settings"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Verify Business
                </Link>
              )}
            </div>

            {/* Quick Link to Public Page */}
            {company?.slug && (
              <Link
                href={`/companies/${company.slug}`}
                target="_blank"
                className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 transition-colors border border-slate-200 rounded-lg px-2.5 py-1.5 hover:bg-slate-50"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Live Page
              </Link>
            )}

            {/* Notifications Button */}
            <Link
              href="/business/notifications"
              className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </Link>

            <div className="h-5 w-px bg-slate-200" />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 rounded-full p-1 pl-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  {user?.firstName ? user.firstName[0].toUpperCase() : "B"}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="font-bold text-slate-900 truncate max-w-[120px]">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                    {company?.name || "Business"}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-50">
                  <div className="px-3 py-2 border-b border-slate-100 text-xs">
                    <p className="font-bold text-slate-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-slate-500 truncate text-[11px]">{user?.email}</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Business Account
                    </span>
                  </div>

                  <Link
                    href="/business/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    Business Settings
                  </Link>

                  <Link
                    href="/business/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    <Building2 className="w-4 h-4 text-slate-400" />
                    Manage Profile
                  </Link>

                  <div className="h-px bg-slate-100 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                      router.push("/business/login");
                    }}
                    className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    Sign Out of Business
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-full bg-slate-900 text-slate-300 p-4 flex flex-col justify-between z-10">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-white text-sm">ComplaintReview Business</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3 my-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <p className="text-xs font-bold text-white">{company?.name || "My Business"}</p>
                  <p className="text-[11px] text-emerald-400 mt-0.5">
                    TrustScore: {company?.overallRating?.toFixed(1) || "0.0"}
                  </p>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold ${
                          isActive ? "bg-emerald-600 text-white" : "text-slate-400 hover:bg-slate-800"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    router.push("/business/login");
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-rose-600/20 text-rose-300 text-xs font-semibold hover:bg-rose-600/30"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

export default BusinessLayout;
