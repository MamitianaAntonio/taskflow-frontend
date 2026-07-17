import { create } from "zustand";
import * as projectService from "../services/project";

interface Project {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  fetchById: (id: number) => Promise<void>;
  create: (data: { name: string; description?: string }) => Promise<void>;
  update: (
    id: number,
    data: { name?: string; description?: string },
  ) => Promise<void>;
  remove: (id: number) => Promise<void>;
  reset: () => void;
}

export const useProjectStore = create<ProjectStore>((set, _get) => ({
  projects: [],
  currentProject: null,
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const data = await projectService.getAllProjects();
      set({ projects: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await projectService.getProjectById(id);
      set({ currentProject: res.project, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  create: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await projectService.createProject(data);
      set((state) => ({
        projects: [res.project, ...state.projects],
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  update: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await projectService.updateProject(id, data);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? res.project : p)),
        currentProject:
          state.currentProject?.id === id ? res.project : state.currentProject,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  remove: async (id) => {
    set({ loading: true, error: null });
    try {
      await projectService.deleteProject(id);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        currentProject:
          state.currentProject?.id === id ? null : state.currentProject,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  reset: () =>
    set({ projects: [], currentProject: null, loading: false, error: null }),
}));
