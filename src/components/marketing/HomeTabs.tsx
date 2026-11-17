import type { KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { homeTabs, isHomeTab, type HomeTabKey } from "../../constants/homeTabs";

export default function HomeTabs() {
  const [params, setParams] = useSearchParams();
  const raw = params.get("tab");
  const active: HomeTabKey = isHomeTab(raw) ? raw : "start";

  const select = (key: HomeTabKey) => {
    setParams(key === "start" ? {} : { tab: key });
    window.setTimeout(() => {
      document.getElementById(`tab-${key}`)?.focus();
    }, 0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const index = homeTabs.findIndex((tab) => tab.key === active);
    let next: number | null = null;

    if (event.key === "ArrowRight") {
      next = (index + 1) % homeTabs.length;
    } else if (event.key === "ArrowLeft") {
      next = (index - 1 + homeTabs.length) % homeTabs.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = homeTabs.length - 1;
    }

    if (next === null) return;
    event.preventDefault();
    select(homeTabs[next].key);
  };

  return (
    <nav
      aria-label="Main"
      className="flex h-10 items-center md:h-16 md:justify-center"
    >
      <div
        role="tablist"
        aria-label="Sections"
        onKeyDown={handleKeyDown}
        className="flex h-full items-center gap-1"
      >
        {homeTabs.map((tab) => {
          const isActive = tab.key === active;

          return (
            <button
              key={tab.key}
              id={`tab-${tab.key}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.key}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => select(tab.key)}
              className={`group/tab relative flex h-8 cursor-pointer items-center rounded-control px-3 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-(--accent-color) ${
                isActive
                  ? "text-(--accent-strong)"
                  : "text-(--text-muted) hover:text-(--text-primary)"
              }`}
            >
              {isActive ? (
                <motion.span
                  layoutId="home-tab-active"
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 30,
                    mass: 0.9,
                  }}
                  className="absolute inset-0 rounded-control bg-(--accent-soft)"
                />
              ) : (
                <span className="absolute inset-0 rounded-control bg-(--bg-hover) opacity-0 transition-opacity group-hover/tab:opacity-100" />
              )}

              <span className="relative">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
