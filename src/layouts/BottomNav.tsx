import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { primaryNav, systemNav } from "../constants/navigation";

const bottomItems = [...primaryNav, ...systemNav];

export default function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-(--border-color) bg-(--bg-secondary) md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Main navigation"
    >
      <div className="grid grid-cols-5">
        {bottomItems.map((item) => (
          <NavLink
            key={item.key}
            to={item.path}
            end={item.key === "dashboard"}
            className={({ isActive }) =>
              `flex min-w-0 flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors ${
                isActive
                  ? "text-(--accent-color)"
                  : "text-(--text-muted) hover:text-(--text-secondary)"
              }`
            }
          >
            <FontAwesomeIcon icon={item.icon} className="text-base leading-none" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}