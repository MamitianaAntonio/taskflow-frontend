import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { primaryNav, systemNav } from "../../constants/navigation";
import "./Sidebar.css";
import useNotificationStore from "../../stores/notificationStore";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useLogout } from "../../hooks/useLogout";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const isDesktop = !useIsMobile(1024);
  const isPhone = useIsMobile(768);
  const logout = useLogout();
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  if (isPhone) return null;

  const showLabels = isDesktop && !collapsed;
  const iconOnly = !showLabels;
  const isRail = !isDesktop || collapsed;

  const navItemClassName =
    (iconOnlyState: boolean) =>
      ({ isActive }: { isActive: boolean }) =>
        `sidebar-nav-link group relative flex w-full items-center gap-3 rounded-lg py-2.5 font-interface text-sm transition-colors duration-150
          ${iconOnlyState ? "justify-center px-0" : "px-3"
        } ${isActive
          ? `is-active bg-(--accent-soft) font-semibold text-(--accent-strong)${iconOnlyState
            ? ""
            : " before:absolute before:top-1/2 before:left-0.5 before:h-5 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-(--accent-color)"
          }`
          : "text-(--text-secondary) hover:bg-(--bg-hover) hover:text-(--text-primary)"
        }`;

  return (
    <aside
      className={`sidebar relative flex flex-col transition-all duration-300 ease-in-out ${isRail ? "w-20 is-collapsed" : "w-64"
        }`}
      role="navigation"
      aria-label="Navigation"
    >
      {isDesktop && (
        <div
          className={`flex items-center px-3 py-3 ${showLabels ? "justify-end" : "justify-center"
            }`}
        >
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="sidebar-toggle-btn rounded-lg font-bold transition-all"
            aria-label={collapsed ? "Expand the navigation" : "Reduce the navigation"}
            title="Toggle navigation"
            type="button"
          >
            <FontAwesomeIcon
              icon={faBars}
              className={`sidebar-toggle-icon ${collapsed ? "sidebar-toggle-icon--collapsed" : ""
                }`}
            />
          </button>
        </div>
      )}

      <div className="sidebar__scroll flex min-w-0 flex-1 flex-col justify-between overflow-y-auto px-2 py-2">
        <div>
          {showLabels && (
            <p className="sidebar-section__title mb-2 px-1 font-interface text-[10px] font-semibold uppercase tracking-widest text-(--text-muted)">
              Workspace
            </p>
          )}
          <div className="mb-4 flex flex-col gap-1">
            {primaryNav.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                className={navItemClassName(iconOnly)}
                aria-label={iconOnly ? item.label : undefined}
                title={iconOnly ? item.label : undefined}
                end={item.key === "dashboard"}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className="sidebar-nav-icon shrink-0"
                />
                {showLabels && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}
          </div>

          <div className="sidebar-divider" />

          {showLabels && (
            <p className="sidebar-section__title mt-4 mb-2 px-2 font-interface text-[10px] font-semibold uppercase tracking-widest text-(--text-muted)">
              System
            </p>
          )}
          <div
            className={`flex flex-col gap-1 ${showLabels ? "mt-2" : "mt-4"}`}
          >
            {systemNav.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                className={navItemClassName(iconOnly)}
                aria-label={iconOnly ? item.label : undefined}
                title={iconOnly ? item.label : undefined}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className="sidebar-nav-icon shrink-0"
                />
                {showLabels && <span className="truncate">{item.label}</span>}
                {item.key === "notifications" && unreadCount > 0 && (
                  <span
                    className={`sidebar-unread flex shrink-0 items-center justify-center rounded-full bg-(--color-error) px-1.5 font-interface text-[10px] font-bold leading-none text-(--text-white) ${showLabels
                      ? "ml-auto h-4 min-w-4"
                      : "absolute top-0.5 right-1 h-4 min-w-4"
                      }`}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="mt-4 border-t border-(--border-color) pt-3">
          <button
            type="button"
            onClick={logout}
            className={`sidebar-logout flex w-full items-center gap-3 rounded-lg py-2.5 font-interface text-sm text-(--text-muted)
            transition-colors duration-150 hover:bg-(--bg-hover) hover:text-(--color-error) ${showLabels ? "px-3" : "justify-center px-0"
              }`}
            title="Logout"
          >
            <FontAwesomeIcon icon={faPowerOff} className="shrink-0" />
            {showLabels && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
