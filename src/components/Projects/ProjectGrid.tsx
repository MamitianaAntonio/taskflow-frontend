import { ArrowRight, CalendarDays, CircleCheck } from "lucide-react";
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

interface ProjectCardProps {
  project: Project;
  progress: ProjectProgress;
  onSelect: (id: string) => void;
}

function ProjectCard({ project, progress, onSelect }: ProjectCardProps) {
  const { total, done } = progress;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const completed = total > 0 && done === total;
  const overdue =
    !completed && !!project.dueDate && isOverdue(project.dueDate);

  const barColor = completed
    ? "bg-(--color-success)"
    : overdue
      ? "bg-(--color-error)"
      : "bg-(--accent-color)";

  return (
    <div
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
      className={`
        group relative flex cursor-pointer flex-col gap-2.5 overflow-hidden
        rounded-xl border bg-(--bg-secondary) p-4 pb-5 shadow-sm
        transition-all duration-200 motion-reduce:transition-none
        hover:-translate-y-0.5 hover:shadow-md
        focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-(--accent-color)
        ${
          overdue
            ? "border-(--color-error)/30 hover:border-(--color-error)/60"
            : "border-(--border-color) hover:border-(--accent-muted)"
        }
      `}
    >
      {/* Title + description */}
      <div className="min-w-0">
        <p
          className="truncate text-sm font-semibold text-(--text-primary)"
          title={project.name}
        >
          {project.name}
        </p>
        {project.description ? (
          <p className="mt-1 line-clamp-2 text-xs text-(--text-muted)">
            {project.description}
          </p>
        ) : (
          <p className="mt-1 text-xs italic text-(--text-muted)/70">
            No description
          </p>
        )}
      </div>

      {/* Deadline */}
      {project.dueDate && (
        <span
          className={`
            inline-flex w-fit items-center gap-1.5 rounded-full
            px-2 py-0.5 font-interface text-[10px] font-semibold
            ${
              overdue
                ? "bg-(--color-error-soft) text-(--color-error)"
                : "bg-(--bg-tertiary) text-(--text-secondary)"
            }
          `}
          title={overdue ? "Deadline passed" : "Project deadline"}
        >
          <CalendarDays size={10} strokeWidth={2.2} aria-hidden="true" />
          {overdue ? "Overdue · " : "Due "}
          {formatDate(project.dueDate)}
        </span>
      )}

      {/* Footer: progress text + arrow */}
      <div className="mt-auto flex items-center justify-between gap-2 pt-1.5">
        {completed ? (
          <span className="inline-flex items-center gap-1.5 font-interface text-[11px] font-semibold text-(--color-success)">
            <CircleCheck size={12} strokeWidth={2.2} aria-hidden="true" />
            Completed
          </span>
        ) : (
          <span className="font-interface text-[11px] tabular-nums text-(--text-muted)">
            {total === 0 ? "No tasks yet" : `${done}/${total} done · ${pct}%`}
          </span>
        )}
        <ArrowRight
          size={13}
          aria-hidden="true"
          className="shrink-0 text-(--text-muted) transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-(--accent-color)"
        />
      </div>

      {/* Progress bar */}
      <div
        role="progressbar"
        aria-label={`Progress for ${project.name}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="absolute inset-x-0 bottom-0 h-1 bg-(--bg-tertiary)"
      >
        <div
          className={`h-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function ProjectGrid({
  projects,
  progress,
  onSelect,
}: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          progress={progress[project.id] ?? { total: 0, done: 0 }}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
