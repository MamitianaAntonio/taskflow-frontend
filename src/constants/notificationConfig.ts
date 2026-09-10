import {
  faSquarePlus,
  faPen,
  faTrash,
  faClock,
  faFolderPlus,
  faFolderOpen,
  faFolderMinus,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { AppNotification, NotificationType, ReminderStage } from "../types/notification";

interface NotificationMeta {
  label: string;
  icon: IconDefinition;
  color: string;
  bg: string;
  accent: string;
}

export const notificationTypeConfig: Record<NotificationType, NotificationMeta> = {
  todo_created: {
    label: "Task created",
    icon: faSquarePlus,
    color: "text-(--color-success)",
    bg: "bg-(--color-success-soft)",
    accent: "border-l-(--color-success)",
  },
  todo_updated: {
    label: "Task updated",
    icon: faPen,
    color: "text-(--color-info)",
    bg: "bg-(--color-info-soft)",
    accent: "border-l-(--color-info)",
  },
  todo_deleted: {
    label: "Task deleted",
    icon: faTrash,
    color: "text-(--color-error)",
    bg: "bg-(--color-error-soft)",
    accent: "border-l-(--color-error)",
  },
  todo_due_soon: {
    label: "Due soon",
    icon: faClock,
    color: "text-(--color-warning)",
    bg: "bg-(--color-warning-soft)",
    accent: "border-l-(--color-warning)",
  },
  project_created: {
    label: "Project created",
    icon: faFolderPlus,
    color: "text-(--color-success)",
    bg: "bg-(--color-success-soft)",
    accent: "border-l-(--color-success)",
  },
  project_updated: {
    label: "Project updated",
    icon: faFolderOpen,
    color: "text-(--color-info)",
    bg: "bg-(--color-info-soft)",
    accent: "border-l-(--color-info)",
  },
  project_deleted: {
    label: "Project deleted",
    icon: faFolderMinus,
    color: "text-(--color-error)",
    bg: "bg-(--color-error-soft)",
    accent: "border-l-(--color-error)",
  },
};

export const fallbackNotificationConfig: NotificationMeta = {
  label: "Notification",
  icon: faClock,
  color: "text-(--text-secondary)",
  bg: "bg-(--bg-tertiary)",
  accent: "border-l-(--text-muted)",
};

export const reminderStageLabels: Record<ReminderStage, string> = {
  "24h": "Due in 24h",
  "30min": "Due in 30 min",
  overdue: "Overdue",
};

export function getNotificationConfig(
  notification: Pick<AppNotification, "type" | "reminderStage">,
): NotificationMeta {
  const base = notificationTypeConfig[notification.type] ?? fallbackNotificationConfig;
  if (
    notification.type === "todo_due_soon" &&
    notification.reminderStage &&
    reminderStageLabels[notification.reminderStage]
  ) {
    return {
      ...base,
      label: reminderStageLabels[notification.reminderStage],
    };
  }
  return base;
}