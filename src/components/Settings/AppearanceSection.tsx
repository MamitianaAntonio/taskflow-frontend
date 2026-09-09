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
      <div className="flex items-center justify-between rounded-lg border border-(--border-color) px-4 py-3">
        <span className="text-sm text-(--text-primary)">Dark mode</span>
        <DarkModeToggle isDarkMode={isDarkMode} onChange={setIsDarkMode} />
      </div>
    </SettingsSection>
  );
}