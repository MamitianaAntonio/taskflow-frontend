import axiosClient from "../api/axios";

interface Todo {
  id: number;
  title: string;
  status: "todo" | "doing" | "done";
  dueDate: string | null;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

type CreateTodoPayload = {
  title: string;
  status?: "todo" | "doing" | "done";
  dueDate?: string | null;
  priority?: string;
};

type UpdateTodoPayload = {
  title?: string;
  status?: "todo" | "doing" | "done";
  dueDate?: string | null;
  priority?: string;
};

// get all todo on server
export const getAllTodo = async (): Promise<Todo[]> => {
  const response = await axiosClient.get<{ todos: Todo[] }>("/api/todos");
  return response.data.todos;
};

// create todo
export const createTodo = async (todo: CreateTodoPayload): Promise<Todo> => {
  const response = await axiosClient.post<{ todo: Todo }>("/api/todos", todo);
  return response.data.todo;
};

// update a todo
export const updateTodo = async (
  id: number,
  todo: UpdateTodoPayload,
): Promise<Todo> => {
  const response = await axiosClient.put<{ updated: Todo }>(
    `/api/todos/${id}`,
    todo,
  );
  return response.data.updated;
};
