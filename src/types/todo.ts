export type TodoStatus = "todo" | "doing" | "done";

export type TodoPriority = "low" | "medium" | "high";

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
  position: number;
  createdAt?: string;
}

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
  checklist?: ChecklistItem[];
  completedAt?: string | null;
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
}

export interface UpdateTodoPayload {
  title?: string;
  description?: string;
  status?: TodoStatus;
  dueDate?: string | null;
  priority?: TodoPriority;
  projectId?: string | null;
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
  subtasks?: Todo[];
  checklist?: ChecklistItem[];
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
  checklist?: ChecklistItem[];
}

export type DashboardTask = Todo & {
  completed: boolean;
  completedAt: string | null;
  overdue?: boolean;
};
