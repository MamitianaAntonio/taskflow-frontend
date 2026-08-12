import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/Button";

export default function ProfileCard({ user }) {
  return (
    <div
      className="relative overflow-hidden flex items-center gap-4 bg-linear-to-r from-(--gradient-from)
      to-(--gradient-to) border border-(--border-color) rounded-xl p-3 sm:p-4 shrink-0 transition-all duration-200 hover:shadow-md group"
    >
      <div className="absolute -top-8 -right-6 w-28 h-28 rounded-full bg-(--text-white)/10 blur-sm" />

      <div className="relative z-10 shrink-0">
        <div
          className="w-10 h-10 sm:w-12 sm:h-12 text-xl sm:text-2xl font-bold
          text-(--text-white) rounded-xl
          flex items-center justify-center select-none
          bg-(--text-white)/20 border border-(--text-white)/30 backdrop-blur-md
          transition-transform duration-200 group-hover:scale-105"
        >
          {user?.name?.[0] ?? "U"}
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-(--color-success) border-2 border-(--gradient-to)" />
      </div>

      <div className="relative z-10 min-w-0 flex-1">
        <p className="font-semibold text-sm text-(--text-white) truncate">
          {user?.name ?? "Guest user"}
        </p>
        <p className="text-xs text-(--text-white)/85 font-mono truncate">
          {user?.email ?? "No email address"}
        </p>
      </div>

      <Link to="/dashboard/settings" className="relative z-10 shrink-0">
        <Button
          variant="outline"
          size="small"
          className="opacity-70 group-hover:opacity-100 transition-opacity border-(--text-white)/40 text-(--text-white)
          hover:border-(--text-white) hover:text-(--text-white)"
        >
          <FontAwesomeIcon icon={faGear} />
        </Button>
      </Link>
    </div>
  );
}
