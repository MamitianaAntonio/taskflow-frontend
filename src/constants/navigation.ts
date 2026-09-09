import {
  faChartLine,
  faListCheck,
  faFolderOpen,
  faBell,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ROUTES } from "./routes";

export interface NavItem {
  key: string;
  label: string;
  icon: IconDefinition;
  path: string;
}

export const primaryNav: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: faChartLine, path: ROUTES.dashboard },
  { key: "tasks", label: "Tasks", icon: faListCheck, path: ROUTES.tasks },
  { key: "projects", label: "Projects", icon: faFolderOpen, path: ROUTES.projects },
];

export const systemNav: NavItem[] = [
  { key: "notifications", label: "Notifications", icon: faBell, path: ROUTES.notifications },
  { key: "settings", label: "Settings", icon: faCog, path: ROUTES.settings },
];

export function getPageTitle(pathname: string): string {
  if (pathname === ROUTES.dashboard) return "Dashboard";
  if (pathname.startsWith(ROUTES.projects)) return "Projects";
  if (pathname.startsWith(ROUTES.tasks)) return "Tasks";
  if (pathname.startsWith(ROUTES.notifications)) return "Notifications";
  if (pathname.startsWith(ROUTES.settings)) return "Settings";
  return "Workspace";
}