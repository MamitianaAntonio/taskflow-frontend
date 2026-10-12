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
  updateTodo: (id: string, updates: UpdateTodoPayload) => Promise<Todo>;
  deleteTodo: (id: string) => Promise<void>;

  addSubtask: (parentId: string, title: string) => Promise<Todo>;
  updateSubtask: (
    parentId: string,
    id: string,
    updates: UpdateTodoPayload,
  ) => Promise<Todo>;
  deleteSubtask: (parentId: string, id: string) => Promise<void>;
}

// Replace a single root todo matched by id.
const mapTodo = (todos: Todo[], id: string, patch: Partial<Todo>): Todo[] =>
  todos.map((t) => (t.id === id ? { ...t, ...patch } : t));

// Replace a subtask nested inside its parent root todo.
const mapSubtask = (
  todos: Todo[],
  parentId: string,
  subtaskId: string,
  patch: Partial<Todo>,
): Todo[] =>
  todos.map((t) =>
    t.id === parentId
      ? {
          ...t,
          subtasks: (t.subtasks ?? []).map((s) =>
            s.id === subtaskId ? { ...s, ...patch } : s,
          ),
        }
      : t,
  );

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
      set((state) => ({ todos: mapTodo(state.todos, id, updated) }));
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

  addSubtask: async (parentId, title) => {
    try {
      const subtask = await createTodoService({ title, parentId });
      set((state) => ({
        todos: state.todos.map((t) =>
          t.id === parentId
            ? { ...t, subtasks: [...(t.subtasks ?? []), subtask] }
            : t,
        ),
      }));
      emitMutation();
      return subtask;
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  updateSubtask: async (parentId, id, updates) => {
    try {
      const updated = await updateTodoService(id, updates);
      set((state) => ({
        todos: mapSubtask(state.todos, parentId, id, updated),
      }));
      emitMutation();
      return updated;
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  deleteSubtask: async (parentId, id) => {
    try {
      await deleteTodoService(id);
      set((state) => ({
        todos: state.todos.map((t) =>
          t.id === parentId
            ? {
                ...t,
                subtasks: (t.subtasks ?? []).filter((s) => s.id !== id),
              }
            : t,
        ),
      }));
      emitMutation();
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },
}));

export default useTodoStore;

export const getTodoById = (id: string): Todo | undefined =>
  useTodoStore.getState().todos.find((t) => t.id === id);
