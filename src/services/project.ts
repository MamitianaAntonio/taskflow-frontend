import axiosClient from "../api/axios";

interface createProjectData {
  name: string;
  description?: string;
}

interface UpdateProjectData {
  name?: string;
  description?: string;
}

export const getAllProjects = async () => {
  const response = await axiosClient.get("/api/projects");
  return response.data;
};

export const getProjectById = async (id: number) => {
  try {
    const response = await axiosClient.get(`/api/projects/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch project");
  }
};

export const createProject = async (data: createProjectData) => {
  try {
    const response = await axiosClient.post("/api/projects", data);
    return {
      success: true,
      status: response.status,
      message: response.data.message,
      project: response.data.project,
    };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to create a project",
    );
  }
};

export const updateProject = async (id: number, data: UpdateProjectData) => {
  try {
    const response = await axiosClient.put(`/api/projects/${id}`, data);
    return {
      success: true,
      message: response.data.message,
      project: response.data.project,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to update project");
  }
};

export const deleteProject = async (id: number) => {
  try {
    const response = await axiosClient.delete(`/api/projects/${id}`);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to delete project");
  }
};
