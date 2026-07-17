import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

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
}) {
  const base = `inline-flex items-center justify-center gap-2 rounded-lg text-sm tracking-wide 
    cursor-pointer transition-all duration-200 relative overflow-hidden outline-none focus-visible:ring-2 
    focus-visible:ring-(--color-success) focus-visible:ring-offset-2`;

  const variants = {
    primary:
      "bg-gradient-to-br from-(--gradient-from) to-(--gradient-to) text-(--text-white) shadow-sm hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
    outline:
      "rounded-xl border border-(--border-color) text-(--text-muted) font-semibold hover:text-(--accent-color) hover:border-(--accent-color)/40 transition-all",
    text: "bg-transparent text-(--text-primary) hover:bg-black/5 rounded",
  };

  const sizes = {
    small: "px-2 py-1.5 text-xs",
    medium: "px-4 py-2.5",
    large: "px-4 py-3 text-base",
  };

  const finalDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={finalDisabled}
      aria-busy={loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className} ${finalDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      {loading ? (
        <FontAwesomeIcon
          icon={faSpinner}
          className="animate-spin"
          aria-label="loading"
        />
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
