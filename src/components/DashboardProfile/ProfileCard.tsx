import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { ROUTES } from "../../constants/routes";
import UserAvatar from "../ui/UserAvatar";
import type { User } from "../../types/user";

export default function ProfileCard({ user }: { user: User | null }) {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex shrink-0 items-center gap-4 overflow-hidden rounded-xl
      border border-(--border-color) bg-(--bg-secondary) p-3 shadow-sm sm:p-4"
    >
      {/* Décor : halos légers le long des bords */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-(--decor-glow) blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 -left-10 h-24 w-24 rounded-full bg-(--decor-glow-soft) blur-2xl"
      />

      <div className="relative z-10 shrink-0">
        <UserAvatar
          user={user}
          shape="rounded"
          className="h-10 w-10 ring-1 ring-(--border-color) select-none sm:h-12 sm:w-12"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-(--bg-secondary) bg-(--color-success)"
        />
      </div>

      <div className="relative z-10 min-w-0 flex-1">
        <p className="truncate text-sm font-semibold tracking-tight text-(--text-primary)">
          {user?.name ?? "Guest user"}
        </p>
        <p className="truncate font-interface text-xs text-(--text-muted)">
          {user?.email ?? "No email address"}
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate(ROUTES.settings)}
        aria-label="Settings"
        title="Settings"
        className="relative z-10 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg
        border border-(--border-color) bg-(--bg-primary) text-(--text-muted) outline-none
        transition-colors duration-200 hover:bg-(--bg-hover) hover:text-(--text-primary)
        focus-visible:ring-2 focus-visible:ring-(--border-color) active:scale-95"
      >
        <FontAwesomeIcon icon={faGear} className="text-sm" />
      </button>
    </div>
  );
}
