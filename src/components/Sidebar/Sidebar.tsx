import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { primaryNav, systemNav } from "../../constants/navigation";
import useNotificationStore from "../../stores/notificationStore";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useLogout } from "../../hooks/useLogout";

type NavItem = (typeof primaryNav)[number] | (typeof systemNav)[number];

const ROW =
  "group/item relative flex w-full items-center gap-3 rounded-control py-2.5 font-interface text-sm font-medium transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-color)";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const isDesktop = !useIsMobile(1024);
  const isPhone = useIsMobile(768);
  const logout = useLogout();
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  if (isPhone) return null;

  const showLabels = isDesktop && !collapsed;
  const iconOnly = !showLabels;
  const CollapseIcon = collapsed ? PanelLeftOpen : PanelLeftClose;

  const renderLink = (item: NavItem) => {
    const Icon = item.icon;

    return (
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

            <Icon
              aria-hidden="true"
              size={15}
              strokeWidth={1.8}
              className="relative shrink-0"
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
          </>
        )}
      </NavLink>
    );
  };

  return (
    <aside
      aria-label="Navigation"
      className={`sticky top-16 h-[calc(100dvh-4rem)] shrink-0 self-start border-r border-(--border-color)
      bg-(--bg-secondary) transition-[width] duration-300 ease-in-out ${
        showLabels ? "w-64" : "w-[4.5rem]"
      }`}
    >
      <div className="flex h-full flex-col px-3 py-4">
        <div
          className={`flex min-h-0 flex-1 flex-col ${
            showLabels ? "overflow-y-auto" : "overflow-visible"
          }`}
        >
          {showLabels && (
            <p className="mb-2 px-3 font-interface text-[10px] font-medium tracking-[0.14em] text-(--text-muted) uppercase">
              Workspace
            </p>
          )}
          <div className="flex flex-col gap-1">{primaryNav.map(renderLink)}</div>

          {showLabels ? (
            <p className="mt-6 mb-2 px-3 font-interface text-[10px] font-medium tracking-[0.14em] text-(--text-muted) uppercase">
              System
            </p>
          ) : (
            <div className="mx-2 my-4 h-px bg-(--border-color)" />
          )}
          <div className="flex flex-col gap-1">{systemNav.map(renderLink)}</div>
        </div>

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
              <CollapseIcon
                aria-hidden="true"
                size={15}
                strokeWidth={1.8}
                className="shrink-0"
              />
              {showLabels && <span>Collapse</span>}
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
            <LogOut
              aria-hidden="true"
              size={15}
              strokeWidth={1.8}
              className="shrink-0"
            />
            {showLabels && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
