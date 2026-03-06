import { create } from "zustand";
import axiosClient from "../api/axios";

const useTodoStore = create((set) => ({
  todos: [],
  isLoading: false,
  error: null,
  
  // load todos from backend
  fetchTodos: async () => {
    set({ isLoading: true });
    const { data } = await axiosClient.get("/api/todos");
    set({ todos: data, isLoading: false });
  },

  // add a new todo
  addTodo: async (title, dueDate = null, priority = 'medium') => {
    const { data } = await axiosClient.post('/api/todos', { title, dueDate, priority });
    set((state) => ({ todos: [...state.todos, data] }));
  },

  // update a todo
  updateTodo: async (id, updates) => {
    const { data } = await axiosClient.put(`/api/todos/${id}`, updates);
    set((state) => ({
      todos: state.todos.map((t) => (t.id === id ? data : t)),
    }));
  },

  // delete a todo
  deleteTodo: async (id) => {
    await axiosClient.delete(`/api/todos/${id}`);
    set((state) => ({ todos: state.todos.filter((t) => t.id !== id) }));
  },
}));

export default useTodoStore;