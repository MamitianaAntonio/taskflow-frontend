import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./style/DarkModeToggle.css";

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onChange: (value: boolean) => void;
}

export const DarkModeToggle = ({ isDarkMode, onChange }: DarkModeToggleProps) => {
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