export default function TaskFilter( { tasks, filter, setFilter } ) {
  const STATUSES = ["all", "todo", "doing", "done"];

  return (
    <div className="rounded-lg border border-(--border-color) bg-(--bg-secondary) px-4 py-2 flex items-center justify-between flex-wrap gap-3">
      <p className="text-sm font-semibold text-(--text-primary)">My flow</p>
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-200 flex items-center gap-2
              ${
                filter === s
                  ? "bg-(--text-primary) text-(--bg-primary) border-(--text-primary)"
                  : "border-(--border-color) text-(--text-tertiary) hover:border-(--accent-color) hover:text-(--text-primary)"
              }`}
          >
            {s}
            <span className="text-[11px] opacity-70">
              {s === "all"
                ? tasks.length
                : tasks.filter((t) => t.status === s).length}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
