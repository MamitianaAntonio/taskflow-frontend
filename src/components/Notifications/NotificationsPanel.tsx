import { AnimatePresence, motion } from "framer-motion";
import { faChevronDown, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotificationItem from "./NotificationItem";
import EmptyState from "../ui/EmptyState";
import type { AppNotification } from "../../types/notification";

interface NotificationsPanelProps {
  notifications: AppNotification[];
  onMarkRead?: (id: number) => Promise<void> | void;
  onDelete?: (id: number) => Promise<void> | void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  emptyTitle?: string;
  emptyText?: string;
  listClassName?: string;
  compact?: boolean;
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
  listClassName = "max-h-96 overflow-y-auto xl:max-h-[30rem] p-1",
  compact = false,
}: NotificationsPanelProps) {
  if (notifications.length === 0) {
    return <EmptyState title={emptyTitle} text={emptyText} />;
  }

  return (
    <div className={`divide-y divide-(--border-color) ${listClassName}`}>
      <AnimatePresence initial={false}>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <NotificationItem
              notification={notification}
              onMarkRead={onMarkRead}
              onDelete={onDelete}
              compact={compact}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={isLoadingMore}
          className="flex w-full items-center justify-center gap-2 py-3 font-interface text-xs font-semibold text-(--accent-color) transition-colors hover:bg-(--bg-hover) disabled:opacity-50"
        >
          {isLoadingMore ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faChevronDown} size="xs" />
              Load more
            </>
          )}
        </button>
      )}
    </div>
  );
}