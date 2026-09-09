import { create } from "zustand";
import {
  createTodo as createTodoService,
  deleteTodo as deleteTodoService,
  getAllTodo,
  updateTodo as updateTodoService,
} from "../services/todo";
import type { CreateTodoPayload, Todo, UpdateTodoPayload } from "../types/todo";
import { emitMutation } from "../utils/eventBus";

interface TodoState {
  todos: Todo[];
  isLoading: boolean;
  error: Error | null;

  fetchTodos: () => Promise<Todo[]>;
  addTodo: (data: CreateTodoPayload) => Promise<Todo>;
  updateTodo: (id: number, updates: UpdateTodoPayload) => Promise<Todo>;
  deleteTodo: (id: number) => Promise<void>;
}

const useTodoStore = create<TodoState>()((set) => ({
  todos: [],
  isLoading: false,
  error: null,

  fetchTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const todos = await getAllTodo();
      set({ todos, isLoading: false });
      return todos;
    } catch (error) {
      set({ error: error as Error, isLoading: false });
      throw error;
    }
  },

  addTodo: async (data) => {
    try {
      const todo = await createTodoService(data);
      set((state) => ({ todos: [...state.todos, todo] }));
      emitMutation();
      return todo;
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  updateTodo: async (id, updates) => {
    try {
      const updated = await updateTodoService(id, updates);
      set((state) => ({
        todos: state.todos.map((t) => (t.id === id ? updated : t)),
      }));
      emitMutation();
      return updated;
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  deleteTodo: async (id) => {
    try {
      await deleteTodoService(id);
      set((state) => ({ todos: state.todos.filter((t) => t.id !== id) }));
      emitMutation();
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },
}));

export default useTodoStore;

export const getTodoById = (id: number): Todo | undefined =>
  useTodoStore.getState().todos.find((t) => t.id === id);