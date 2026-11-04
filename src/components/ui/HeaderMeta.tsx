import type { ReactNode } from "react";

export type HeaderMetaTone =
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "neutral";

const dots: Record<HeaderMetaTone, string> = {
  accent: "bg-(--accent-color)",
  success: "bg-(--color-success)",
  warning: "bg-(--color-warning)",
  error: "bg-(--color-error)",
  neutral: "bg-(--text-muted)",
};

interface HeaderMetaProps {
  children: ReactNode;
  tone?: HeaderMetaTone;
  className?: string;
}

export default function HeaderMeta({
  children,
  tone = "neutral",
  className = "",
}: HeaderMetaProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 font-interface text-xs font-medium whitespace-nowrap text-(--text-secondary) ${className}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${dots[tone]}`}
      />
      {children}
    </span>
  );
}
