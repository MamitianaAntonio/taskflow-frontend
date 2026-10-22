export const ROUTES = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
  tasks: "/dashboard/tasks",
  projects: "/dashboard/projects",
  projectDetails: (projectId: string) =>
    `/dashboard/projects/${projectId}`,
  calendar: "/dashboard/calendar",
  notifications: "/dashboard/notifications",
  settings: "/dashboard/settings",
} as const;