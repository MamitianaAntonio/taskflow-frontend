import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/Button";

export default function ProfileCard({ user }) {
  return (
    <div className="flex items-center gap-4 bg-(--bg-secondary) border border-(--border-color) rounded-xl p-3 sm:p-4 shrink-0 transition-all duration-200 hover:border-(--border-color)/80 hover:shadow-sm group">
      <div className="relative shrink-0">
        <div
          className="w-10 h-10 sm:w-12 sm:h-12 text-xl sm:text-2xl font-bold
          text-(--text-white) rounded-xl
          flex items-center justify-center select-none
          bg-linear-to-br from-(--gradient-from) to-(--gradient-to)
          transition-transform duration-200 group-hover:scale-105"
        >
          {user?.name?.[0] ?? "U"}
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-(--color-success) border-2 border-(--bg-secondary)" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm text-(--text-primary) truncate">
          {user?.name ?? "Guest user"}
        </p>
        <p className="text-xs text-(--text-secondary) font-mono truncate">
          {user?.email ?? "No email address"}
        </p>
      </div>
      <Button variant="outline" size="small" className="shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
        <FontAwesomeIcon icon={faGear} />
      </Button>
    </div>
  );
}
