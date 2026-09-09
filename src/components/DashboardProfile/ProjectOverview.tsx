import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faFolderPlus,
  faClipboardList,
  faListCheck,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useProjectStore } from "../../stores/projectStore";
import useTodoStore from "../../stores/todoStore";
import { ROUTES } from "../../constants/routes";

interface OverviewCard {
  label: string;
  value: number;
  context: string;
  icon: typeof faFolderOpen;
  link?: boolean;
}

export default function ProjectOverview() {
  const navigate = useNavigate();
  const { projects, isLoading, fetchAll } = useProjectStore();
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

  const pctWith = stats.total > 0 ? Math.round((stats.withTasks / stats.total) * 100) : 0;
  const pctWithout =
    stats.total > 0 ? Math.round((stats.withoutTasks / stats.total) * 100) : 0;
  const pctLinked =
    todos.length > 0 ? Math.round((stats.linkedTasks / todos.length) * 100) : 0;

  const cards: OverviewCard[] = [
    {
      label: "Projects",
      value: stats.total,
      context: `${pctWith}% have tasks`,
      icon: faFolderOpen,
      link: true,
    },
    {
      label: "With tasks",
      value: stats.withTasks,
      context: `${pctWith}% of projects`,
      icon: faListCheck,
    },
    {
      label: "Without tasks",
      value: stats.withoutTasks,
      context: `${pctWithout}% stay idle`,
      icon: faFolderPlus,
    },
    {
      label: "Linked tasks",
      value: stats.linkedTasks,
      context: `${pctLinked}% of your todos`,
      icon: faClipboardList,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-2.5 rounded-lg border border-(--border-color) bg-(--bg-secondary) p-3 shadow-sm"
          >
            <div className="h-9 w-9 animate-pulse rounded-lg bg-(--border-color)" />
            <div className="h-6 w-10 animate-pulse rounded-full bg-(--border-color)" />
            <div className="h-2 w-16 animate-pulse rounded-full bg-(--border-color)" />
          </div>
        ))}
      </div>
    );
  }

  if (!isLoading && stats.total === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-(--border-color) bg-(--bg-secondary) px-4 py-8 text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--accent-soft)">
          <FontAwesomeIcon icon={faFolderPlus} className="text-(--accent-color)" />
        </span>
        <div>
          <p className="font-interface text-sm font-semibold text-(--text-primary)">
            No projects yet
          </p>
          <p className="mt-1 font-interface text-xs text-(--text-muted)">
            Group your tasks into projects to stay organised.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(ROUTES.projects)}
          className="inline-flex items-center gap-2 rounded-lg bg-(--accent-color) px-3.5 py-2 font-interface text-xs font-bold text-white transition-colors hover:bg-(--accent-strong)"
        >
          <FontAwesomeIcon icon={faPlus} />
          Create your first project
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map(({ label, value, context, icon, link }) => (
        <div
          key={label}
          onClick={link ? () => navigate(ROUTES.projects) : undefined}
          className={`group flex flex-col gap-2.5 rounded-lg border border-(--border-color) bg-(--bg-secondary) p-3 shadow-sm transition-all duration-200 ${
            link
              ? "cursor-pointer hover:-translate-y-0.5 hover:border-(--accent-muted) hover:shadow-md"
              : ""
          }`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--accent-soft)">
            <FontAwesomeIcon icon={icon} className="text-sm text-(--accent-color)" />
          </span>
          <p
            className={`font-mono text-2xl leading-none font-bold tabular-nums ${
              link ? "text-(--accent-color)" : "text-(--text-primary)"
            }`}
          >
            {value}
          </p>
          <div>
            <p className="font-interface text-[10px] font-bold uppercase tracking-widest text-(--text-secondary)">
              {label}
            </p>
            <p className="mt-0.5 font-interface text-[10px] text-(--text-muted)">
              {context}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}