import "./style/Button.css";

export default function Button({ text, variant, className, onClick, loading = false, disabled = false }) {
  const baseClasses = "btn";
  const variantClasses = {
    primary: "btn-primary",
    outline: "btn-outline",
  };

  const finalDisabled = disabled || loading;

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${finalDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
      onClick={onClick}
      disabled={finalDisabled}
    >
      {loading ? (
        <span className="btn-spinner" aria-label="loading" />
      ) : (
        text
      )}
    </button>
  );
}
