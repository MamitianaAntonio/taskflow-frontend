import type { BoardTask, Todo } from "../types/todo";

/** Normalizes a stored todo into the shape the task drawer renders. */
export function toBoardTask(todo: Todo): BoardTask {
  return {
    id: todo.id,
    label: todo.title,
    description: todo.description,
    status: todo.status || "todo",
    dueDate: todo.dueDate,
    priority: todo.priority || "medium",
    projectId: todo.projectId,
    subtasks: todo.subtasks ?? [],
    repeat: todo.repeat ?? "none",
  };
}
