import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import SettingsSection from "./SettingsSection";
import { DarkModeToggle } from "../ui/DarkModeToggle";
import { useTheme } from "../../contexts/ThemeContext";

export default function AppearanceSection() {
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <SettingsSection
      title="Theme"
      description="Pick the look that feels right for your eyes."
    >
      <div className="flex items-center gap-3 rounded-xl border border-(--border-color) bg-(--bg-primary) px-4 py-3">
        <div
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-(--accent-soft) text-(--accent-strong)"
        >
          <FontAwesomeIcon icon={isDarkMode ? faMoon : faSun} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-(--text-primary)">
            Dark mode
          </p>
          <p className="font-interface text-xs text-(--text-muted)">
            {isDarkMode
              ? "Easier on the eyes at night"
              : "Currently using the light theme"}
          </p>
        </div>

        <DarkModeToggle isDarkMode={isDarkMode} onChange={setIsDarkMode} />
      </div>
    </SettingsSection>
  );
}
