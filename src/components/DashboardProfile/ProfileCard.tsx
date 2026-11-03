import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { ROUTES } from "../../constants/routes";
import UserAvatar from "../ui/UserAvatar";
import type { User } from "../../types/user";

export default function ProfileCard({ user }: { user: User | null }) {
  const navigate = useNavigate();

  return (
    <div
      className="flex w-full min-w-0 items-center gap-3 rounded-2xl border border-(--border-color)
      bg-(--bg-secondary) p-2.5 pr-3 sm:w-auto sm:max-w-xs sm:gap-3.5"
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <UserAvatar
          user={user}
          shape="rounded"
          className="h-11 w-11 select-none sm:h-12 sm:w-12"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2
          border-(--bg-secondary) bg-(--color-success)"
        />
      </div>

      {/* Infos */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold leading-tight tracking-tight text-(--text-primary) sm:text-base">
          {user?.name ?? "Guest user"}
        </p>
        <p className="mt-0.5 truncate font-interface text-xs text-(--text-muted) sm:text-[13px]">
          {user?.email ?? "No email address"}
        </p>
      </div>

      {/* Settings */}
      <button
        type="button"
        onClick={() => navigate(ROUTES.settings)}
        aria-label="Settings"
        title="Settings"
        className="group flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl
        text-(--text-muted) outline-none transition-colors duration-200
        hover:bg-(--bg-hover) hover:text-(--text-primary)
        focus-visible:ring-2 focus-visible:ring-(--accent-color) active:scale-95"
      >
        <Settings
          aria-hidden="true"
          strokeWidth={1.75}
          className="h-5 w-5 transition-transform duration-300 motion-safe:group-hover:rotate-45"
        />
      </button>
    </div>
  );
}
