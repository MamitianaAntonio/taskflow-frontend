import { useEffect, useState } from "react";
import { DarkModeToggle } from "../components/ui/DarkModeToggle";
import { useTheme } from "../contexts/ThemeContext";
import useUserStore from "../stores/userStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay, faClock } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

const Navbar = () => {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const user = useUserStore((state) => state.user);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

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
    <nav className="navbar sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 h-18">
      {/* ── Logo ── */}
      <div className="flex items-center gap-2.5">
        <div className="navbar-logo w-9 h-9 rounded-xl overflow-hidden">
          <img
            src="Logo.png"
            alt="TaskFlow"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="navbar-title text-lg font-extrabold tracking-tight">
          Task<span className="navbar-title-accent">Flow</span>
        </h3>
      </div>

      {/* ── Right controls ── */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Dark mode toggle */}
        <DarkModeToggle isDarkMode={isDarkMode} onChange={setIsDarkMode} />
        {/* Date & time - hidden on mobile */}
        <div className="navbar-datetime hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border">
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon
              icon={faCalendarDay}
              className="navbar-datetime-icon text-sm"
            />
            <span className="navbar-datetime-date text-sm font-medium whitespace-nowrap">
              {formattedDate}
            </span>
          </div>
          <div className="navbar-vdivider w-px h-3" />
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon
              icon={faClock}
              className="navbar-datetime-icon text-xs"
            />
            <span className="navbar-datetime-time text-xs font-bold whitespace-nowrap">
              {formattedTime}
            </span>
          </div>
        </div>

        {/* Divider — on mobile */}
        <div className="navbar-vdivider hidden md:block w-px h-6" />

        {/* User */}
        <div
          className="navbar-user flex items-center gap-2 p-2 rounded-xl border 
          cursor-pointer transition-all duration-200"
        >
          {/* Avatar */}
          <div
            className="navbar-avatar w-8 h-8 min-w-8 rounded-lg flex items-center 
            justify-center text-xs font-black text-white"
          >
            {initials}
          </div>
          {/* name + email - hidden on mobile */}
          <div className="hidden md:flex flex-col">
            <span className="navbar-user-name text-md font-bold leading-tight whitespace-nowrap">
              {user?.name ?? "Guest"}
            </span>
            <span
              className="navbar-user-email text-xs leading-tight max-w-36 
              overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {user?.email ?? ""}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
