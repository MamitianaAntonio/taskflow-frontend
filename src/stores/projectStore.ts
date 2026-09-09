import { create } from "zustand";
import {
  createProject as createProjectService,
  deleteProject as deleteProjectService,
  getAllProjects,
  getProjectById as getProjectByIdService,
  updateProject as updateProjectService,
} from "../services/project";
import type {
  CreateProjectPayload,
  Project,
  UpdateProjectPayload,
} from "../types/project";
import { emitMutation } from "../utils/eventBus";

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: Error | null;

  fetchAll: () => Promise<Project[]>;
  fetchById: (id: number) => Promise<Project | undefined>;
  create: (data: CreateProjectPayload) => Promise<Project>;
  update: (id: number, data: UpdateProjectPayload) => Promise<Project>;
  remove: (id: number) => Promise<void>;
  reset: () => void;
}

export const useProjectStore = create<ProjectState>()((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const projects = await getAllProjects();
      set({ projects, isLoading: false });
      return projects;
    } catch (error) {
      set({ error: error as Error, isLoading: false });
      throw error;
    }
  },

  fetchById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const currentProject = await getProjectByIdService(id);
      set({ currentProject, isLoading: false });
      return currentProject;
    } catch (error) {
      set({ error: error as Error, isLoading: false });
      throw error;
    }
  },

  create: async (data) => {
    try {
      const project = await createProjectService(data);
      set((state) => ({ projects: [project, ...state.projects] }));
      emitMutation();
      return project;
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const project = await updateProjectService(id, data);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? project : p)),
        currentProject:
          state.currentProject?.id === id ? project : state.currentProject,
      }));
      emitMutation();
      return project;
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  remove: async (id) => {
    try {
      await deleteProjectService(id);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        currentProject:
          state.currentProject?.id === id ? null : state.currentProject,
      }));
      emitMutation();
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  reset: () => {
    set({ projects: [], currentProject: null, isLoading: false, error: null });
  },
}));

export const getProject = (id: number): Project | undefined =>
  useProjectStore.getState().projects.find((p) => p.id === id);