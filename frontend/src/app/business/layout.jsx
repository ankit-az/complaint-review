"use client";

import React from "react";
import { usePathname } from "next/navigation";
import BusinessLayout from "@/components/layout/BusinessLayout";

export default function Layout({ children }) {
  const pathname = usePathname();

  // Landing, login, register, and claim have their own specialized standalone presentation
  const isAuthOrLanding =
    pathname === "/business" ||
    pathname === "/business/login" ||
    pathname === "/business/register" ||
    pathname === "/business/claim";

  if (isAuthOrLanding) {
    return <>{children}</>;
  }

  return <BusinessLayout>{children}</BusinessLayout>;
}
