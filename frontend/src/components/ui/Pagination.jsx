"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = "",
}) {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      aria-label="Pagination Navigation"
      className={`flex items-center justify-center gap-1.5 sm:gap-2 select-none ${className}`}
    >
      {/* Previous Page Button */}
      <button
        type="button"
        onClick={handlePrev}
        disabled={currentPage <= 1}
        className={`inline-flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all cursor-pointer ${
          currentPage <= 1
            ? "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60"
            : "bg-white text-slate-700 border-stone-300 hover:bg-stone-50 hover:text-slate-950 shadow-2xs active:scale-95"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {pages.map((p, idx) => {
          if (p === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 py-1 text-xs text-stone-400 font-semibold"
              >
                ...
              </span>
            );
          }

          const isCurrent = p === currentPage;

          return (
            <button
              key={`page-${p}`}
              type="button"
              onClick={() => onPageChange && onPageChange(p)}
              aria-current={isCurrent ? "page" : undefined}
              className={`min-w-[36px] h-9 px-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                isCurrent
                  ? "bg-[#001736] text-white shadow-xs"
                  : "bg-white text-slate-700 border border-stone-300 hover:bg-stone-50 hover:text-slate-950 shadow-2xs active:scale-95"
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Next Page Button */}
      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage >= totalPages}
        className={`inline-flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all cursor-pointer ${
          currentPage >= totalPages
            ? "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60"
            : "bg-white text-slate-700 border-stone-300 hover:bg-stone-50 hover:text-slate-950 shadow-2xs active:scale-95"
        }`}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
