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
import type { AppNotification, ReminderStage } from "../types/notification";

interface NotificationMeta {
  label: string;
  icon: IconDefinition;
  color: string;
  bg: string;
}

export const notificationTypeConfig: Record<string, NotificationMeta> = {
  todo_created: {
    label: "Task created",
    icon: faSquarePlus,
    color: "text-(--color-success)",
    bg: "bg-(--color-success-soft)",
  },
  todo_updated: {
    label: "Task updated",
    icon: faPen,
    color: "text-(--color-info)",
    bg: "bg-(--color-info-soft)",
  },
  todo_deleted: {
    label: "Task deleted",
    icon: faTrash,
    color: "text-(--color-error)",
    bg: "bg-(--color-error-soft)",
  },
  todo_due_soon: {
    label: "Due soon",
    icon: faClock,
    color: "text-(--color-warning)",
    bg: "bg-(--color-warning-soft)",
  },
  project_created: {
    label: "Project created",
    icon: faFolderPlus,
    color: "text-(--color-success)",
    bg: "bg-(--color-success-soft)",
  },
  project_updated: {
    label: "Project updated",
    icon: faFolderOpen,
    color: "text-(--color-info)",
    bg: "bg-(--color-info-soft)",
  },
  project_deleted: {
    label: "Project deleted",
    icon: faFolderMinus,
    color: "text-(--color-error)",
    bg: "bg-(--color-error-soft)",
  },
};

export const fallbackNotificationConfig: NotificationMeta = {
  label: "Notification",
  icon: faClock,
  color: "text-(--text-secondary)",
  bg: "bg-(--bg-tertiary)",
};

export const reminderStageLabels: Record<ReminderStage, string> = {
  "24h": "Due tomorrow",
  "30min": "Due soon",
  overdue: "Overdue",
};

export function getNotificationConfig(
  notification: Pick<AppNotification, "type" | "reminderStage">,
): NotificationMeta {
  const base = notificationTypeConfig[notification.type] ?? fallbackNotificationConfig;
  if (
    notification.type === "todo_due_soon" &&
    notification.reminderStage &&
    reminderStageLabels[notification.reminderStage as ReminderStage]
  ) {
    return {
      ...base,
      label: reminderStageLabels[notification.reminderStage as ReminderStage],
    };
  }
  return base;
}