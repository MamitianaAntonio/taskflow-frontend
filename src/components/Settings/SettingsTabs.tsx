import { useRef, type KeyboardEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { TabItem } from "./type/tabs";

interface Props<T extends string> {
  tabs: readonly TabItem<T>[];
  active: T;
  onChange: (id: T) => void;
}

export default function SettingsTabs<T extends string>({
  tabs,
  active,
  onChange,
}: Props<T>) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const move = (index: number) => {
    const next = tabs[(index + tabs.length) % tabs.length];
    onChange(next.id);
    refs.current[next.id]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const actions: Record<string, () => void> = {
      ArrowRight: () => move(index + 1),
      ArrowLeft: () => move(index - 1),
      Home: () => move(0),
      End: () => move(tabs.length - 1),
    };
    const action = actions[e.key];
    if (action) {
      e.preventDefault();
      action();
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Settings sections"
      className="flex gap-1.5 overflow-x-auto pb-1"
    >
      {tabs.map((tab, i) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[tab.id] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 font-interface text-xs font-semibold
              transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-color)
              ${
                isActive
                  ? "border-(--accent-color) bg-(--accent-soft) text-(--accent-strong)"
                  : "border-(--border-color) bg-(--bg-primary) text-(--text-muted) hover:border-(--accent-color) hover:text-(--accent-color)"
              }`}
          >
            <FontAwesomeIcon icon={tab.icon} size="xs" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
