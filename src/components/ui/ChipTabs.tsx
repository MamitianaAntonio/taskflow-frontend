import { useRef, type KeyboardEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface ChipTabItem<T extends string = string> {
  id: T;
  label: string;
  icon?: IconDefinition;
  iconClassName?: string;
}

interface ChipTabsProps<T extends string> {
  items: readonly ChipTabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  role?: "tablist" | "group";
  ariaLabel?: string;
  className?: string;
}

const ACTIVE_LAYOUT_ID = "chip-tab-active";

export default function ChipTabs<T extends string>({
  items,
  value,
  onChange,
  role = "group",
  ariaLabel,
  className = "",
}: ChipTabsProps<T>) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const isTablist = role === "tablist";

  const focusAt = (index: number) => {
    const next = items[(index + items.length) % items.length];
    onChange(next.id);
    refs.current[next.id]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const actions: Record<string, () => void> = {
      ArrowRight: () => focusAt(index + 1),
      ArrowLeft: () => focusAt(index - 1),
      Home: () => focusAt(0),
      End: () => focusAt(items.length - 1),
    };
    const action = actions[e.key];
    if (action) {
      e.preventDefault();
      action();
    }
  };

  return (
    <div
      role={role}
      aria-label={ariaLabel}
      className={`flex flex-wrap gap-1.5 ${className}`}
    >
      {items.map((item, index) => {
        const active = item.id === value;
        return (
          <motion.button
            key={item.id}
            ref={(el) => {
              refs.current[item.id] = el;
            }}
            type="button"
            role={isTablist ? "tab" : undefined}
            id={isTablist ? `tab-${item.id}` : undefined}
            aria-controls={isTablist ? `panel-${item.id}` : undefined}
            aria-selected={isTablist ? active : undefined}
            aria-pressed={isTablist ? undefined : active}
            tabIndex={isTablist ? (active ? 0 : -1) : undefined}
            onClick={() => onChange(item.id)}
            onKeyDown={isTablist ? (e) => onKeyDown(e, index) : undefined}
            whileTap={{ scale: 0.95 }}
            className="group relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-interface text-xs font-semibold transition-colors focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-(--accent-color)"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-lg border border-(--border-color) bg-(--bg-primary) transition-colors group-hover:border-(--accent-color)"
            />
            {active && (
              <motion.span
                layoutId={ACTIVE_LAYOUT_ID}
                aria-hidden="true"
                className="absolute inset-0 rounded-lg border border-(--accent-color) bg-(--accent-soft)"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
            <span
              className={`relative flex items-center gap-1.5 transition-colors ${
                active
                  ? "text-(--accent-strong)"
                  : "text-(--text-muted) group-hover:text-(--accent-color)"
              }`}
            >
              {item.icon && (
                <FontAwesomeIcon
                  icon={item.icon}
                  size="xs"
                  className={active ? "" : item.iconClassName}
                />
              )}
              {item.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
