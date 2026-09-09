import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export default function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-(--border-color) px-2 py-0.5 text-[11px] font-medium text-(--text-muted) font-interface ${className}`}
    >
      {children}
    </span>
  );
}