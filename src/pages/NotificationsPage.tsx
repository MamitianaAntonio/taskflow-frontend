import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { notify } from "../utils/toast";
import { faInbox, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import useNotificationStore from "../stores/notificationStore";
import { useProjectStore } from "../stores/projectStore";
import useTodoStore from "../stores/todoStore";
import NotificationItem from "../components/Notifications/NotificationItem";
import ChipTabs, { type ChipTabItem } from "../components/ui/ChipTabs";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import Spinner from "../components/ui/Spinner";
import type { AppNotification } from "../types/notification";

type NotificationTab = "all" | "unread";

const DAY = 86_400_000;

function dayLabel(iso: string) {
  const date = new Date(iso);
  const startOfToday = new Date().setHours(0, 0, 0, 0);
  const diff = Math.round(
    (startOfToday - new Date(date).setHours(0, 0, 0, 0)) / DAY,
  );

  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

// Groups consecutive notifications that share the same day.
function groupByDay(items: AppNotification[]) {
  const groups: { label: string; items: AppNotification[] }[] = [];
  for (const n of items) {
    const label = dayLabel(n.createdAt);
    const last = groups[groups.length - 1];
    if (last?.label === label) last.items.push(n);
    else groups.push({ label, items: [n] });
  }
  return groups;
}

const TABS: ChipTabItem<NotificationTab>[] = [
  { id: "all", label: "All", icon: faInbox },
  { id: "unread", label: "Unread", icon: faEnvelope },
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
    if (successMessage) notify.success(successMessage);
  } catch {
    notify.error(errorMessage);
  }
}

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
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
    load().catch(() => notify.error("Failed to load notifications"));
  }, [tab, fetchNotifications, fetchUnread, reset]);

  const retry = () => {
    (tab === "all" ? fetchNotifications : fetchUnread)().catch(() =>
      notify.error("Failed to load notifications"),
    );
  };

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

        <ChipTabs
          items={TABS}
          value={tab}
          onChange={setTab}
          role="tablist"
          ariaLabel="Notifications filter"
          className="mt-4 pb-3"
        />
      </header>

      <div
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        className="min-h-0 flex-1 overflow-y-auto pt-4"
      >
        {isLoading && notifications.length === 0 ? (
          <Spinner className="py-24" />
        ) : error && notifications.length === 0 ? (
          <ErrorState
            message="Your notifications could not be loaded."
            action={
              <Button variant="outline" size="small" onClick={retry}>
                Retry
              </Button>
            }
          />
        ) : notifications.length === 0 ? (
          <EmptyState
            title={
              tab === "unread"
                ? "No unread notifications"
                : "No notifications yet"
            }
            text={
              tab === "unread"
                ? "Everything is read. Nice work."
                : "Things you do in TaskFlow will show up here."
            }
          />
        ) : (
          <div className="flex flex-col gap-6 p-2">
            {groupByDay(notifications).map((group) => (
              <section key={group.label}>
                <h2 className="mb-1 flex items-center gap-3 px-2 font-interface text-xs font-medium text-(--text-muted)">
                  {group.label}
                  <span className="h-px flex-1 bg-(--border-color)" />
                </h2>

                <div className="divide-y divide-(--border-color)/60">
                  <AnimatePresence initial={false}>
                    {group.items.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <NotificationItem
                          notification={notification}
                          onMarkRead={(id: string) =>
                            run(
                              () => markRead(id),
                              "Failed to mark notification as read",
                            )
                          }
                          onDelete={(id: string) =>
                            run(
                              () => deleteOne(id),
                              "Failed to delete notification",
                            )
                          }
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            ))}

            {hasMore && (
              <button
                onClick={() =>
                  run(
                    tab === "all" ? loadMore : loadMoreUnread,
                    "Failed to load more notifications",
                  )
                }
                disabled={isLoadingMore}
                className="self-center py-1 font-interface text-xs font-medium text-(--text-muted) transition-colors
                hover:text-(--text-primary) disabled:opacity-50"
              >
                {isLoadingMore ? "Loading..." : "Load more"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
