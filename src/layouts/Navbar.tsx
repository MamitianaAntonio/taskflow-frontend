import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import Button from "../components/ui/Button";
import { DarkModeToggle } from "../components/ui/DarkModeToggle";
import NotificationBell from "../components/Notifications/NotificationBell";
import GlobalSearch from "./GlobalSearch";
import { useTheme } from "../contexts/ThemeContext";
import useUserStore from "../stores/userStore";
import UserAvatar from "../components/ui/UserAvatar";
import { ROUTES } from "../constants/routes";

const Navbar = () => {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const [mobileSearch, setMobileSearch] = useState(false);

  useEffect(() => {
    if (!mobileSearch) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileSearch(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileSearch]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-(--border-color) bg-(--bg-primary)">
      <div className="grid h-16 grid-cols-[1fr_auto] items-center gap-4 px-3 sm:px-4 md:grid-cols-[1fr_minmax(0,36rem)_1fr] lg:px-6">
        <a
          href={ROUTES.dashboard}
          aria-label="TaskFlow dashboard"
          className="group flex w-fit items-center gap-2.5 rounded-control outline-none focus-visible:ring-2
          focus-visible:ring-(--accent-color)"
        >
          <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-control bg-(--bg-tertiary) ring-1 ring-(--border-color) transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
            <img
              src="/Logo.png"
              alt=""
              className="h-full w-full object-contain"
            />
          </span>
          <span className="text-sm font-semibold tracking-tight text-(--text-primary)">
            Task<span className="text-(--accent-color)">Flow</span>
          </span>
        </a>

        <div className="hidden md:block">
          <GlobalSearch className="w-full" shortcut />
        </div>

        <div className="flex min-w-0 items-center justify-end gap-1">
          <Button
            type="button"
            variant="text"
            size="icon"
            aria-label={mobileSearch ? "Close search" : "Search"}
            aria-expanded={mobileSearch}
            onClick={() => setMobileSearch((prev) => !prev)}
            icon={
              mobileSearch ? (
                <X aria-hidden="true" size={18} strokeWidth={1.8} />
              ) : (
                <Search aria-hidden="true" size={18} strokeWidth={1.8} />
              )
            }
            className="text-(--text-muted) md:hidden"
          />

          <NotificationBell />
          <DarkModeToggle isDarkMode={isDarkMode} onChange={setIsDarkMode} />

          <button
            type="button"
            onClick={() => navigate(ROUTES.settings)}
            title={user?.name ?? "Guest"}
            aria-label={`Settings for ${user?.name ?? "Guest"}`}
            className="ml-1 flex shrink-0 cursor-pointer rounded-control p-1 outline-none transition-colors
            hover:bg-(--bg-tertiary) focus-visible:ring-2 focus-visible:ring-(--accent-color)"
          >
            <UserAvatar
              user={user}
              shape="rounded"
              className="h-8 w-8 ring-1 ring-(--border-color)"
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-(--border-color) md:hidden"
          >
            <div className="px-3 pb-3 pt-2.5 sm:px-4">
              <GlobalSearch
                autoFocus
                onNavigate={() => setMobileSearch(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
