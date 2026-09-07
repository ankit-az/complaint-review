"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";

export function StarRating({
  rating = 0,
  maxRating = 5,
  size = "md",
  interactive = false,
  showScore = false,
  onChange,
  className = "",
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const activeRating = interactive && hoverRating > 0 ? hoverRating : rating;

  const getRatingColorClass = (val) => {
    const rounded = Math.round(val);
    if (rounded >= 5) return "bg-emerald-600 text-white border-emerald-600";
    if (rounded === 4) return "bg-emerald-500 text-white border-emerald-500";
    if (rounded === 3) return "bg-amber-500 text-white border-amber-500";
    if (rounded === 2) return "bg-orange-500 text-white border-orange-500";
    if (rounded === 1) return "bg-rose-500 text-white border-rose-500";
    return "bg-slate-200 text-slate-400 border-slate-200";
  };

  const getStarColor = (starIndex) => {
    if (activeRating >= starIndex) {
      const rounded = Math.round(activeRating);
      if (rounded >= 4) return "#10b981"; // Emerald
      if (rounded === 3) return "#f59e0b"; // Amber
      if (rounded === 2) return "#f97316"; // Orange
      return "#ef4444"; // Rose
    }
    return "#e2e8f0"; // Muted Slate
  };

  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-7 h-7",
  };

  const boxSizes = {
    sm: "w-5 h-5 p-0.5",
    md: "w-7 h-7 p-1",
    lg: "w-9 h-9 p-1.5",
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        {Array.from({ length: maxRating }, (_, i) => {
          const starIndex = i + 1;
          const isFilled = activeRating >= starIndex;

          return (
            <button
              key={starIndex}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(starIndex)}
              onMouseEnter={() => interactive && setHoverRating(starIndex)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={`flex items-center justify-center rounded transition-all duration-150 ${
                interactive
                  ? "cursor-pointer hover:scale-110"
                  : "cursor-default"
              } ${
                isFilled
                  ? getRatingColorClass(activeRating)
                  : "bg-slate-100 text-slate-300"
              } ${boxSizes[size] || boxSizes.md}`}
              aria-label={`${starIndex} star`}
            >
              <Star
                className={`${sizeClasses[size] || sizeClasses.md} ${
                  isFilled ? "fill-white text-white" : "fill-slate-200 text-slate-300"
                }`}
              />
            </button>
          );
        })}
      </div>

      {showScore && (
        <span className="text-sm font-bold text-slate-900 ml-1">
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
}

export default StarRating;
