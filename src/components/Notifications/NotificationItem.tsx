import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faFolder, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { getNotificationConfig } from "../../constants/notificationConfig";
import { getTodoById } from "../../stores/todoStore";
import { getProject } from "../../stores/projectStore";
import { formatTimeAgo } from "../../utils/date";
import { ROUTES } from "../../constants/routes";
import type { AppNotification } from "../../types/notification";

interface NotificationItemProps {
  notification: AppNotification;
  onMarkRead?: (id: number) => Promise<void> | void;
  onDelete?: (id: number) => Promise<void> | void;
  compact?: boolean;
}

export default function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
  compact = false,
}: NotificationItemProps) {
  const navigate = useNavigate();
  const config = getNotificationConfig(notification);

  const todo = notification.todoId ? getTodoById(notification.todoId) : undefined;
  const project = todo?.projectId ? getProject(todo.projectId) : undefined;
  const linkable = Boolean(notification.todoId);

  const handleOpen = () => {
    if (!linkable || !notification.todoId) return;
    navigate(project ? ROUTES.projectDetails(project.id) : ROUTES.tasks);
  };

  return (
    <div
      role="button"
      tabIndex={linkable ? 0 : -1}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" && linkable) handleOpen();
      }}
      className={`group relative flex cursor-pointer items-center gap-3 px-4 py-3 outline-none transition-colors hover:bg-(--bg-hover) focus-visible:bg-(--bg-hover) ${
        notification.read ? "" : "bg-(--accent-bg)"
      } ${compact ? "gap-2.5 px-3.5 py-2.5" : ""}`}
    >
      {!notification.read && (
        <span className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-(--accent-color)" />
      )}

      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.color} ${
          compact ? "h-8 w-8 rounded-lg" : ""
        }`}
      >
        <FontAwesomeIcon icon={config.icon} size="sm" />
      </span>

      <div className="min-w-0 flex-1 py-0.5">
        <p
          className={`truncate text-sm font-medium leading-snug text-(--text-primary) ${
            compact ? "text-[13px]" : ""
          }`}
        >
          {notification.message}
        </p>
        <div
          className={`mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 font-interface text-xs text-(--text-muted) ${
            compact ? "text-[11px]" : ""
          }`}
        >
          <span className={notification.read ? "font-medium" : "font-semibold text-(--accent-strong)"}>
            {config.label}
          </span>
          {project && (
            <span className="inline-flex items-center gap-1 rounded-md bg-(--bg-tertiary) px-1.5 py-0.5 text-[10px] font-medium text-(--text-secondary)">
              <FontAwesomeIcon icon={faFolder} size="2xs" className="text-(--accent-color)" />
              {project.name}
            </span>
          )}
          <span>·</span>
          <span className="shrink-0">{formatTimeAgo(notification.createdAt)}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        {!notification.read && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkRead?.(notification.id);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-(--text-muted) transition-colors hover:bg-(--color-success-soft) hover:text-(--color-success) md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
            aria-label="Mark as read"
            title="Mark as read"
          >
            <FontAwesomeIcon icon={faCheck} size="xs" />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(notification.id);
          }}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-(--text-muted) transition-colors hover:bg-(--color-error-soft) hover:text-(--color-error) md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
          aria-label="Delete notification"
          title="Delete"
        >
          <FontAwesomeIcon icon={faTrashCan} size="xs" />
        </button>
      </div>
    </div>
  );
}