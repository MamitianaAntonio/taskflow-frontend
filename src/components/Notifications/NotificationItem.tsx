import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCheck,
  faCheckCircle,
  faFolder,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
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
}

export default function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
}: NotificationItemProps) {
  const navigate = useNavigate();
  const config = getNotificationConfig(notification);
  const [showActions, setShowActions] = useState(false);

  const todo = notification.todoId ? getTodoById(notification.todoId) : undefined;
  const project = todo?.projectId ? getProject(todo.projectId) : undefined;
  const linkable = Boolean(notification.todoId);

  const handleOpen = () => {
    if (!linkable || !notification.todoId) return;
    if (project) {
      navigate(ROUTES.projectDetails(project.id));
    } else {
      navigate(ROUTES.tasks);
    }
  };

  return (
    <div
      className={`group flex h-11 cursor-pointer items-center gap-3 border-l-4 border-b border-(--border-color) px-3 transition-colors hover:bg-(--bg-hover) ${config.accent} ${
        notification.read ? "bg-(--bg-secondary)" : "bg-(--accent-bg)"
      }`}
      onClick={handleOpen}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${config.bg} ${config.color}`}
      >
        <FontAwesomeIcon icon={config.icon} size="xs" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-interface text-sm text-(--text-primary)">
          {notification.message}
        </p>
        <span className="flex items-center gap-1.5 font-interface text-[11px] text-(--text-muted)">
          {!notification.read && (
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-(--accent-color)" />
          )}
          {project && (
            <span className="inline-flex items-center gap-1 rounded-md border border-(--border-color) bg-(--bg-tertiary) px-1.5 py-0.5 text-[10px] font-medium text-(--text-secondary)">
              <FontAwesomeIcon icon={faFolder} className="text-[8px] text-(--accent-color)" />
              {project.name}
            </span>
          )}
          <span className="truncate">{config.label}</span>
          <span>·</span>
          <span className="shrink-0">{formatTimeAgo(notification.createdAt)}</span>
          {linkable && (
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              size="2xs"
              className="shrink-0 text-(--accent-color) opacity-70"
            />
          )}
        </span>
      </div>

      {showActions && (
        <div className="flex shrink-0 items-center gap-1">
          {!notification.read && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkRead?.(notification.id);
              }}
              className="flex h-7 w-7 items-center justify-center rounded-md text-(--text-muted) transition-colors hover:bg-(--bg-tertiary) hover:text-(--color-success)"
              aria-label="Mark as read"
              title="Mark as read"
            >
              <FontAwesomeIcon icon={faCheck} size="xs" />
            </button>
          )}
          {notification.read && (
            <span className="flex h-7 w-7 items-center justify-center text-(--color-success)">
              <FontAwesomeIcon icon={faCheckCircle} size="xs" />
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(notification.id);
            }}
            className="flex h-7 w-7 items-center justify-center rounded-md text-(--text-muted) transition-colors hover:bg-(--bg-tertiary) hover:text-(--color-error)"
            aria-label="Delete notification"
            title="Delete"
          >
            <FontAwesomeIcon icon={faTrashCan} size="xs" />
          </button>
        </div>
      )}
    </div>
  );
}
