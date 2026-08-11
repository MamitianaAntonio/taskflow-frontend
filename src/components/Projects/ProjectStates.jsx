import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";

export function LoadingState() {
  return (
    <p className="text-xs text-(--text-muted) text-center py-10 font-interface">
      Loading projects...
    </p>
  );
}

export function EmptyState() {
  return (
    <div className="py-20 flex flex-col items-center gap-2 text-(--text-secondary) rounded-xl border border-dashed border-(--border-color)">
      <FontAwesomeIcon icon={faFolderOpen} className="text-4xl text-(--text-muted) opacity-40" />
      <p className="text-sm font-medium text-(--text-primary)">
        No projects yet
      </p>
      <p className="text-xs text-(--text-muted)">Create a project to get started.</p>
    </div>
  );
}

export function NoResults({ search }) {
  return (
    <p className="text-xs text-(--text-muted) text-center py-10 font-interface">
      No projects match "{search}".
    </p>
  );
}
