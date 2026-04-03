import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";
import { primaryNav, systemNav } from "../../constants/navigation";
import "./Sidebar.css";
import Button from "../ui/Button";
import useUserStore from "../../stores/userStore";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef(null);
  const navigate = useNavigate();
  const logout = useUserStore((state) => state.logout);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // On mobile, always show the full navigation drawer.
      if (mobile) setCollapsed(false);
      if (!mobile) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) setOpen((prev) => !prev);
    else setCollapsed((prev) => !prev);
  };

  const closeMobile = () => {
    if (isMobile) setOpen(false);
  };

  useEffect(() => {
    if (!isMobile || !open) return;

    // Lock body scroll while the drawer is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus the close button for better keyboard UX.
    closeButtonRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobile, open]);

  const navItemClassName = (collapsed) => ({ isActive }) =>
    `sidebar-nav-link flex items-center gap-3 w-full px-3 py-2 rounded-md transition-all duration-200 relative ${collapsed ? "justify-center" : ""
    } ${isActive ? "is-active" : ""}`;

  return (
    <>
      {/* MOBILE TOGGLE BUTTON */}
      {isMobile && !open && (
        <button
          onClick={toggleSidebar}
          className="sidebar-mobile-toggle fixed top-18 left-2 z-50 p-2 rounded-md border"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          type="button"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      )}

      {/* OVERLAY */}
      {isMobile && (
        <div
          className={`sidebar-overlay fixed inset-0 transition-opacity z-30 ${open
              ? "opacity-100 visible pointer-events-auto"
              : "opacity-0 invisible pointer-events-none"
            }`}
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          sidebar
          flex flex-col transition-all duration-300 ease-in-out
          ${collapsed ? "w-20 is-collapsed" : "w-64"}
          ${isMobile ? "fixed top-16 h-[calc(100vh-64px)] z-40" : "relative"}
          ${isMobile && !open ? "-translate-x-full" : "translate-x-0"}
        `}
        role={isMobile ? "dialog" : "navigation"}
        aria-modal={isMobile ? "true" : undefined}
        aria-label="Navigation"
      >
        {/* HEADER / TOGGLE */}
        <div className="sidebar-header flex items-center justify-between px-3 py-3 border-b">
          <div className="sidebar-brand flex items-center gap-3 min-w-0">
            <div className="sidebar-brand__mark" aria-hidden="true">
              TF
            </div>
          </div>

          {isMobile ? (
            <button
              ref={closeButtonRef}
              onClick={() => setOpen(false)}
              className="sidebar-close-btn font-bold rounded transition-all"
              aria-label="Fermer la navigation"
              type="button"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          ) : (
            <button
              onClick={toggleSidebar}
              className="sidebar-toggle-btn font-bold rounded transition-all"
              aria-label={collapsed ? "Expand the navigation" : "Reduce the navigation"}
              type="button"
            >
              <FontAwesomeIcon
                icon={faBars}
                className={`sidebar-toggle-icon ${collapsed ? "sidebar-toggle-icon--collapsed" : ""}`}
              />
            </button>
          )}
        </div>

        <div className="sidebar__scroll flex-1 overflow-y-auto px-2 py-2 min-w-0 flex flex-col justify-between">
          <div>
            {/* PRIMARY NAV */}
            {!collapsed && (
              <div className="sidebar-section flex justify-between items-center mb-2 px-2">
                <span
                  className="sidebar-section__title"
                >
                  Workspace
                </span>
              </div>
            )}
            <div className="flex flex-col gap-2 mb-4">
              {primaryNav.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.path}
                  onClick={closeMobile}
                  className={navItemClassName(collapsed)}
                  aria-label={collapsed ? item.label : undefined}
                  title={collapsed ? item.label : undefined}
                  end
                >
                  <FontAwesomeIcon icon={item.icon} className="sidebar-nav-icon shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              ))}
            </div>

            <hr className="sidebar-divider" />

            {/* SYSTEM NAV */}
            {!collapsed && (
              <div className="sidebar-section flex justify-between items-center mt-4 mb-2 px-2">
                <span
                  className="sidebar-section__title"
                >
                  System
                </span>
              </div>
            )}
            <div className="flex flex-col gap-2 mt-2">
              {systemNav.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.path}
                  onClick={closeMobile}
                  className={navItemClassName(collapsed)}
                  aria-label={collapsed ? item.label : undefined}
                  title={collapsed ? item.label : undefined}
                >
                  <FontAwesomeIcon icon={item.icon} className="sidebar-nav-icon flex-shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>

          {/* LOGOUT */}
            <Button
              variant="outline"
              className="sidebar-logout w-full"
              onClick={() => {
                localStorage.removeItem("token");
                logout();
                setOpen(false);
                navigate("/login");
              }}
            >
              <FontAwesomeIcon
                icon={faPowerOff}
                className="sidebar-nav-icon flex-shrink-0"
              />
              {!collapsed && <span>Logout</span>}
            </Button>
        </div>
      </aside>
    </>
  );
}
