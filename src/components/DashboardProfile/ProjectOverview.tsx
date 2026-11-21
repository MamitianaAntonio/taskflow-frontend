import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  FolderOpen,
  FolderPlus,
  ListChecks,
  Plus,
  type LucideIcon,
} from "lucide-react";
import Button from "../ui/Button";
import { useProjectStore } from "../../stores/projectStore";
import useTodoStore from "../../stores/todoStore";
import { loadProjectsIfNeeded } from "../../utils/bootstrap";
import { ROUTES } from "../../constants/routes";

interface OverviewCard {
  label: string;
  value: number;
  context: string;
  icon: LucideIcon;
  link?: boolean;
}

export default function ProjectOverview() {
  const navigate = useNavigate();
  const { projects, isLoading } = useProjectStore();
  const todos = useTodoStore((state) => state.todos);

  useEffect(() => {
    loadProjectsIfNeeded();
  }, []);

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

  const pctWith =
    stats.total > 0 ? Math.round((stats.withTasks / stats.total) * 100) : 0;
  const pctWithout =
    stats.total > 0 ? Math.round((stats.withoutTasks / stats.total) * 100) : 0;
  const pctLinked =
    todos.length > 0 ? Math.round((stats.linkedTasks / todos.length) * 100) : 0;

  const cards: OverviewCard[] = [
    {
      label: "Projects",
      value: stats.total,
      context: `${pctWith}% have tasks`,
      icon: FolderOpen,
      link: true,
    },
    {
      label: "With tasks",
      value: stats.withTasks,
      context: `${pctWith}% of projects`,
      icon: ListChecks,
    },
    {
      label: "Without tasks",
      value: stats.withoutTasks,
      context: `${pctWithout}% stay idle`,
      icon: FolderPlus,
    },
    {
      label: "Linked tasks",
      value: stats.linkedTasks,
      context: `${pctLinked}% of your todos`,
      icon: ClipboardList,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-2.5 rounded-control border border-(--border-color)
            bg-(--bg-secondary) p-3 shadow-sm"
          >
            <div className="size-9 animate-pulse rounded-lg bg-(--border-color)" />
            <div className="h-6 w-10 animate-pulse rounded-full bg-(--border-color)" />
            <div className="h-2 w-16 animate-pulse rounded-full bg-(--border-color)" />
          </div>
        ))}
      </div>
    );
  }

  if (!isLoading && stats.total === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-control border border-(--border-color) bg-(--bg-secondary) px-4 py-8 text-center">
        <span className="flex size-10 items-center justify-center rounded-lg bg-(--accent-soft) text-(--accent-strong)">
          <FolderPlus aria-hidden="true" size={20} strokeWidth={1.8} />
        </span>
        <div>
          <p className="font-interface text-sm font-semibold text-(--text-primary)">
            No projects yet
          </p>
          <p className="mt-1 font-interface text-xs text-(--text-muted)">
            Group your tasks into projects to stay organised.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="small"
          onClick={() => navigate(ROUTES.projects)}
          icon={<Plus aria-hidden="true" size={15} strokeWidth={2} />}
        >
          Create your first project
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map(({ label, value, context, icon, link }) => {
        const Icon = icon;
        const open = link ? () => navigate(ROUTES.projects) : undefined;
        return (
          <div
            key={label}
            role={open ? "button" : undefined}
            tabIndex={open ? 0 : -1}
            onClick={open}
            onKeyDown={(e) => {
              if (!open || e.target !== e.currentTarget) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                open();
              }
            }}
            className={`group flex flex-col gap-2.5 rounded-control border border-(--border-color)
            bg-(--bg-secondary) p-3 transition-all duration-200 hover:shadow-sm ${
              link
                ? "cursor-pointer hover:-translate-y-0.5 hover:border-(--accent-muted) hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-color)"
                : ""
            }`}
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-(--accent-soft) text-(--accent-strong)">
              <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
            </span>
            <p
              className={`font-mono text-2xl leading-none font-bold tabular-nums ${
                link ? "text-(--accent-strong)" : "text-(--text-primary)"
              }`}
            >
              {value}
            </p>
            <div>
              <p className="font-interface text-[10px] font-semibold uppercase tracking-[0.12em] text-(--text-secondary)">
                {label}
              </p>
              <p className="mt-0.5 font-interface text-[10px] text-(--text-muted)">
                {context}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
