import { useEffect, useState } from "react";
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

const textButton =
  "text-(--text-muted) transition-colors hover:text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-40";

// Runs an async action and shows a toast on success / failure.
async function run(
  action: () => Promise<unknown>,
  errorMessage: string,
  successMessage?: string,
) {
  try {
    await action();
    if (successMessage) toast.success(successMessage);
  } catch {
    toast.error(errorMessage);
  }
}

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
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
    const load = tab === "all" ? fetchNotifications : fetchUnread;
    load().catch(() => toast.error("Failed to load notifications"));
  }, [tab, fetchNotifications, fetchUnread, reset]);

  return (
    // The page fills its parent: the header stays put, only the list scrolls.
    <div className="flex h-full min-h-0 w-full flex-col p-4 sm:p-6">
      <header className="shrink-0 border-b border-(--border-color)">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-bold uppercase tracking-wide text-(--text-primary) sm:text-2xl">
              Notifications
            </h1>

            <p className="mt-0.5 font-interface text-xs text-(--text-muted)">
              {unreadCount > 0
                ? `${unreadCount} unread`
                : "You're all caught up"}
            </p>
          </div>

          {notifications.length > 0 && (
            <div className="flex shrink-0 items-center gap-4 pt-1 font-interface text-xs font-medium">
              <button
                onClick={() =>
                  run(
                    markAllRead,
                    "Failed to mark notifications as read",
                    "All notifications marked as read",
                  )
                }
                disabled={unreadCount === 0}
                className={textButton}
              >
                Mark all read
              </button>
              <button
                onClick={() =>
                  run(
                    deleteAll,
                    "Failed to delete notifications",
                    "All notifications deleted",
                  )
                }
                className={`${textButton} hover:text-(--color-error)!`}
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <div
          role="tablist"
          className="mt-4 flex gap-5 font-interface text-xs font-medium"
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`-mb-px border-b-2 pb-2.5 transition-colors ${
                tab === t.key
                  ? "border-(--accent-color) text-(--text-primary)"
                  : "border-transparent text-(--text-muted) hover:text-(--text-primary)"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto pt-4">
        {isLoading && notifications.length === 0 ? (
          <Spinner className="py-24" />
        ) : (
          <NotificationsPanel
            notifications={notifications}
            onMarkRead={(id: number) =>
              run(() => markRead(id), "Failed to mark notification as read")
            }
            onDelete={(id: number) =>
              run(() => deleteOne(id), "Failed to delete notification")
            }
            onLoadMore={() =>
              run(
                tab === "all" ? loadMore : loadMoreUnread,
                "Failed to load more notifications",
              )
            }
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
