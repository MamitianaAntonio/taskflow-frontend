import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdCard, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { getInitials } from "../../utils/format";
import type { User } from "../../types/user";

export default function ProfileHero({ user }: { user: User | null }) {
  const initials = getInitials(user?.name);

  return (
    <div className="relative flex items-center gap-3 overflow-hidden rounded-xl bg-(--accent-color) p-3.5 sm:p-4">
      <div
        className="absolute -right-6 -top-8 h-28 w-28 rounded-full backdrop-blur-sm"
        style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
      />

      <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-(--text-white) bg-(--text-white) text-lg font-bold text-(--accent-strong) backdrop-blur-md">
        {initials || "U"}
      </div>

      <div className="relative z-10 min-w-0">
        <p className="truncate text-sm font-semibold text-(--text-white)">
          {user?.name ?? "Guest user"}
        </p>
        <p className="truncate font-interface text-xs text-(--text-white) opacity-85">
          {user?.email ?? "No email address"}
        </p>
      </div>

      <div className="relative z-10 ml-auto flex shrink-0 items-center gap-1.5">
        <span
          className="hidden items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium text-(--text-white) backdrop-blur-sm sm:inline-flex"
          style={{ backgroundColor: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.2)" }}
        >
          <FontAwesomeIcon icon={faIdCard} className="text-[9px]" />
          ID #{user?.id ?? "-"}
        </span>
        <span
          className="hidden items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium text-(--text-white) backdrop-blur-sm sm:inline-flex"
          style={{ backgroundColor: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.2)" }}
        >
          <FontAwesomeIcon icon={faShieldHalved} className="text-[9px]" />
          Account
        </span>
      </div>
    </div>
  );
}