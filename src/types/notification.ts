export type NotificationType =
  | "todo_created"
  | "todo_updated"
  | "todo_deleted"
  | "todo_due_soon"
  | "project_created"
  | "project_updated"
  | "project_deleted";

export type ReminderStage = "24h" | "30min" | "overdue";

export interface AppNotification {
  id: number;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: string;
  todoId?: number | null;
  reminderStage?: ReminderStage | null;
}