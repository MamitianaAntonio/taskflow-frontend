import { useEffect, useState } from "react";
import { DarkModeToggle } from "../components/ui/DarkModeToggle";
import { useTheme } from "../contexts/ThemeContext";
import useUserStore from "../stores/userStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay, faClock } from "@fortawesome/free-solid-svg-icons";
import "./style/Navbar.css";

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
      .split(" ")
      .map((n) => n[0])
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
    <nav className="navbar sticky top-0 z-50">
      <div className="navbar-inner">
        {/* Logo */}
        <div className="navbar-left">
          <div className="navbar-logo" aria-hidden="true">
            <img src="Logo.png" alt="TaskFlow" />
          </div>
          <h3 className="navbar-title">
            Task<span className="navbar-title-accent">Flow</span>
          </h3>
        </div>

        {/* Controls */}
        <div className="navbar-right">
          <DarkModeToggle isDarkMode={isDarkMode} onChange={setIsDarkMode} />

          <div className="navbar-datetime" aria-label="Date and time">
            <div className="navbar-datetime-group">
              <FontAwesomeIcon icon={faCalendarDay} className="navbar-datetime-icon" />
              <span className="navbar-datetime-date">{formattedDate}</span>
            </div>
            <div className="navbar-vdivider" aria-hidden="true" />
            <div className="navbar-datetime-group">
              <FontAwesomeIcon
                icon={faClock}
                className="navbar-datetime-icon navbar-datetime-icon--time"
              />
              <span className="navbar-datetime-time">{formattedTime}</span>
            </div>
          </div>

          <div className="navbar-user xl:hidden" aria-label="User profile">
            <div className="navbar-avatar" aria-hidden="true">
              {initials}
            </div>
            <div className="navbar-user-text">
              <span className="navbar-user-name">{user?.name ?? "Guest"}</span>
              <span className="navbar-user-email">{user?.email ?? ""}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
