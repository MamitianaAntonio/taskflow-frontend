import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import Button from "../ui/Button";
import useNotificationStore from "../../stores/notificationStore";
import { useUnreadNotifications } from "../../hooks/useUnreadNotifications";
import { ROUTES } from "../../constants/routes";

export default function NotificationBell() {
  const navigate = useNavigate();
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  useUnreadNotifications();

  return (
    <Button
      type="button"
      variant="text"
      size="icon"
      className="text-(--text-muted)"
      aria-label="Notifications"
      onClick={() => navigate(ROUTES.notifications)}
      icon={<Bell aria-hidden="true" size={18} strokeWidth={1.8} />}
    >
      {unreadCount > 0 && (
        <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-(--color-error) px-1 font-interface text-[10px] font-bold text-(--text-white)">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Button>
  );
}
