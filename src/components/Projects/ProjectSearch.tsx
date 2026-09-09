import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface ProjectSearchProps {
  search: string;
  setSearch: (value: string) => void;
}

export default function ProjectSearch({ search, setSearch }: ProjectSearchProps) {
  return (
    <div className="group relative w-full">
      <FontAwesomeIcon
        icon={faSearch}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-(--text-muted) transition-colors"
      />
      <input
        type="text"
        placeholder="Filter projects…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-(--border-color) bg-(--bg-primary) py-2 pl-8 pr-3 font-interface text-sm text-(--text-primary) outline-none transition-all placeholder:text-(--text-muted) focus:border-(--accent-color)"
      />
    </div>
  );
}