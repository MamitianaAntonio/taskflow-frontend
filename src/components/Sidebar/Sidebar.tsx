import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { primaryNav, systemNav } from "../../constants/navigation";
import "./Sidebar.css";
import useNotificationStore from "../../stores/notificationStore";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useLogout } from "../../hooks/useLogout";
import Button from "../ui/Button";

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

  const LINK_BASE =
    "flex w-full items-center gap-3 rounded-lg py-2 font-interface text-sm font-medium transition-colors";

  const LINK_ACTIVE = "bg-(--accent-soft) text-(--accent-strong)";

  const LINK_IDLE =
    "text-(--text-muted) hover:bg-(--bg-hover) hover:text-(--text-primary)";

  const navItemClassName =
    (iconOnly: boolean) =>
    ({ isActive }: { isActive: boolean }) =>
      [
        LINK_BASE,
        iconOnly ? "justify-center px-0" : "px-3",
        isActive ? LINK_ACTIVE : LINK_IDLE,
      ].join(" ");

  return (
    <aside
      className={`sidebar relative flex flex-col transition-all duration-300 ease-in-out ${
        isRail ? "w-20 is-collapsed" : "w-64"
      }`}
      role="navigation"
      aria-label="Navigation"
    >
      {isDesktop && (
        <div
          className={`flex items-center px-3 py-3 ${
            showLabels ? "justify-end" : "justify-center"
          }`}
        >
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="sidebar-toggle-btn rounded-lg font-bold transition-all"
            aria-label={
              collapsed ? "Expand the navigation" : "Reduce the navigation"
            }
            title="Toggle navigation"
            type="button"
          >
            <FontAwesomeIcon
              icon={faBars}
              className={`sidebar-toggle-icon ${
                collapsed ? "sidebar-toggle-icon--collapsed" : ""
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
                    className={`sidebar-unread flex shrink-0 items-center justify-center rounded-full bg-(--color-error) px-1.5 font-interface text-[10px] font-bold leading-none text-(--text-white) ${
                      showLabels
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

        <Button
          className="w-full justify-center"
          variant="outline"
          title="Logout"
          onClick={logout}
        >
          <FontAwesomeIcon icon={faPowerOff} className="shrink-0" />
          {!collapsed ? <span>Logout</span> : ""}
        </Button>
      </div>
    </aside>
  );
}
