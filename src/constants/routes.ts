export const ROUTES = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
  tasks: "/dashboard/tasks",
  projects: "/dashboard/projects",
  projectDetails: (projectId: number | string) =>
    `/dashboard/projects/${projectId}`,
  notifications: "/dashboard/notifications",
  settings: "/dashboard/settings",
} as const;