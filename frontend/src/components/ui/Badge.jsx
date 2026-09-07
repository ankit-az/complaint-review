import React from "react";
import { CheckCircle2, ShieldCheck, Clock, AlertCircle } from "lucide-react";

export function Badge({
  children,
  variant = "default",
  icon,
  size = "md",
  className = "",
}) {
  const baseStyles =
    "inline-flex items-center font-medium rounded-full transition-colors";

  const variants = {
    default: "bg-slate-100 text-slate-800 border border-slate-200",
    verified: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
    claimed: "bg-blue-50 text-blue-700 border border-blue-200/80",
    warning: "bg-amber-50 text-amber-700 border border-amber-200/80",
    danger: "bg-rose-50 text-rose-700 border border-rose-200/80",
    purple: "bg-indigo-50 text-indigo-700 border border-indigo-200/80",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs font-semibold gap-1.5",
    lg: "px-3 py-1.5 text-sm font-semibold gap-2",
  };

  const defaultIcons = {
    verified: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
    claimed: <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />,
    warning: <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
    danger: <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />,
  };

  const renderIcon = icon || defaultIcons[variant];

  return (
    <span
      className={`${baseStyles} ${variants[variant] || variants.default} ${
        sizes[size] || sizes.md
      } ${className}`}
    >
      {renderIcon}
      {children}
    </span>
  );
}

export default Badge;
