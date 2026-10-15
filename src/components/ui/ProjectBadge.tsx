import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ProjectBadgeProps {
  name: string;
  className?: string;
}

/** Small neutral pill identifying the project a task belongs to. */
export default function ProjectBadge({ name, className = "" }: ProjectBadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full bg-(--bg-tertiary) px-2 py-0.5 font-interface text-[10px] font-semibold text-(--text-secondary) ${className}`}
      title={name}
    >
      <FontAwesomeIcon icon={faFolderOpen} className="text-[9px]" />
      <span className="max-w-37.5 truncate">{name}</span>
    </span>
  );
}
