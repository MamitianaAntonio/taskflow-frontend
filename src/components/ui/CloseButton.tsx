import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition, SizeProp } from "@fortawesome/fontawesome-svg-core";
import type { MouseEvent } from "react";

interface CloseButtonProps {
  onClose: (event: MouseEvent<HTMLButtonElement>) => void;
  icon?: IconDefinition;
  size?: SizeProp;
  className?: string;
}

export default function CloseButton({
  onClose,
  icon = faCircle,
  size = "sm",
  className = "",
}: CloseButtonProps) {
  return (
    <button
      onClick={onClose}
      className={`flex h-7 w-7 items-center justify-center rounded-md
        text-(--text-muted) hover:text-(--color-error) hover:bg-(--bg-primary)
        transition-colors ${className}`}
      aria-label="Close"
    >
      <FontAwesomeIcon icon={icon} size={size} />
    </button>
  );
}