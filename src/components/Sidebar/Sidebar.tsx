import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { primaryNav, systemNav } from "../../constants/navigation";
import useNotificationStore from "../../stores/notificationStore";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useLogout } from "../../hooks/useLogout";

type NavItem = (typeof primaryNav)[number] | (typeof systemNav)[number];

const ROW =
  "group/item relative flex w-full items-center gap-3 rounded-control py-2.5 font-interface text-sm font-medium transition-colors";

const TOOLTIP =
  "pointer-events-none absolute left-full z-50 ml-3 -translate-x-1 whitespace-nowrap rounded-inner border " +
  "border-(--border-color) bg-(--bg-primary) px-2.5 py-1 font-interface text-xs font-semibold " +
  "text-(--text-primary) opacity-0 shadow-lg shadow-(--shadow) transition-all duration-150 " +
  "group-hover/item:translate-x-0 group-hover/item:opacity-100 group-focus-visible/item:translate-x-0 " +
  "group-focus-visible/item:opacity-100";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const isDesktop = !useIsMobile(1024);
  const isPhone = useIsMobile(768);
  const logout = useLogout();
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  if (isPhone) return null;

  const showLabels = isDesktop && !collapsed;
  const iconOnly = !showLabels;

  const renderLink = (item: NavItem) => (
    <NavLink
      key={item.key}
      to={item.path}
      end={item.key === "dashboard"}
      aria-label={iconOnly ? item.label : undefined}
      className={({ isActive }) =>
        [
          ROW,
          iconOnly ? "justify-center px-0" : "px-3",
          isActive
            ? "text-(--accent-strong)"
            : "text-(--text-muted) hover:text-(--text-primary)",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          {isActive ? (
            <motion.span
              layoutId="sidebar-active-pill"
              transition={{ type: "spring", stiffness: 500, damping: 38 }}
              className="absolute inset-0 rounded-control bg-(--accent-soft)"
            />
          ) : (
            <span className="absolute inset-0 rounded-control bg-(--bg-hover) opacity-0 transition-opacity group-hover/item:opacity-100" />
          )}

          <FontAwesomeIcon
            icon={item.icon}
            fixedWidth
            className="relative shrink-0 text-[15px]"
          />

          {showLabels && <span className="relative truncate">{item.label}</span>}

          {item.key === "notifications" && unreadCount > 0 && (
            <span
              className={`relative flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full
              bg-(--color-error) px-1.5 font-interface text-[10px] leading-none font-bold text-(--text-white) ${
                showLabels ? "ml-auto" : "absolute! top-1 right-2"
              }`}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}

          {iconOnly && (
            <span role="tooltip" className={TOOLTIP}>
              {item.label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <aside
      aria-label="Navigation"
      className={`sticky top-16 h-[calc(100dvh-4rem)] shrink-0 self-start border-r border-(--border-color)
      bg-(--bg-secondary) transition-[width] duration-300 ease-in-out ${
        showLabels ? "w-64" : "w-[4.5rem]"
      }`}
    >
      <div className="flex h-full flex-col px-3 py-4">
        {/* Links (no clipping in rail mode so tooltips can show) */}
        <div
          className={`flex min-h-0 flex-1 flex-col ${
            showLabels ? "overflow-y-auto" : "overflow-visible"
          }`}
        >
          {showLabels && (
            <p className="mb-2 px-3 font-interface text-[10px] font-semibold tracking-widest text-(--text-muted) uppercase">
              Workspace
            </p>
          )}
          <div className="flex flex-col gap-1">{primaryNav.map(renderLink)}</div>

          {showLabels ? (
            <p className="mt-6 mb-2 px-3 font-interface text-[10px] font-semibold tracking-widest text-(--text-muted) uppercase">
              System
            </p>
          ) : (
            <div className="mx-2 my-4 h-px bg-(--border-color)" />
          )}
          <div className="flex flex-col gap-1">{systemNav.map(renderLink)}</div>
        </div>

        {/* Footer */}
        <div className="mt-2 flex flex-col gap-1 border-t border-(--border-color) pt-3">
          {isDesktop && (
            <button
              type="button"
              onClick={() => setCollapsed((prev) => !prev)}
              aria-label={collapsed ? "Expand the navigation" : "Collapse the navigation"}
              aria-expanded={!collapsed}
              className={`${ROW} text-(--text-muted) hover:bg-(--bg-hover) hover:text-(--text-primary) ${
                iconOnly ? "justify-center px-0" : "px-3"
              }`}
            >
              <FontAwesomeIcon
                icon={faAnglesLeft}
                fixedWidth
                className={`shrink-0 text-[15px] transition-transform duration-300 ${
                  collapsed ? "rotate-180" : ""
                }`}
              />
              {showLabels && <span>Collapse</span>}
              {iconOnly && (
                <span role="tooltip" className={TOOLTIP}>
                  Expand
                </span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={logout}
            aria-label="Logout"
            className={`${ROW} text-(--text-muted) hover:bg-(--color-error)/10 hover:text-(--color-error) ${
              iconOnly ? "justify-center px-0" : "px-3"
            }`}
          >
            <FontAwesomeIcon icon={faPowerOff} fixedWidth className="shrink-0 text-[15px]" />
            {showLabels && <span>Logout</span>}
            {iconOnly && (
              <span role="tooltip" className={TOOLTIP}>
                Logout
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}