import "./style/Button.css";

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
  const baseClasses = "btn";
  const variantClasses = {
    primary: "btn-primary",
    outline: "btn-outline",
    text: "btn-text",
  };

  const sizeClasses = {
    small: "px-3 py-1.5 text-xs",
    medium: "",
    large: "px-6 py-3 text-base",
  };

  const finalDisabled = disabled || loading;

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${finalDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
      onClick={onClick}
      disabled={finalDisabled}
      type={type}
      aria-busy={loading}
    >
      {loading ? (
        <span className="btn-spinner" aria-label="loading" />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="btn__icon btn__icon--left">{icon}</span>
          )}
          {children ?? text}
          {icon && iconPosition === "right" && (
            <span className="btn__icon btn__icon--right">{icon}</span>
          )}
        </>
      )}
    </button>
  );
}
