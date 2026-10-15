import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCalendarDays,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate, isOverdue } from "../../utils/date";
import type { Project } from "../../types/project";

interface ProjectProgress {
  total: number;
  done: number;
}

interface ProjectGridProps {
  projects: Project[];
  progress: Record<string, ProjectProgress>;
  onSelect: (id: string) => void;
}

export default function ProjectGrid({
  projects,
  progress,
  onSelect,
}: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {projects.map((project) => {
        const p = progress[project.id] ?? { total: 0, done: 0 };
        const pct = p.total > 0 ? Math.round((p.done / p.total) * 100) : 0;
        const completed = p.total > 0 && p.done === p.total;
        const overdue = !completed && project.dueDate ? isOverdue(project.dueDate) : false;

        return (
          <div
            key={project.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(project.id)}
            onKeyDown={(e) => {
              if (e.target !== e.currentTarget) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(project.id);
              }
            }}
            className="group relative flex cursor-pointer flex-col gap-3 overflow-hidden rounded-xl
            bg-(--bg-secondary) p-4 pb-5 shadow-sm transition-all hover:border-(--accent-muted) hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-color)"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-(--text-primary)">
                {project.name}
              </p>
              {project.description ? (
                <p className="mt-1 line-clamp-2 text-xs text-(--text-muted)">
                  {project.description}
                </p>
              ) : (
                <p className="mt-1 text-xs italic text-(--text-muted)">
                  No description
                </p>
              )}
            </div>

            {project.dueDate && (
              <span
                className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 font-interface text-[10px] font-semibold ${
                  overdue
                    ? "bg-(--color-error-soft) text-(--color-error)"
                    : "bg-(--bg-tertiary) text-(--text-secondary)"
                }`}
                title={overdue ? "Deadline passed" : "Project deadline"}
              >
                <FontAwesomeIcon icon={faCalendarDays} className="text-[9px]" />
                {overdue ? "Overdue · " : "Due "}
                {formatDate(project.dueDate)}
              </span>
            )}

            <div className="mt-auto flex items-center justify-between gap-2 pt-2">
              {completed ? (
                <span className="inline-flex items-center gap-1.5 font-interface text-[11px] font-semibold text-(--color-success) tabular-nums">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-[11px]" />
                  Completed
                </span>
              ) : (
                <span className="font-interface text-[11px] text-(--text-muted) tabular-nums">
                  {p.total === 0
                    ? "No tasks yet"
                    : `${p.done}/${p.total} done · ${pct}%`}
                </span>
              )}
              <FontAwesomeIcon
                icon={faArrowRight}
                className="shrink-0 text-xs text-(--text-muted) transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-(--accent-color)"
              />
            </div>

            <div className="absolute inset-x-0 bottom-0 h-1 bg-(--bg-tertiary)">
              <div
                className={`h-full transition-all duration-500 ${
                  completed ? "bg-(--color-success)" : "bg-(--accent-color)"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}