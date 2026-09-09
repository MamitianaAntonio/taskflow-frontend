import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { primaryNav, systemNav } from "../../constants/navigation";
import "./Sidebar.css";
import Button from "../ui/Button";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useLogout } from "../../hooks/useLogout";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const isDesktop = !useIsMobile(1024);
  const isPhone = useIsMobile(768);
  const logout = useLogout();

  if (isPhone) return null;

  const showLabels = isDesktop && !collapsed;
  const iconOnly = !showLabels;
  const isRail = !isDesktop || collapsed;

  const navItemClassName =
    (iconOnlyState: boolean) =>
    ({ isActive }: { isActive: boolean }) =>
      `sidebar-nav-link flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-300 relative ${
        iconOnlyState ? "justify-center" : ""
      } ${isActive ? "is-active" : ""}`;

  return (
    <aside
      className={`sidebar relative flex flex-col transition-all duration-300 ease-in-out ${
        isRail ? "w-20 is-collapsed" : "w-64"
      }`}
      role="navigation"
      aria-label="Navigation"
    >
      {isDesktop && (
        <div className="sidebar-header flex items-center justify-end border-b px-3 py-3">
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="sidebar-toggle-btn rounded-lg font-bold transition-all"
            aria-label={collapsed ? "Expand the navigation" : "Reduce the navigation"}
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
            <div className="sidebar-section mb-2 flex items-center justify-between px-1">
              <span className="sidebar-section__title">Workspace</span>
            </div>
          )}
          <div className="mb-4 flex flex-col gap-2">
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

          <div className={`sidebar-divider ${showLabels ? "" : "mt-4"}`} />

          {showLabels && (
            <div className="sidebar-section mt-4 mb-2 flex items-center justify-between px-2">
              <span className="sidebar-section__title">System</span>
            </div>
          )}
          <div className={showLabels ? "mt-2 flex flex-col gap-2" : "mt-4 flex flex-col gap-2"}>
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
              </NavLink>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          className="sidebar-logout w-full"
          onClick={logout}
        >
          <FontAwesomeIcon icon={faPowerOff} className="sidebar-nav-icon shrink-0" />
          {showLabels && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}