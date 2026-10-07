import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { DarkModeToggle } from "../components/ui/DarkModeToggle";
import NotificationBell from "../components/Notifications/NotificationBell";
import GlobalSearch from "./GlobalSearch";
import { useTheme } from "../contexts/ThemeContext";
import useUserStore from "../stores/userStore";
import { getPageTitle } from "../constants/navigation";
import { getInitials } from "../utils/format";
import { ROUTES } from "../constants/routes";

const Navbar = () => {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileSearch, setMobileSearch] = useState(false);

  const initials = getInitials(user?.name);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-(--border-color) bg-(--bg-secondary)">
      <div className="grid h-16 w-full grid-cols-[1fr_auto] items-center gap-4 px-4 sm:px-6 md:grid-cols-[1fr_auto_1fr] lg:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <a
            href={ROUTES.dashboard}
            className="group flex shrink-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-(--accent-color)"
            aria-label="TaskFlow dashboard"
          >
            <span
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-(--bg-tertiary) shadow-sm
              ring-1 ring-(--border-color) transition-transform group-hover:scale-105"
            >
              <img
                src="/Logo.png"
                alt="TaskFlow logo"
                className="h-full w-full object-contain"
              />
            </span>
            <span className="text-[15px] font-bold tracking-tight text-(--text-primary)">
              Task<span className="text-(--accent-color)">Flow</span>
            </span>
          </a>

          <span className="hidden min-w-0 font-interface text-xs font-semibold uppercase tracking-widest text-(--accent-color) sm:block">
            {getPageTitle(pathname)}
          </span>
        </div>

        {/* Global search, centered (md and up) */}
        <div className="hidden md:flex md:justify-center">
          <GlobalSearch className="w-72 lg:w-96" />
        </div>

        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setMobileSearch((prev) => !prev)}
            aria-label="Search"
            aria-expanded={mobileSearch}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-(--text-muted) transition-all
            hover:bg-(--bg-tertiary) hover:text-(--text-primary) md:hidden"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>

          <NotificationBell />
          <DarkModeToggle isDarkMode={isDarkMode} onChange={setIsDarkMode} />

          <button
            type="button"
            onClick={() => navigate(ROUTES.settings)}
            title={user?.name ?? "Guest"}
            aria-label={`User: ${user?.name ?? "Guest"}`}
            className="ml-1 flex cursor-pointer items-center gap-2 rounded-xl py-1 pl-1 pr-2 outline-none transition-colors
            hover:bg-(--bg-tertiary) focus-visible:ring-2 focus-visible:ring-(--accent-color) sm:ml-2"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--accent-color) text-xs font-bold text-(--text-white) shadow-(--shadow-pink)">
              {initials}
            </span>
            <span className="hidden min-w-0 text-left lg:block">
              <span className="block max-w-28 truncate text-sm font-semibold leading-tight text-(--text-primary)">
                {user?.name ?? "Guest"}
              </span>
              <span className="block max-w-28 truncate font-interface text-[10px] font-medium leading-tight text-(--text-muted)">
                {user?.email ?? "View profile"}
              </span>
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileSearch && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="border-t border-(--border-color) px-4 pb-3 pt-2.5 sm:px-6 md:hidden"
          >
            <GlobalSearch autoFocus onNavigate={() => setMobileSearch(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
