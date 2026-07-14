import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

export default function Field({ label, icon, error, children }) {
  return (
    <div className="mb-4">
      <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-(--text-secondary) uppercase tracking-widest font-interface">
        {icon && (
          <FontAwesomeIcon icon={icon} className="text-[10px] text-(--accent-color)" />
        )}
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-(--color-error) flex items-center gap-1.5 animate-pulse">
          <FontAwesomeIcon icon={faTriangleExclamation} />
          {error}
        </p>
      )}
    </div>
  );
}
