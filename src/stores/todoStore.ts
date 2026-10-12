import { create } from "zustand";
import {
  addChecklistItem as addChecklistItemService,
  createTodo as createTodoService,
  deleteChecklistItem as deleteChecklistItemService,
  deleteTodo as deleteTodoService,
  getAllTodo,
  updateChecklistItem as updateChecklistItemService,
  updateTodo as updateTodoService,
} from "../services/todo";
import type {
  ChecklistItem,
  CreateTodoPayload,
  Todo,
  UpdateTodoPayload,
} from "../types/todo";
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

  addChecklistItem: (todoId: string, text: string) => Promise<ChecklistItem>;
  updateChecklistItem: (
    todoId: string,
    itemId: string,
    updates: { text?: string; done?: boolean },
  ) => Promise<ChecklistItem>;
  deleteChecklistItem: (todoId: string, itemId: string) => Promise<void>;
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

  addChecklistItem: async (todoId, text) => {
    try {
      const item = await addChecklistItemService(todoId, text);
      set((state) => ({
        todos: state.todos.map((t) =>
          t.id === todoId
            ? { ...t, checklist: [...(t.checklist ?? []), item] }
            : t,
        ),
      }));
      emitMutation();
      return item;
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  updateChecklistItem: async (todoId, itemId, updates) => {
    try {
      const updated = await updateChecklistItemService(todoId, itemId, updates);
      set((state) => ({
        todos: state.todos.map((t) =>
          t.id === todoId
            ? {
                ...t,
                checklist: (t.checklist ?? []).map((c) =>
                  c.id === itemId ? updated : c,
                ),
              }
            : t,
        ),
      }));
      emitMutation();
      return updated;
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  deleteChecklistItem: async (todoId, itemId) => {
    try {
      await deleteChecklistItemService(todoId, itemId);
      set((state) => ({
        todos: state.todos.map((t) =>
          t.id === todoId
            ? {
                ...t,
                checklist: (t.checklist ?? []).filter((c) => c.id !== itemId),
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
