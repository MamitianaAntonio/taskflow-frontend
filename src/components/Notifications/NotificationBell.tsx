import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import useNotificationStore from "../../stores/notificationStore";
import { useUnreadNotifications } from "../../hooks/useUnreadNotifications";
import { ROUTES } from "../../constants/routes";

export default function NotificationBell() {
  const navigate = useNavigate();
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  useUnreadNotifications();

  return (
    <button
      type="button"
      onClick={() => navigate(ROUTES.notifications)}
      className="relative flex h-9 w-9 items-center justify-center rounded-control text-(--text-muted)
       transition-colors hover:bg-(--bg-tertiary) hover:text-(--text-primary)"
      aria-label="Notifications"
    >
      <FontAwesomeIcon icon={faBell} />
      {unreadCount > 0 && (
        <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full
         bg-(--color-error) px-1 font-interface text-[10px] font-bold text-(--text-white)">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}