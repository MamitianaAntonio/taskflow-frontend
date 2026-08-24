import { useEffect, useState } from "react";
import { DarkModeToggle } from "../components/ui/DarkModeToggle";
import { useTheme } from "../contexts/ThemeContext";
import useUserStore from "../stores/userStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay, faClock } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const user = useUserStore((state) => state.user);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const initials = (() => {
    const name = user?.name;
    if (!name) return "?";
    return name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  })();

  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-(--border-color) bg-(--bg-secondary) backdrop-blur-md">
      <div className="flex h-16 w-full items-center justify-between px-5 sm:px-8 lg:px-10">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-(--bg-tertiary) ring-1 ring-(--border-color)">
            <img
              src="/Logo.png"
              alt="TaskFlow"
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-(--text-primary)">
            Task<span className="text-(--accent-color)">Flow</span>
          </h1>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Date & time — grouped as one soft pill */}
          <div
            className="hidden items-center gap-2 rounded-full bg-(--bg-tertiary) px-3.5 py-2 sm:flex"
            aria-label="Date and time"
          >
            <FontAwesomeIcon
              icon={faCalendarDay}
              className="text-xs text-(--accent-color)"
            />
            <span className="whitespace-nowrap text-xs font-medium text-(--text-secondary)">
              {formattedDate}
            </span>
            <span className="text-(--text-muted)">·</span>
            <FontAwesomeIcon
              icon={faClock}
              className="text-xs text-(--accent-color)"
            />
            <span className="font-mono text-xs font-semibold tabular-nums text-(--text-primary)">
              {formattedTime}
            </span>
          </div>

          <DarkModeToggle isDarkMode={isDarkMode} onChange={setIsDarkMode} />

          {/* Profile */}
          <div
            className="flex items-center gap-2.5 rounded-full bg-(--bg-tertiary) py-1.5 pl-1.5 pr-3.5"
            aria-label="User profile"
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--accent-bg) text-xs
              font-bold text-(--accent-color) ring-(--accent-muted)"
            >
              {initials}
            </div>
            <div className="hidden min-w-0 lg:block">
              <p className="max-w-32 truncate text-sm font-medium text-(--text-primary)">
                {user?.name ?? "Guest"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
