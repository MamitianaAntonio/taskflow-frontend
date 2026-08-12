import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faFolderPlus,
  faClipboardList,
  faListCheck,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { useProjectStore } from "../../stores/projectStore";
import useTodoStore from "../../stores/todoStore";

export default function ProjectOverview() {
  const navigate = useNavigate();
  const { projects, loading, fetchAll } = useProjectStore();
  const todos = useTodoStore((state) => state.todos);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const stats = useMemo(() => {
    const withTasks = projects.filter((p) =>
      todos.some((t) => t.projectId === p.id),
    ).length;
    return {
      total: projects.length,
      withTasks,
      withoutTasks: projects.length - withTasks,
      linkedTasks: todos.filter((t) => t.projectId != null).length,
    };
  }, [projects, todos]);

  const cards = [
    {
      label: "Projects",
      value: stats.total,
      icon: faFolderOpen,
      color: "text-(--accent-color)",
      bg: "bg-(--accent-color)/10",
      link: true,
    },
    {
      label: "With tasks",
      value: stats.withTasks,
      icon: faListCheck,
      color: "text-(--color-success)",
      bg: "bg-(--color-success)/10",
    },
    {
      label: "Without tasks",
      value: stats.withoutTasks,
      icon: faFolderPlus,
      color: "text-(--color-warning)",
      bg: "bg-(--color-warning)/10",
    },
    {
      label: "Linked tasks",
      value: stats.linkedTasks,
      icon: faClipboardList,
      color: "text-(--text-primary)",
      bg: "bg-(--text-muted)/10",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-(--bg-secondary) border border-(--border-color) shadow-sm rounded-lg p-3"
          >
            <div className="h-2.5 w-16 bg-(--border-color) rounded-full animate-pulse" />
            <div className="h-6 w-8 bg-(--border-color) rounded-full animate-pulse mt-3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map(({ label, value, icon, color, bg, link }) => (
        <div
          key={label}
          onClick={link ? () => navigate("/dashboard/projects") : undefined}
          className={`flex items-center gap-3 bg-(--bg-secondary) border border-(--border-color) shadow-sm
          rounded-lg p-3 transition-colors ${
            link
              ? "cursor-pointer hover:border-(--accent-color)/50 hover:shadow-md"
              : ""
          }`}
        >
          <div
            className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}
          >
            <FontAwesomeIcon icon={icon} className={`text-sm ${color}`} />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold font-mono text-(--text-primary) leading-none">
              {value}
            </p>
            <p className="text-[9px] text-(--text-muted) mt-1 truncate font-interface uppercase tracking-widest">
              {label}
            </p>
          </div>
          {link && (
            <FontAwesomeIcon
              icon={faArrowRight}
              className="text-xs text-(--text-muted) ml-auto shrink-0"
            />
          )}
        </div>
      ))}
    </div>
  );
}
