import axiosClient from "../api/axios";
import type { CreateTodoPayload, Todo, UpdateTodoPayload } from "../types/todo";

export const getAllTodo = (): Promise<Todo[]> =>
  axiosClient.get<{ todos: Todo[] }>("/api/todos").then((r) => r.data.todos);

export const createTodo = (data: CreateTodoPayload): Promise<Todo> =>
  axiosClient.post<{ todo: Todo }>("/api/todos", data).then((r) => r.data.todo);

export const updateTodo = (id: number, data: UpdateTodoPayload): Promise<Todo> =>
  axiosClient.put<{ todo: Todo }>(`/api/todos/${id}`, data).then((r) => r.data.todo);

export const deleteTodo = async (id: number): Promise<void> => {
  await axiosClient.delete(`/api/todos/${id}`);
};