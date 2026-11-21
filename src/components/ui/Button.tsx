import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { MouseEvent, ReactNode } from "react";

type ButtonVariant = "primary" | "outline" | "text";
type ButtonSize = "small" | "medium" | "large" | "icon";

interface ButtonProps {
  text?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  children?: ReactNode;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  title?: string;
  "aria-label"?: string;
  "aria-expanded"?: boolean;
}

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-lg text-sm tracking-wide " +
  "cursor-pointer outline-none transition-[transform,box-shadow,background-color,border-color,color] " +
  "duration-200 ease-out active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none " +
  "focus-visible:ring-2 focus-visible:ring-(--accent-color) focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-(--bg-primary)";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-linear-to-br from-(--gradient-from) to-(--gradient-to) text-(--text-white) " +
    "shadow-sm hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm " +
    "disabled:hover:translate-y-0 disabled:hover:shadow-none",
  outline:
    "border border-(--border-color) text-(--text-muted) font-semibold " +
    "hover:border-(--accent-color) hover:bg-(--accent-soft) hover:text-(--accent-strong) " +
    "active:bg-(--accent-bg) disabled:hover:border-(--border-color) disabled:hover:bg-transparent " +
    "disabled:hover:text-(--text-muted)",
  text: "bg-transparent text-(--text-primary) hover:bg-(--bg-hover) active:bg-(--bg-tertiary) " +
    "disabled:hover:bg-transparent",
};

const sizes: Record<ButtonSize, string> = {
  small: "px-3 py-1.5 text-xs",
  medium: "px-4 py-2.5",
  large: "px-5 py-3 text-base",
  icon: "h-9 w-9 p-0",
};

export default function Button({
  text,
  variant = "primary",
  size = "medium",
  className = "",
  onClick,
  loading = false,
  loadingText,
  disabled = false,
  type = "button",
  children,
  icon,
  iconPosition = "left",
  title,
  "aria-label": ariaLabel,
  "aria-expanded": ariaExpanded,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      title={title}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className} ${
        isDisabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {loading ? (
          <>
            <FontAwesomeIcon
              icon={faSpinner}
              className="animate-spin"
              aria-label="loading"
            />
            {loadingText && <span>{loadingText}</span>}
          </>
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <span className="inline-flex items-center justify-center leading-none transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transform-none">
                {icon}
              </span>
            )}
            {children ?? text}
            {icon && iconPosition === "right" && (
              <span className="inline-flex items-center justify-center leading-none transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none">
                {icon}
              </span>
            )}
          </>
        )}
      </span>
    </button>
  );
}
