import { X } from "lucide-react";
import type { MouseEvent } from "react";

interface CloseButtonProps {
  onClose: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export default function CloseButton({
  onClose,
  className = "",
}: CloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className={`flex size-8 shrink-0 items-center justify-center rounded-control text-(--text-muted) transition-colors hover:bg-(--bg-tertiary) hover:text-(--color-error) focus-visible:ring-2 focus-visible:ring-(--accent-color) focus-visible:outline-none ${className}`}
    >
      <X size={16} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}
