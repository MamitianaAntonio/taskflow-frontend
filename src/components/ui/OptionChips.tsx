import type { ReactNode } from "react";
import { motion } from "framer-motion";
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
  selectedClass?: Record<T, string>;
  disabled?: boolean;
  variant?: "chips" | "tabs";
  /** Base id for the sliding indicator when variant="tabs" */
  name?: string;
}

export default function OptionChips<T extends string>({
  label,
  options,
  value,
  onChange,
  selectedClass,
  disabled = false,
  variant = "chips",
  name = "option",
}: OptionChipsProps<T>) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 flex items-center gap-1.5 font-interface text-xs font-semibold uppercase tracking-widest text-(--text-secondary)">
          {label}
        </label>
      )}

      {variant === "tabs" ? (
        <div className="inline-flex items-center rounded-full border border-(--border-color) bg-(--bg-tertiary) p-1">
          {options.map((opt) => {
            const selected = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange(opt.value)}
                disabled={disabled}
                aria-pressed={selected}
                className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 font-interface text-xs font-semibold
                  outline-none transition-colors focus-visible:ring-2 focus-visible:ring-(--border-color)
                  disabled:cursor-not-allowed ${
                    selected
                      ? "text-(--text-primary)"
                      : "text-(--text-muted) hover:text-(--text-secondary)"
                  }`}
              >
                {selected && (
                  <motion.span
                    layoutId={`${name}-tab`}
                    className="absolute inset-0 rounded-full bg-(--bg-secondary) shadow-sm ring-1 ring-(--border-color)"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  {opt.icon && (
                    <FontAwesomeIcon
                      icon={opt.icon}
                      className={`text-[10px] ${
                        selected ? "text-(--accent-color)" : ""
                      }`}
                    />
                  )}
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {options.map((opt) => {
            const selected = value === opt.value;
            const selectedClasses =
              selectedClass?.[opt.value] ??
              "border-(--accent-color) bg-(--accent-soft) text-(--accent-color)";
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange(opt.value)}
                disabled={disabled}
                className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 font-interface text-xs font-semibold transition-colors ${
                  selected
                    ? selectedClasses
                    : "border-(--border-color) text-(--text-muted) hover:border-(--accent-color) hover:text-(--accent-color)"
                }`}
              >
                {opt.icon && (
                  <FontAwesomeIcon icon={opt.icon} className="text-[10px]" />
                )}
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}