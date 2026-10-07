import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIdCard,
  faShieldHalved,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { getInitials } from "../../utils/format";
import type { User } from "../../types/user";

function Badge({
  icon,
  children,
}: {
  icon: IconDefinition;
  children: React.ReactNode;
}) {
  return (
    <span
      className="hidden items-center gap-1 rounded-full border border-(--text-white)/20 bg-(--text-white)/15 px-2.5 py-1
      text-[10px] font-medium text-(--text-white) backdrop-blur-sm sm:inline-flex"
    >
      <FontAwesomeIcon icon={icon} className="text-[9px]" />
      {children}
    </span>
  );
}

export default function ProfileHero({ user }: { user: User | null }) {
  const initials = getInitials(user?.name) || "U";
  const name = user?.name ?? "Guest user";
  const email = user?.email ?? "No email address";

  return (
    <div
      className="relative brightness-95 flex items-center gap-3.5 overflow-hidden rounded-2xl bg-(--accent-color) p-4
    shadow-sm ring-1 ring-inset ring-(--text-white)/10 sm:p-5"
    >
      {/* Décor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-(--text-white)/10 via-transparent to-(--shadow)"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-10 size-32 rounded-full bg-(--text-white)/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 right-16 size-24 rounded-full bg-(--text-white)/5"
      />

      {/* Avatar */}
      <div
        aria-hidden="true"
        className="relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-(--text-white)/95 text-lg
        font-bold text-(--accent-strong) shadow-md shadow-(color:--shadow)"
      >
        {initials}
      </div>

      {/* Infos */}
      <div className="relative min-w-0">
        <p
          title={name}
          className="truncate text-sm font-semibold text-(--text-white) sm:text-base"
        >
          {name}
        </p>
        <p
          title={email}
          className="truncate font-interface text-xs text-(--text-white)/80"
        >
          {email}
        </p>
      </div>

      {/* Badges */}
      <div className="relative ml-auto flex shrink-0 items-center gap-1.5">
        {user?.id && <Badge icon={faIdCard}>ID #{user.id}</Badge>}
        <Badge icon={faShieldHalved}>Account</Badge>
      </div>
    </div>
  );
}
