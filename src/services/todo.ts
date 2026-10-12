import axiosClient from "../api/axios";
import type {
  ChecklistItem,
  CreateTodoPayload,
  Todo,
  UpdateTodoPayload,
} from "../types/todo";

export const getAllTodo = (): Promise<Todo[]> =>
  axiosClient.get<{ todos: Todo[] }>("/api/todos").then((r) => r.data.todos);

export const createTodo = (data: CreateTodoPayload): Promise<Todo> =>
  axiosClient.post<{ todo: Todo }>("/api/todos", data).then((r) => r.data.todo);

export const updateTodo = (
  id: string,
  data: UpdateTodoPayload,
): Promise<Todo> =>
  axiosClient
    .put<{ todo: Todo }>(`/api/todos/${id}`, data)
    .then((r) => r.data.todo);

export const deleteTodo = async (id: string): Promise<void> => {
  await axiosClient.delete(`/api/todos/${id}`);
};

export const addChecklistItem = (
  todoId: string,
  text: string,
): Promise<ChecklistItem> =>
  axiosClient
    .post<{ item: ChecklistItem }>(`/api/todos/${todoId}/checklist`, { text })
    .then((r) => r.data.item);

export const updateChecklistItem = (
  todoId: string,
  itemId: string,
  data: { text?: string; done?: boolean },
): Promise<ChecklistItem> =>
  axiosClient
    .patch<{
      item: ChecklistItem;
    }>(`/api/todos/${todoId}/checklist/${itemId}`, data)
    .then((r) => r.data.item);

export const deleteChecklistItem = async (
  todoId: string,
  itemId: string,
): Promise<void> => {
  await axiosClient.delete(`/api/todos/${todoId}/checklist/${itemId}`);
};
