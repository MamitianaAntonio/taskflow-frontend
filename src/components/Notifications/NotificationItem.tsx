import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCheck,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { getNotificationConfig } from "../../constants/notificationConfig";
import { getAllTodo } from "../../services/todo";
import { formatTimeAgo } from "../../utils/date";
import { ROUTES } from "../../constants/routes";
import type { AppNotification } from "../../types/notification";

interface NotificationItemProps {
  notification: AppNotification;
  onMarkRead?: (id: number) => Promise<void> | void;
  onDelete?: (id: number) => Promise<void> | void;
}

export default function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
}: NotificationItemProps) {
  const navigate = useNavigate();
  const config = getNotificationConfig(notification);
  const linkable = Boolean(notification.todoId);

  const handleOpen = async () => {
    if (!linkable) return;
    try {
      const todos = await getAllTodo();
      const todo = todos.find((t) => t.id === notification.todoId);
      if (todo?.projectId) {
        navigate(ROUTES.projectDetails(todo.projectId));
        return;
      }
    } catch {
      /* fall through to tasks */
    }
    navigate(ROUTES.tasks);
  };

  const content = (
    <button
      type="button"
      onClick={handleOpen}
      className={`min-w-0 flex-1 text-left ${linkable ? "cursor-pointer" : "cursor-default"}`}
      title={linkable ? "Open task" : undefined}
      aria-label={linkable ? "Open related task" : undefined}
    >
      <p className="font-interface text-sm leading-snug text-(--text-primary)">
        {notification.message}
      </p>
      <span className="mt-1 flex items-center gap-1.5 font-interface text-xs text-(--text-muted)">
        {!notification.read && (
          <span className="h-1.5 w-1.5 rounded-full bg-(--accent-color)" />
        )}
        <span className="truncate">{config.label}</span>
        <span className="text-(--text-muted)">·</span>
        <span className="shrink-0">{formatTimeAgo(notification.createdAt)}</span>
        {linkable && (
          <FontAwesomeIcon
            icon={faArrowUpRightFromSquare}
            size="xs"
            className="shrink-0 text-(--accent-color) opacity-70"
          />
        )}
      </span>
    </button>
  );

  return (
    <li
      className={`group flex gap-3 px-4 py-3 transition-colors hover:bg-(--bg-secondary) ${
        notification.read ? "" : "bg-(--accent-bg)"
      }`}
    >
      <span
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.bg} ${config.color}`}
      >
        <FontAwesomeIcon icon={config.icon} size="sm" />
      </span>

      {content}

      <div className="flex shrink-0 items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
        {!notification.read && (
          <button
            onClick={() => onMarkRead?.(notification.id)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-(--text-muted) hover:bg-(--bg-tertiary) hover:text-(--color-success)"
            aria-label="Mark as read"
            title="Mark as read"
          >
            <FontAwesomeIcon icon={faCheck} size="xs" />
          </button>
        )}
        <button
          onClick={() => onDelete?.(notification.id)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-(--text-muted) hover:bg-(--bg-tertiary) hover:text-(--color-error)"
          aria-label="Delete notification"
          title="Delete"
        >
          <FontAwesomeIcon icon={faTrashCan} size="xs" />
        </button>
      </div>
    </li>
  );
}