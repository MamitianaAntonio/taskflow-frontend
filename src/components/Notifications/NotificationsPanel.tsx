import { AnimatePresence, motion } from "framer-motion";
import NotificationItem from "./NotificationItem";
import EmptyState from "../ui/EmptyState";
import type { AppNotification } from "../../types/notification";

interface NotificationsPanelProps {
  notifications: AppNotification[];
  onMarkRead?: (id: number) => Promise<void> | void;
  onDelete?: (id: number) => Promise<void> | void;
  onLoadMore?: () => Promise<void> | void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  emptyTitle?: string;
  emptyText?: string;
}

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

export default function NotificationsPanel({
  notifications,
  onMarkRead,
  onDelete,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  emptyTitle = "No notifications yet",
  emptyText = "Things you do in TaskFlow will show up here.",
}: NotificationsPanelProps) {
  if (notifications.length === 0) {
    return <EmptyState title={emptyTitle} text={emptyText} />;
  }

  return (
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
                    onMarkRead={onMarkRead}
                    onDelete={onDelete}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      ))}

      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={isLoadingMore}
          className="self-center py-1 font-interface text-xs font-medium text-(--text-muted) transition-colors
           hover:text-(--text-primary) disabled:opacity-50"
        >
          {isLoadingMore ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}
