import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBell,
  faCheckDouble,
} from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import useNotificationStore, {
  BELL_PAGE_SIZE,
  useBellNotificationStore,
} from "../../stores/notificationStore";
import { useProjectStore } from "../../stores/projectStore";
import useTodoStore from "../../stores/todoStore";
import NotificationsPanel from "./NotificationsPanel";
import Spinner from "../ui/Spinner";
import { useUnreadNotifications } from "../../hooks/useUnreadNotifications";
import { ROUTES } from "../../constants/routes";

export default function NotificationBell() {
  const navigate = useNavigate();
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const fetchUnreadCount = useNotificationStore(
    (state) => state.fetchUnreadCount,
  );
  const {
    notifications,
    total,
    isLoading,
    fetchNotifications,
    markRead,
    markAllRead,
    deleteOne,
    reset,
  } = useBellNotificationStore();
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

    const { todos, isLoading: todosLoading } = useTodoStore.getState();
    const { projects, isLoading: projectsLoading } = useProjectStore.getState();
    if (todos.length === 0 && !todosLoading) fetchTodos().catch(() => {});
    if (projects.length === 0 && !projectsLoading)
      fetchProjects().catch(() => {});

    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
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

  const refreshBadge = () => fetchUnreadCount().catch(() => {});

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      refreshBadge();
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkRead = async (id: number) => {
    try {
      await markRead(id);
      refreshBadge();
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteOne(id);
      refreshBadge();
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  const handleViewAll = () => {
    setOpen(false);
    navigate(ROUTES.notifications);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-(--text-muted) transition-all hover:bg-(--bg-tertiary) hover:text-(--text-primary)"
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-2 top-[4.75rem] z-50 max-h-[calc(100dvh-5.5rem)] overflow-hidden rounded-2xl border border-(--border-color) bg-(--bg-primary) shadow-2xl shadow-(--shadow) md:absolute md:inset-x-auto md:right-0 md:top-full md:mt-9 md:max-h-none md:w-[22rem] md:origin-top-right"
          >
            <div className="flex items-center justify-between gap-2 border-b border-(--border-color) bg-(--bg-secondary) px-4 py-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-(--text-primary)">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-(--accent-soft) text-(--accent-strong)">
                  <FontAwesomeIcon icon={faBell} size="xs" />
                </span>
                Notifications
                {unreadCount > 0 && (
                  <span className="rounded-full bg-(--accent-color) px-1.5 py-0.5 font-interface text-[10px] font-bold text-(--text-white) tabular-nums">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </p>
              {unreadCount > 0 ? (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1.5 rounded-md px-1.5 py-1 font-interface text-xs font-medium text-(--text-muted) transition-colors hover:bg-(--bg-tertiary) hover:text-(--color-success)"
                >
                  <FontAwesomeIcon icon={faCheckDouble} size="xs" />
                  Mark all read
                </button>
              ) : (
                <span className="font-interface text-xs font-medium text-(--color-success)">
                  All caught up
                </span>
              )}
            </div>

            <div className="min-h-24 overflow-y-auto">
              {isLoading && notifications.length === 0 ? (
                <Spinner className="py-12" />
              ) : (
                <NotificationsPanel
                  notifications={recent}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDelete}
                  listClassName="max-h-[calc(100dvh-16rem)] overflow-y-auto md:max-h-80 xl:max-h-[26rem]"
                />
              )}
            </div>

            <div className="border-t border-(--border-color) bg-(--bg-secondary) p-2">
              <button
                onClick={handleViewAll}
                className="group flex w-full items-center justify-between rounded-xl bg-(--accent-color) px-3.5 py-2 text-sm font-semibold text-(--text-white) shadow-(--shadow-pink) transition-all hover:bg-(--accent-strong) active:scale-[0.99]"
              >
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faBell} size="xs" className="opacity-80" />
                  View all notifications
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-2 py-0.5 font-interface text-[10px] font-bold tabular-nums">
                  {total > BELL_PAGE_SIZE ? `${total}+` : total}
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    size="2xs"
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}