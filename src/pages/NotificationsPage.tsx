import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCheckDouble,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import useNotificationStore from "../stores/notificationStore";
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

  return (
    <div className="mx-auto flex flex-col gap-4 p-4 sm:gap-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="tracking-tight">
          <h1 className="text-xl font-bold uppercase tracking-wide text-(--text-primary) sm:text-2xl">
            Notifications
          </h1>
          <p className="mt-1.5 flex items-center gap-2 font-interface text-sm text-(--text-muted)">
            <FontAwesomeIcon icon={faBell} className="text-xs" />
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
              className="flex items-center gap-1.5 rounded-lg border border-(--border-color) px-3 py-1.5 text-xs font-semibold text-(--text-muted) transition-colors hover:border-(--color-success) hover:text-(--color-success) disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faCheckDouble} />
              Mark all read
            </button>
            <button
              onClick={handleDeleteAll}
              className="flex items-center gap-1.5 rounded-lg border border-(--border-color) px-3 py-1.5 text-xs font-semibold text-(--text-muted) transition-colors hover:border-(--color-error) hover:text-(--color-error)"
            >
              <FontAwesomeIcon icon={faTrashCan} />
              Delete all
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col overflow-hidden rounded-xl border border-(--border-color) bg-(--bg-primary) shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-(--border-color) bg-(--bg-secondary) px-3 py-2">
          <div className="flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  tab === t.key
                    ? "bg-(--accent-soft) text-(--accent-strong)"
                    : "text-(--text-muted) hover:text-(--text-primary)"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <span className="rounded-full border border-(--border-color) px-2 py-0.5 font-interface text-[10px] font-medium text-(--text-muted)">
            {tab === "unread" ? `${unreadCount} / ${total}` : `${notifications.length} / ${total}`}
          </span>
        </div>

        {isLoading && notifications.length === 0 ? (
          <Spinner className="py-16" />
        ) : (
          <NotificationsPanel
            notifications={notifications}
            onMarkRead={handleMarkRead}
            onDelete={handleDelete}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
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
          />
        )}
      </div>
    </div>
  );
}
