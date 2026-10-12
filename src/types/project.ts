export interface Project {
  id: string;
  name: string;
  description?: string;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  dueDate?: string | null;
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string;
  dueDate?: string | null;
}