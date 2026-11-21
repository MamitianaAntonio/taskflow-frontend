import {
  Bell,
  CalendarDays,
  FolderOpen,
  LayoutDashboard,
  ListTodo,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "./routes";

export interface NavItem {
  key: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

export const primaryNav: NavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: ROUTES.dashboard,
  },
  { key: "tasks", label: "Tasks", icon: ListTodo, path: ROUTES.tasks },
  {
    key: "projects",
    label: "Projects",
    icon: FolderOpen,
    path: ROUTES.projects,
  },
  {
    key: "calendar",
    label: "Calendar",
    icon: CalendarDays,
    path: ROUTES.calendar,
  },
];

export const systemNav: NavItem[] = [
  {
    key: "notifications",
    label: "Notifications",
    icon: Bell,
    path: ROUTES.notifications,
  },
  { key: "settings", label: "Settings", icon: Settings, path: ROUTES.settings },
];

export function getPageTitle(pathname: string): string {
  if (pathname === ROUTES.dashboard) return "Dashboard";
  if (pathname.startsWith(ROUTES.projects)) return "Projects";
  if (pathname.startsWith(ROUTES.tasks)) return "Tasks";
  if (pathname.startsWith(ROUTES.calendar)) return "Calendar";
  if (pathname.startsWith(ROUTES.notifications)) return "Notifications";
  if (pathname.startsWith(ROUTES.settings)) return "Settings";
  return "Workspace";
}
