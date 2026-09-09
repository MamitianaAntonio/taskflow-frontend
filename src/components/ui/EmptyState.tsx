import { faInbox } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: typeof faInbox;
  title: string;
  text?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon = faInbox,
  title,
  text,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 px-6 py-12 text-center ${className}`}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-(--bg-tertiary)">
        <FontAwesomeIcon icon={icon} className="text-(--accent-color) opacity-70" />
      </span>
      <p className="text-sm font-medium text-(--text-primary)">{title}</p>
      {text && <p className="text-xs text-(--text-muted) font-interface">{text}</p>}
      {action}
    </div>
  );
}