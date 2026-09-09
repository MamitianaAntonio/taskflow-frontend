import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { ROUTES } from "../../constants/routes";
import { getInitials } from "../../utils/format";
import type { User } from "../../types/user";

export default function ProfileCard({ user }: { user: User | null }) {
  const navigate = useNavigate();

  return (
    <div className="group relative flex shrink-0 items-center gap-4 overflow-hidden rounded-xl border border-(--border-color) bg-(--accent-color) p-3 transition-all duration-200 hover:shadow-md sm:p-4">
      <div
        className="absolute -right-6 -top-8 h-28 w-28 rounded-full blur-sm"
        style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
      />

      <div className="relative z-10 shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(255,255,255,0.5)] bg-(--text-white) text-xl font-bold text-(--accent-strong) shadow-sm backdrop-blur-md transition-transform duration-200 select-none group-hover:scale-105 sm:h-12 sm:w-12">
          {getInitials(user?.name) || "U"}
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-(--gradient-from) bg-(--color-success)" />
      </div>

      <div className="relative z-10 min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-(--text-white)">
          {user?.name ?? "Guest user"}
        </p>
        <p className="truncate font-mono text-xs text-[rgba(255,255,255,0.85)]">
          {user?.email ?? "No email address"}
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate(ROUTES.settings)}
        aria-label="Settings"
        title="Settings"
        className="relative z-10 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[rgba(255,255,255,0.4)] bg-[rgba(255,255,255,0.12)] text-white transition-all duration-200 hover:bg-white hover:text-(--accent-strong) active:scale-95"
      >
        <FontAwesomeIcon icon={faGear} className="text-sm" />
      </button>
    </div>
  );
}