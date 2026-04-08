import {
  faChartLine,
  faListCheck,
  faFolderOpen,
  faUsers,
  faBell,
  faCog,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

// primary navigation (dashboard, tasks, projects, team)
export const primaryNav = [
  { key: "dashboard", label: "Dashboard", icon: faChartLine, path: "/dashboard" },
  { key: "tasks", label: "Tasks", icon: faListCheck, path: "/tasks" },
  { key: "projects", label: "Projects", icon: faFolderOpen, path: "/projects" },
  { key: "team", label: "Team", icon: faUsers, path: "/team" },
];

// system navigation (notifications, settings, etc.)
export const systemNav = [
  { key: "notifications", label: "Notifications", icon: faBell, path: "/notifications" },
  { key: "history", label: "History", icon: faClockRotateLeft, path: "/history" },
  { key: "settings", label: "Settings", icon: faCog, path: "/settings" },
];
