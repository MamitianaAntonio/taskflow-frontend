import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import type { Project } from "../../types/project";

interface ProjectProgress {
  total: number;
  done: number;
}

interface ProjectGridProps {
  projects: Project[];
  progress: Record<number, ProjectProgress>;
  onSelect: (id: number) => void;
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

        return (
          <div
            key={project.id}
            onClick={() => onSelect(project.id)}
            className="group relative flex cursor-pointer flex-col gap-3 overflow-hidden rounded-xl border border-(--border-color) bg-(--bg-secondary) p-4 pb-5 shadow-sm transition-all hover:border-(--accent-muted) hover:shadow-md"
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

            <div className="mt-auto flex items-center justify-between gap-2 pt-2">
              <span className="font-interface text-[11px] text-(--text-muted) tabular-nums">
                {p.total === 0
                  ? "No tasks yet"
                  : `${p.done}/${p.total} done · ${pct}%`}
              </span>
              <FontAwesomeIcon
                icon={faArrowRight}
                className="shrink-0 text-xs text-(--text-muted) transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-(--accent-color)"
              />
            </div>

            <div className="absolute inset-x-0 bottom-0 h-1 bg-(--bg-tertiary)">
              <div
                className="h-full bg-(--accent-color) transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}