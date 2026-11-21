import { Moon, Sun } from "lucide-react";
import "./style/DarkModeToggle.css";

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onChange: (value: boolean) => void;
}

export const DarkModeToggle = ({
  isDarkMode,
  onChange,
}: DarkModeToggleProps) => {
  const Icon = isDarkMode ? Moon : Sun;

  return (
    <button
      className="darkmode-toggle-btn"
      onClick={() => onChange(!isDarkMode)}
      aria-label="Toggle dark mode"
      title={isDarkMode ? "Light mode" : "Dark mode"}
      type="button"
    >
      <Icon aria-hidden="true" className="toggle-icon" size={17} strokeWidth={1.8} />
    </button>
  );
};
