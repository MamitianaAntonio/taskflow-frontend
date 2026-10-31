export type TodoStatus = "todo" | "doing" | "done";

export type TodoPriority = "low" | "medium" | "high";

export type RepeatRule = "none" | "daily" | "weekly" | "monthly" | "yearly";

export interface Todo {
  id: string;
  title: string;
  description?: string | null;
  status: TodoStatus;
  dueDate: string | null;
  priority: TodoPriority;
  projectId?: string | null;
  parentId?: string | null;
  subtasks?: Todo[];
  completedAt?: string | null;
  repeat?: RepeatRule;
  repeatAnchorDay?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoPayload {
  title: string;
  description?: string;
  status?: TodoStatus;
  dueDate?: string | null;
  priority?: TodoPriority;
  projectId?: string | null;
  parentId?: string | null;
  repeat?: RepeatRule;
}

export interface UpdateTodoPayload {
  title?: string;
  description?: string;
  status?: TodoStatus;
  dueDate?: string | null;
  priority?: TodoPriority;
  projectId?: string | null;
  repeat?: RepeatRule;
}

export interface BoardTask {
  id: string;
  label: string;
  description?: string | null;
  status: TodoStatus;
  dueDate: string | null;
  priority: TodoPriority;
  updatedAt?: string;
  overdue?: boolean;
  projectId?: string | null;
  subtasks?: Todo[];
  repeat?: RepeatRule;
}

export interface KanbanTask {
  id: string;
  title: string;
  description?: string | null;
  status: TodoStatus;
  dueDate: string | null;
  priority: TodoPriority;
  updatedAt?: string;
  subtasks?: Todo[];
  repeat?: RepeatRule;
}

export type DashboardTask = Todo & {
  completed: boolean;
  completedAt: string | null;
  overdue?: boolean;
};
