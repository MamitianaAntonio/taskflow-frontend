import type { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface FieldProps {
  label: string;
  icon?: IconDefinition;
  error?: string;
  children: ReactNode;
}

export default function Field({ label, icon, error, children }: FieldProps) {
  return (
    <div className="mb-4">
      <label className="font-interface mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-(--text-secondary)">
        {icon && (
          <FontAwesomeIcon icon={icon} className="text-[10px] text-(--accent-color)" />
        )}
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-(--color-error)">
          <FontAwesomeIcon icon={faTriangleExclamation} />
          {error}
        </p>
      )}
    </div>
  );
}