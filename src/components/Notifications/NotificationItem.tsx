import { useNavigate } from "react-router-dom";
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

const ACTION =
  "text-(--text-muted) transition-colors hover:text-(--text-primary)";

export default function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
}: NotificationItemProps) {
  const navigate = useNavigate();
  const config = getNotificationConfig(notification);

  const todo = notification.todoId
    ? getTodoById(notification.todoId)
    : undefined;
  const project = todo?.projectId ? getProject(todo.projectId) : undefined;
  const linkable = Boolean(notification.todoId);
  const unread = !notification.read;

  const handleOpen = () => {
    if (linkable)
      navigate(project ? ROUTES.projectDetails(project.id) : ROUTES.tasks);
  };

  // Keeps the click from also opening the notification.
  const act = (fn?: (id: number) => unknown) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn?.(notification.id);
  };

  return (
    <div
      role="button"
      tabIndex={linkable ? 0 : -1}
      onClick={handleOpen}
      onKeyDown={(e) => e.key === "Enter" && handleOpen()}
      className={`group flex items-start gap-3 rounded-lg px-2 py-2.5 outline-none transition-colors hover:bg-(--bg-hover) focus-visible:bg-(--bg-hover) ${
        linkable ? "cursor-pointer" : "cursor-default"
      }`}
    >
      {/* Type color dot: solid when unread, faded once read */}
      <span
        aria-hidden
        className={`mt-1.5 size-1.5 shrink-0 rounded-full bg-current ${config.color} ${
          unread ? "" : "opacity-25"
        }`}
      />

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-[13px] leading-snug ${
            unread
              ? "font-medium text-(--text-primary)"
              : "text-(--text-secondary)"
          }`}
        >
          {notification.message}
        </p>
        <p className="mt-0.5 flex items-center gap-3 truncate font-interface text-[11px] text-(--text-muted)">
          <span className={unread ? config.color : ""}>{config.label}</span>
          {project && <span className="truncate">{project.name}</span>}
        </p>
      </div>

      {/* Time by default; on desktop hover it swaps for the actions */}
      <div className="flex shrink-0 flex-col items-end gap-1 font-interface text-[11px] md:min-w-32 md:flex-row md:justify-end">
        <span className="tabular-nums text-(--text-muted) md:group-hover:hidden md:group-focus-within:hidden">
          {formatTimeAgo(notification.createdAt)}
        </span>
        <span className="flex gap-3 md:hidden md:group-hover:flex md:group-focus-within:flex">
          {unread && (
            <button onClick={act(onMarkRead)} className={ACTION}>
              Mark read
            </button>
          )}
          <button
            onClick={act(onDelete)}
            className={`${ACTION} hover:text-(--color-error)!`}
          >
            Delete
          </button>
        </span>
      </div>
    </div>
  );
}
