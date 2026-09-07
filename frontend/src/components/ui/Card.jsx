import React from "react";

export function Card({
  children,
  className = "",
  hover = false,
  glass = false,
  onClick,
  ...props
}) {
  const baseStyles =
    "rounded-xl border border-slate-200/80 bg-white p-6 text-slate-800 shadow-sm transition-all duration-200";

  const hoverStyles = hover
    ? "hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 cursor-pointer"
    : "";

  const glassStyles = glass
    ? "bg-white/90 backdrop-blur-md border-slate-200/60"
    : "";

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${hoverStyles} ${glassStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div className={`mb-4 flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }) {
  return (
    <h3 className={`text-lg font-bold text-slate-900 tracking-tight ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = "" }) {
  return <p className={`text-sm text-slate-500 mt-1 ${className}`}>{children}</p>;
}

export function CardContent({ children, className = "" }) {
  return <div className={`space-y-3 ${className}`}>{children}</div>;
}

export default Card;
