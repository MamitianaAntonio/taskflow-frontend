export type TodoStatus = "todo" | "doing" | "done";

export type TodoPriority = "low" | "medium" | "high";

export interface Todo {
  id: number;
  title: string;
  status: TodoStatus;
  dueDate: string | null;
  priority: TodoPriority;
  projectId?: number | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoPayload {
  title: string;
  status?: TodoStatus;
  dueDate?: string | null;
  priority?: TodoPriority;
  projectId?: number | null;
}

export interface UpdateTodoPayload {
  title?: string;
  status?: TodoStatus;
  dueDate?: string | null;
  priority?: TodoPriority;
  projectId?: number | null;
}

export interface BoardTask {
  id: number;
  label: string;
  status: TodoStatus;
  dueDate: string | null;
  priority: TodoPriority;
  updatedAt?: string;
  overdue?: boolean;
}

export interface KanbanTask {
  id: number;
  title: string;
  status: TodoStatus;
  dueDate: string | null;
  priority: TodoPriority;
  updatedAt?: string;
}

export type DashboardTask = Todo & {
  completed: boolean;
  completedAt: string | null;
  overdue?: boolean;
};