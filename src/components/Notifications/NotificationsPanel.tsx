import NotificationItem from "./NotificationItem";
import EmptyState from "../ui/EmptyState";
import type { AppNotification } from "../../types/notification";

interface NotificationsPanelProps {
  notifications: AppNotification[];
  onMarkRead?: (id: number) => Promise<void> | void;
  onDelete?: (id: number) => Promise<void> | void;
  emptyTitle?: string;
  emptyText?: string;
  listClassName?: string;
}

export default function NotificationsPanel({
  notifications,
  onMarkRead,
  onDelete,
  emptyTitle = "No notifications yet",
  emptyText = "Things you do in TaskFlow will show up here.",
  listClassName = "max-h-96 overflow-y-auto xl:max-h-[30rem]",
}: NotificationsPanelProps) {
  if (notifications.length === 0) {
    return <EmptyState title={emptyTitle} text={emptyText} />;
  }

  return (
    <ul className={listClassName}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkRead={onMarkRead}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}