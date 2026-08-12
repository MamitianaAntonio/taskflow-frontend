import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdCard, faShieldHalved } from "@fortawesome/free-solid-svg-icons";

export default function ProfileHero({ user }) {
  const initials = (user?.name ?? "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="relative overflow-hidden rounded-xl bg-linear-to-r from-(--gradient-from) to-(--gradient-to)
      p-3.5 sm:p-4 flex items-center gap-3"
    >
      <div className="absolute -top-8 -right-6 w-28 h-28 rounded-full bg-(--text-white)/10 blur-sm" />

      <div
        className="relative z-10 flex items-center justify-center w-11 h-11 rounded-xl bg-(--text-white)/20
        border border-(--text-white)/30 text-lg font-bold text-(--text-white) backdrop-blur-md shrink-0"
      >
        {initials || "U"}
      </div>

      <div className="relative z-10 min-w-0">
        <p className="text-sm font-semibold text-(--text-white) truncate">
          {user?.name ?? "Guest user"}
        </p>
        <p className="text-xs text-(--text-white)/85 font-interface truncate">
          {user?.email ?? "No email address"}
        </p>
      </div>

      <div className="relative z-10 ml-auto flex items-center gap-1.5 shrink-0">
        <span
          className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-full bg-(--text-white)/15 border
          border-(--text-white)/20 text-[10px] font-medium text-(--text-white) backdrop-blur-sm"
        >
          <FontAwesomeIcon icon={faIdCard} className="text-[9px]" />
          ID #{user?.id ?? "-"}
        </span>
        <span
          className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-full bg-(--text-white)/15 border
          border-(--text-white)/20 text-[10px] font-medium text-(--text-white) backdrop-blur-sm"
        >
          <FontAwesomeIcon icon={faShieldHalved} className="text-[9px]" />
          Account
        </span>
      </div>
    </div>
  );
}
