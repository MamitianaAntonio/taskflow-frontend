import "./style/DarkModeToggle.css";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const DarkModeToggle = ({ isDarkMode, onChange }) => {
  return (
    <button
      className="darkmode-toggle-btn"
      onClick={() => onChange(!isDarkMode)}
      aria-label="Toggle dark mode"
      title={isDarkMode ? "Light mode" : "Dark mode"}
      type="button"
    >
      <FontAwesomeIcon
        icon={isDarkMode ? faMoon : faSun}
        className="toggle-icon"
      />
    </button>
  );
};
