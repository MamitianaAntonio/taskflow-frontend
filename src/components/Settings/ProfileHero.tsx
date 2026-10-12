import type { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIdCard,
  faShieldHalved,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import UserAvatar from "../ui/UserAvatar";
import type { User } from "../../types/user";

function Badge({ icon, children }: { icon: IconDefinition; children: ReactNode }) {
  return (
    <span
      className="hidden items-center gap-1 rounded-full border border-(--border-color) bg-(--bg-primary) px-2.5 py-1
      text-[10px] font-medium text-(--text-secondary) sm:inline-flex"
    >
      <FontAwesomeIcon icon={icon} className="text-[9px]" />
      {children}
    </span>
  );
}

export default function ProfileHero({ user }: { user: User | null }) {
  const name = user?.name ?? "Guest user";
  const email = user?.email ?? "No email address";

  return (
    <div
      className="relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-(--border-color)
      bg-(--bg-secondary) p-4 shadow-sm sm:p-5"
    >
      {/* Décor (conservé) : halos légers le long des bords de la carte */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-(--decor-glow) via-transparent to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-14 size-40 rounded-full bg-(--decor-glow) blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -bottom-16 size-32 rounded-full bg-(--decor-glow) blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-12 size-32 rounded-full bg-(--decor-glow-soft) blur-3xl"
      />

      {/* Avatar */}
      <UserAvatar
        user={user}
        shape="rounded"
        className="relative size-12 shrink-0 shadow-sm"
      />

      {/* Infos */}
      <div className="relative min-w-0">
        <p
          title={name}
          className="truncate text-sm font-semibold text-(--text-primary) sm:text-base"
        >
          {name}
        </p>
        <p
          title={email}
          className="truncate font-interface text-xs text-(--text-muted)"
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
