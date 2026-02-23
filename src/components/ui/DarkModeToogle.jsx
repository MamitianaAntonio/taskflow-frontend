import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const DarkModeToggle = ({ isDarkMode, onChange }) => {
  return (
    <button
      className="bg-(--bg-secondary) border-2 border-(--border-color) 
        rounded-full w-8 h-8 flex items-center justify-center cursor-pointer 
        transition-all duration-300 hover:scale-110 hover:border-(--accent-color) 
        hover:shadow-lg active:scale-95"
      onClick={() => onChange(!isDarkMode)}
      aria-label="Toggle dark mode"
      title={isDarkMode ? "Light mode" : "Dark mode"}
    >
      <FontAwesomeIcon
        icon={isDarkMode ? faMoon : faSun}
        className="toggle-icon text-xl"
      />
    </button>
  ) 
}