import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ReactNode } from "react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: ReactNode;
}

export default function ErrorState({
  title = "Something went wrong",
  message,
  action,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-(--color-error-soft)">
        <FontAwesomeIcon icon={faTriangleExclamation} className="text-(--color-error)" />
      </span>
      <p className="text-sm font-medium text-(--text-primary)">{title}</p>
      {message && (
        <p className="text-xs text-(--text-muted) font-interface">{message}</p>
      )}
      {action}
    </div>
  );
}