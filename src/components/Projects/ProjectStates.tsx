import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";

export function LoadingState() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 rounded-xl border border-(--border-color) bg-(--bg-secondary) p-4 pb-5 shadow-sm"
        >
          <div className="h-4 w-3/4 animate-pulse rounded-full bg-(--border-color)" />
          <div className="h-2 w-2/3 animate-pulse rounded-full bg-(--border-color)" />
          <div className="mt-auto pt-2">
            <div className="h-2.5 w-24 animate-pulse rounded-full bg-(--border-color)" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-20 text-(--text-secondary)">
      <FontAwesomeIcon
        icon={faFolderOpen}
        className="text-4xl text-(--text-muted) opacity-40"
      />
      <p className="text-sm font-medium text-(--text-primary)">
        No projects yet
      </p>
      <p className="text-xs text-(--text-muted)">Create a project to get started.</p>
    </div>
  );
}

export function NoResults({ search }: { search: string }) {
  return (
    <p className="py-10 text-center text-xs font-interface text-(--text-muted)">
      No projects match "{search}".
    </p>
  );
}