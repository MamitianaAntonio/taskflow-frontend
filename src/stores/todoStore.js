import { create } from "zustand";
import {
  getAllTodo,
  createTodo as createTodoService,
  updateTodo as updateTodoService,
  deleteTodo as deleteTodoService,
} from "../services/todo";

const useTodoStore = create((set) => ({
  todos: [],
  isLoading: false,
  error: null,
  
  // load todos from backend
  fetchTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const todos = await getAllTodo();
      set({ todos, isLoading: false });
    } catch (error) {
      set({ error, isLoading: false });
      throw error;
    }
  },

  // add a new todo
  addTodo: async (title, dueDate = null, priority = 'medium', status = 'todo', projectId = undefined) => {
    try {
      const todoDueDate = dueDate ?? new Date().toISOString().split("T")[0];
      const todo = await createTodoService({ title, dueDate: todoDueDate, priority, status, projectId });
      set((state) => ({ todos: [...state.todos, todo] }));
      return todo;
    } catch (error) {
      set({ error });
      throw error;
    }
  },

  // update a todo
  updateTodo: async (id, updates) => {
    try {
      const updated = await updateTodoService(id, updates);
      set((state) => ({
        todos: state.todos.map((t) => (t.id === id ? updated : t)),
      }));
      return updated;
    } catch (error) {
      set({ error });
      throw error;
    }
  },

  // delete a todo
  deleteTodo: async (id) => {
    try {
      await deleteTodoService(id);
      set((state) => ({ todos: state.todos.filter((t) => t.id !== id) }));
    } catch (error) {
      set({ error });
      throw error;
    }
  },
}));

export default useTodoStore;