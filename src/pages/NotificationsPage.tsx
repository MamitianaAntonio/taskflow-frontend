import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckDouble,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import useNotificationStore from "../stores/notificationStore";
import { useProjectStore } from "../stores/projectStore";
import useTodoStore from "../stores/todoStore";
import NotificationsPanel from "../components/Notifications/NotificationsPanel";
import Spinner from "../components/ui/Spinner";

type NotificationTab = "all" | "unread";

const TABS: { key: NotificationTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
];

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    total,
    hasMore,
    isLoading,
    isLoadingMore,
    fetchNotifications,
    fetchUnread,
    loadMore,
    loadMoreUnread,
    markRead,
    markAllRead,
    deleteOne,
    deleteAll,
    reset,
  } = useNotificationStore();
  const [tab, setTab] = useState<NotificationTab>("all");

  const fetchTodos = useTodoStore((state) => state.fetchTodos);
  const fetchProjects = useProjectStore((state) => state.fetchAll);

  useEffect(() => {
    fetchTodos().catch(() => {});
    fetchProjects().catch(() => {});
  }, [fetchTodos, fetchProjects]);

  useEffect(() => {
    reset();
    if (tab === "all") {
      fetchNotifications().catch(() => {
        toast.error("Failed to load notifications");
      });
    } else {
      fetchUnread().catch(() => {
        toast.error("Failed to load notifications");
      });
    }
  }, [tab, fetchNotifications, fetchUnread, reset]);

  const handleLoadMore = async () => {
    try {
      if (tab === "all") {
        await loadMore();
      } else {
        await loadMoreUnread();
      }
    } catch {
      toast.error("Failed to load more notifications");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark notifications as read");
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAll();
      toast.success("All notifications deleted");
    } catch {
      toast.error("Failed to delete notifications");
    }
  };

  const handleMarkRead = async (id: number) => {
    try {
      await markRead(id);
    } catch {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteOne(id);
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  const activeCount = tab === "unread" ? unreadCount : total;

  return (
    <div className="mx-auto flex flex-col gap-5 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wide text-(--text-primary) sm:text-2xl">
            Notifications
          </h1>
          <p className="mt-1.5 font-interface text-sm text-(--text-muted)">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "You're all caught up"}
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-1.5 rounded-lg border border-(--border-color) px-3 py-1.5 text-xs font-semibold text-(--text-muted) transition-colors hover:border-(--color-success) hover:bg-(--color-success-soft) hover:text-(--color-success) disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faCheckDouble} size="xs" />
              Mark all read
            </button>
            <button
              onClick={handleDeleteAll}
              className="flex items-center gap-1.5 rounded-lg border border-(--border-color) px-3 py-1.5 text-xs font-semibold text-(--text-muted) transition-colors hover:border-(--color-error) hover:bg-(--color-error-soft) hover:text-(--color-error)"
            >
              <FontAwesomeIcon icon={faTrashCan} size="xs" />
              Delete all
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col overflow-hidden rounded-xl border border-(--border-color) bg-(--bg-primary) shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-(--border-color) bg-(--bg-secondary) px-3 py-2">
          <div className="flex rounded-lg bg-(--bg-tertiary) p-0.5">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  tab === t.key
                    ? "bg-(--bg-primary) text-(--text-primary) shadow-sm"
                    : "text-(--text-muted) hover:text-(--text-primary)"
                }`}
              >
                {t.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 font-interface text-[10px] font-bold tabular-nums transition-colors ${
                    tab === t.key
                      ? "bg-(--accent-soft) text-(--accent-strong)"
                      : "bg-(--bg-hover) text-(--text-muted)"
                  }`}
                >
                  {t.key === "unread" ? unreadCount : total}
                </span>
              </button>
            ))}
          </div>
          {activeCount > 0 && (
            <span className="hidden rounded-full border border-(--border-color) px-2 py-0.5 font-interface text-[10px] font-medium text-(--text-muted) sm:block">
              Showing {notifications.length} of {activeCount}
            </span>
          )}
        </div>

        {isLoading && notifications.length === 0 ? (
          <Spinner className="py-24" />
        ) : (
          <NotificationsPanel
            notifications={notifications}
            onMarkRead={handleMarkRead}
            onDelete={handleDelete}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            compact
            emptyTitle={
              tab === "unread"
                ? "No unread notifications"
                : "No notifications yet"
            }
            emptyText={
              tab === "unread"
                ? "Everything is read. Nice work."
                : "Things you do in TaskFlow will show up here."
            }
            listClassName="max-h-[36rem] overflow-y-auto p-0"
          />
        )}
      </div>
    </div>
  );
}