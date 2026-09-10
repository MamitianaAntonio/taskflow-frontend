import type { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface OptionChip<T extends string> {
  value: T;
  label: string;
  icon?: IconProp;
}

interface OptionChipsProps<T extends string> {
  label?: ReactNode;
  options: OptionChip<T>[];
  value: T;
  onChange: (value: T) => void;
  selectedClass: Record<T, string>;
  disabled?: boolean;
}

export default function OptionChips<T extends string>({
  label,
  options,
  value,
  onChange,
  selectedClass,
  disabled = false,
}: OptionChipsProps<T>) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 flex items-center gap-1.5 font-interface text-xs font-semibold uppercase tracking-widest text-(--text-secondary)">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              disabled={disabled}
              className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 font-interface text-xs font-semibold transition-colors ${
                selected
                  ? selectedClass[opt.value]
                  : "border-(--border-color) text-(--text-muted) hover:border-(--accent-color) hover:text-(--accent-color)"
              }`}
            >
              {opt.icon && <FontAwesomeIcon icon={opt.icon} className="text-[10px]" />}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}