import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { MouseEvent, ReactNode } from "react";

type ButtonVariant = "primary" | "outline" | "text";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps {
  text?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  children?: ReactNode;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  title?: string;
  "aria-label"?: string;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm tracking-wide " +
  "cursor-pointer transition-all duration-200 relative overflow-hidden outline-none " +
  "focus-visible:ring-2 focus-visible:ring-(--accent-color) focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-(--bg-primary)";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-linear-to-br from-(--gradient-from) to-(--gradient-to) text-(--text-white) " +
    "shadow-sm hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
  outline:
    "border border-(--border-color) text-(--text-muted) font-semibold " +
    "hover:text-(--accent-color) hover:border-(--accent-color)",
  text: "bg-transparent text-(--text-primary) hover:bg-(--bg-tertiary",
};

const sizes: Record<ButtonSize, string> = {
  small: "px-3 py-1.5 text-xs",
  medium: "px-4 py-2.5",
  large: "px-5 py-3 text-base",
};

export default function Button({
  text,
  variant = "primary",
  size = "medium",
  className = "",
  onClick,
  loading = false,
  disabled = false,
  type = "button",
  children,
  icon,
  iconPosition = "left",
  title,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
      aria-label={ariaLabel}
      title={title}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className} ${
        isDisabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      {loading ? (
        <FontAwesomeIcon icon={faSpinner} className="animate-spin" aria-label="loading" />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="inline-flex items-center justify-center leading-none">
              {icon}
            </span>
          )}
          {children ?? text}
          {icon && iconPosition === "right" && (
            <span className="inline-flex items-center justify-center leading-none">
              {icon}
            </span>
          )}
        </>
      )}
    </button>
  );
}