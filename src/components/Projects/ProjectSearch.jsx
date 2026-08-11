import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function ProjectSearch({ search, setSearch }) {
  return (
    <div className="relative w-full group">
      <FontAwesomeIcon
        icon={faSearch}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-(--text-muted) transition-colors"
      />
      <input
        type="text"
        placeholder="Filter projects…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-8 pr-3 py-2 rounded-lg border border-(--border-color) bg-(--bg-primary)
         text-sm text-(--text-primary) placeholder:text-(--text-muted) outline-none focus:border-(--text-muted)/40
        transition-all font-interface"
      />
    </div>
  );
}
