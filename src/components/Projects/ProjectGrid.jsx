import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function ProjectGrid({ projects, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => onSelect(project.id)}
          className="group rounded-xl border border-(--border-color) bg-(--bg-secondary) p-4 flex flex-col gap-3 cursor-pointer
           shadow-sm hover:shadow-md hover:border-(--text-muted)/30
            transition-all relative overflow-hidden before:absolute before:inset-y-0 before:left-0 before:w-0.75
             before:bg-(--text-muted)/30 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity"
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-(--text-primary) truncate">
              {project.name}
            </p>
            {project.description ? (
              <p className="text-xs text-(--text-muted) mt-1 line-clamp-2">
                {project.description}
              </p>
            ) : (
              <p className="text-xs text-(--text-muted) mt-1 italic">
                No description
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-auto pt-2 border-t border-(--border-color)">
            <span className="text-[11px] text-(--text-muted) font-interface opacity-0 group-hover:opacity-100 transition-opacity">
              Open
            </span>
            <FontAwesomeIcon
              icon={faArrowRight}
              className="text-xs text-(--text-muted) group-hover:text-(--text-primary) transition-colors"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
