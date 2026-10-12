import axiosClient, { getErrorMessage } from "../api/axios";
import type { CreateProjectPayload, Project, UpdateProjectPayload } from "../types/project";

export const getAllProjects = (): Promise<Project[]> =>
  axiosClient.get<Project[]>("/api/projects").then((r) => r.data);

export const getProjectById = async (id: string): Promise<Project> => {
  try {
    const response = await axiosClient.get<{ project: Project }>(`/api/projects/${id}`);
    return response.data.project;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch project"));
  }
};

export const createProject = async (data: CreateProjectPayload): Promise<Project> => {
  try {
    const response = await axiosClient.post<{ project: Project }>("/api/projects", data);
    return response.data.project;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create project"));
  }
};

export const updateProject = async (
  id: string,
  data: UpdateProjectPayload,
): Promise<Project> => {
  try {
    const response = await axiosClient.put<{ project: Project }>(`/api/projects/${id}`, data);
    return response.data.project;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update project"));
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    await axiosClient.delete(`/api/projects/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete project"));
  }
};