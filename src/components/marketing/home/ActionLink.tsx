import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";

interface ActionLinkProps {
  to: string;
  children: ReactNode;
}

/** Filled gradient CTA, used for the main action of a panel. */
export function PrimaryLink({ to, children }: ActionLinkProps) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 rounded-lg bg-linear-to-br from-(--gradient-from) to-(--gradient-to) px-5 py-3 text-sm font-semibold text-(--text-white) shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-(--accent-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-primary) focus-visible:outline-none"
    >
      {children}
      <ArrowRight
        aria-hidden="true"
        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
      />
    </Link>
  );
}

/** Quiet text link, used next to a PrimaryLink. */
export function SecondaryLink({ to, children }: ActionLinkProps) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-1.5 rounded-lg py-2 font-interface text-sm font-medium text-(--text-secondary) transition-colors hover:text-(--accent-strong) focus-visible:ring-2 focus-visible:ring-(--accent-color) focus-visible:outline-none"
    >
      {children}
      <ArrowUpRight
        aria-hidden="true"
        className="h-4 w-4 text-(--text-muted) transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </Link>
  );
}
