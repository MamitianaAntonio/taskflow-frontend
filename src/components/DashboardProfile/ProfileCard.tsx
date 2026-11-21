import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import Button from "../ui/Button";
import { ROUTES } from "../../constants/routes";
import UserAvatar from "../ui/UserAvatar";
import type { User } from "../../types/user";

/** Avatar, then name + settings on one line, email below. */
export default function ProfileCard({ user }: { user: User | null }) {
  const navigate = useNavigate();

  return (
      <div className="flex w-full min-w-0 cursor-default items-center gap-3 sm:w-auto sm:max-w-xs">
        {/* Avatar + status dot */}
        <div className="relative shrink-0">
          <UserAvatar
              user={user}
              shape="rounded"
              className="size-10 select-none rounded-full sm:size-11"
          />
          <span
              aria-hidden="true"
              className="absolute right-0 bottom-0 size-2.5 rounded-full bg-(--color-success) ring-2 ring-(--bg-primary)"
          />
        </div>

        <div className="min-w-0">
          {/* Name + settings */}
          <div className="flex min-w-0 items-center gap-1">
            <p className="truncate text-sm font-semibold leading-tight text-(--text-primary) sm:text-[15px]">
              {user?.name ?? "Guest user"}
            </p>
            <Button
                type="button"
                variant="text"
                size="icon"
                onClick={() => navigate(ROUTES.settings)}
                aria-label="Settings"
                title="Settings"
                className="size-6 shrink-0 text-(--text-muted) hover:bg-transparent hover:text-(--accent-strong)"
                icon={
                  <Settings
                      aria-hidden="true"
                      strokeWidth={1.8}
                      className="size-4"
                  />
                }
            />
          </div>

          {/* Email */}
          <p className="truncate font-interface text-[11px] text-(--text-muted) sm:text-xs">
            {user?.email ?? "No email address"}
          </p>
        </div>
      </div>
  );
}