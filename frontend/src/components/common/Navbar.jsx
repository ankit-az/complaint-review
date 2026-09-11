"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/store/AuthContext";
import {
  Shield,
  Search,
  Menu,
  X,
  User,
  LogOut,
  Building2,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import Button from "@/components/ui/Button";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Hide consumer navbar on dedicated SaaS business dashboard routes
  if (pathname?.startsWith("/business/") && pathname !== "/business") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/90 bg-slate-950 text-white shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-emerald-400 border border-slate-800 shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Shield className="h-5 w-5 fill-emerald-500/20 stroke-emerald-400 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white">
                Complaint<span className="text-emerald-400">Review</span>
              </span>
              <span className="text-[10px] -mt-1 font-medium tracking-widest text-slate-400 uppercase">
                Verified Reviews & Complaints
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
            <Link
              href="/categories"
              className="transition-colors hover:text-emerald-400"
            >
              Categories
            </Link>
            <Link
              href="/companies"
              className="transition-colors hover:text-emerald-400"
            >
              Explore Companies
            </Link>
            <Link
              href="/blog"
              className="transition-colors hover:text-emerald-400"
            >
              Blog
            </Link>
            <Link
              href="/writereview"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Write a Review
            </Link>
          </nav>
        </div>

        {/* Right Action Items */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/business"
            className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-slate-900"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            For Businesses
          </Link>

          <div className="h-5 w-px bg-slate-800" />

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 p-1.5 pl-3 text-sm font-medium text-slate-200 hover:bg-slate-850 hover:border-slate-600 focus:outline-none cursor-pointer"
              >
                <span>{user.firstName || user.email}</span>
                <div className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  {user.firstName ? user.firstName[0].toUpperCase() : "U"}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-750 bg-slate-900 p-1.5 shadow-2xl z-50 text-white">
                  <div className="px-3 py-2 border-b border-slate-800 text-xs">
                    <p className="font-semibold text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-emerald-400 border border-slate-700">
                      {user.role}
                    </span>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    My Profile & Reviews
                  </Link>

                  {user.role === "BUSINESS" && (
                    <Link
                      href="/business/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <Building2 className="w-4 h-4 text-slate-400" />
                      Business Portal
                    </Link>
                  )}

                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-purple-300 hover:bg-purple-950/40 hover:text-purple-200 transition-colors"
                    >
                      <Shield className="w-4 h-4 text-purple-400" />
                      Admin Control Panel
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link href="/login">
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                >
                  Log in
                </button>
              </Link>
              <Link href="/register">
                <Button variant="emerald" size="sm" className="font-bold">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-900 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-3 text-white">
          <nav className="flex flex-col space-y-2">
            <Link
              href="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              Categories
            </Link>
            <Link
              href="/companies"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              Explore Companies
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              Blog
            </Link>
            <Link
              href="/writereview"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-emerald-400 hover:bg-slate-900 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Write a Review
            </Link>
            <Link
              href="/business"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              For Businesses
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-800">
            {user ? (
              <div className="space-y-2">
                <p className="px-3 text-xs font-semibold text-slate-400">
                  Signed in as {user.email}
                </p>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-semibold text-slate-200 hover:text-white"
                >
                  My Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-semibold text-rose-400"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" className="w-full border-slate-700 text-slate-200 hover:bg-slate-850 hover:text-white">
                    Log in
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="emerald" size="md" className="w-full">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
