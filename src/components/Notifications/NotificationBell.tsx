import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import useNotificationStore from "../../stores/notificationStore";
import { useProjectStore } from "../../stores/projectStore";
import useTodoStore from "../../stores/todoStore";
import NotificationsPanel from "./NotificationsPanel";
import Spinner from "../ui/Spinner";
import { useUnreadNotifications } from "../../hooks/useUnreadNotifications";
import { ROUTES } from "../../constants/routes";

const BELL_PAGE_SIZE = 10;

export default function NotificationBell() {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    total,
    isLoading,
    fetchNotifications,
    markRead,
    markAllRead,
    deleteOne,
    reset,
  } = useNotificationStore();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchTodos = useTodoStore((state) => state.fetchTodos);
  const fetchProjects = useProjectStore((state) => state.fetchAll);

  const recent = notifications.slice(0, BELL_PAGE_SIZE);

  useUnreadNotifications();

  useEffect(() => {
    if (!open) return;

    reset();
    fetchNotifications().catch(() => {});
    fetchTodos().catch(() => {});
    fetchProjects().catch(() => {});

    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, fetchNotifications, fetchTodos, fetchProjects, reset]);

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-(--text-muted) transition-colors hover:bg-(--bg-tertiary) hover:text-(--text-primary)"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <FontAwesomeIcon icon={faBell} />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-(--color-error) px-1 font-interface text-[10px] font-bold text-(--text-white)">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-x-2 top-[5rem] z-50 max-h-[calc(100dvh-5.5rem)] overflow-hidden rounded-xl border border-(--border-color) bg-(--bg-primary) shadow-lg shadow-(--shadow) md:absolute md:inset-x-auto md:right-0 md:top-full md:mt-8 md:max-h-none md:w-[22rem]">
          <div className="flex items-center justify-between border-b border-(--border-color) bg-(--bg-secondary) px-4 py-2.5">
            <p className="text-sm font-semibold text-(--text-primary)">
              Notifications
            </p>
            {unreadCount > 0 ? (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 text-xs font-medium text-(--text-muted) transition-colors hover:text-(--color-success)"
              >
                <FontAwesomeIcon icon={faCheckDouble} />
                Mark all read
              </button>
            ) : (
              <span className="text-xs font-medium text-(--color-success)">
                All read
              </span>
            )}
          </div>

          <div className="min-h-24 overflow-y-auto">
            {isLoading && notifications.length === 0 ? (
              <Spinner className="py-10" />
            ) : (
              <NotificationsPanel
                notifications={recent}
                onMarkRead={markRead}
                onDelete={deleteOne}
                listClassName="max-h-[calc(100dvh-16rem)] overflow-y-auto md:max-h-96 xl:max-h-[30rem]"
              />
            )}
          </div>

          <div className="border-t border-(--border-color) bg-(--bg-secondary) p-2">
            <button
              onClick={() => {
                setOpen(false);
                navigate(ROUTES.notifications);
              }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-center text-sm font-medium text-(--accent-color) transition-colors hover:bg-(--accent-muted)"
            >
              <span>View all notifications</span>
              <span className="rounded-full bg-(--accent-soft) px-2 py-0.5 font-interface text-[10px] font-bold text-(--accent-strong) tabular-nums">
                {total > BELL_PAGE_SIZE ? `${total}+` : total}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
