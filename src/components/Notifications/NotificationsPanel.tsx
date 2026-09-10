import { AnimatePresence, motion } from "framer-motion";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
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
  listClassName = "max-h-96 overflow-y-auto xl:max-h-[30rem]",
}: NotificationsPanelProps) {
  if (notifications.length === 0) {
    return <EmptyState title={emptyTitle} text={emptyText} />;
  }

  return (
    <div className={listClassName}>
      <AnimatePresence initial={false}>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
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

      {hasMore && (
        <div className="border-t border-(--border-color)">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="flex w-full items-center justify-center gap-2 py-2.5 font-interface text-xs font-medium text-(--accent-color) transition-colors hover:bg-(--bg-hover) disabled:opacity-50"
          >
            {isLoadingMore ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                Loading...
              </>
            ) : (
              "Load more"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
