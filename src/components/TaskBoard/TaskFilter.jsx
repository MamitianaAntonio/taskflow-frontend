const filterColors = {
  all: "bg-(--text-primary) text-(--bg-primary) border-(--text-primary)",
  todo: "bg-(--color-warning) text-(--text-white) border-(--color-warning)",
  doing: "bg-(--accent-color) text-(--text-white) border-(--accent-color)",
  done: "bg-(--color-success) text-(--text-white) border-(--color-success)",
};

const STATUSES = ["all", "todo", "doing", "done"];
const LABELS = { all: "All", todo: "Todo", doing: "Doing", done: "Done" };

export default function TaskFilter({ tasks, filter, setFilter }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {STATUSES.map((s) => (
        <button
          key={s}
          onClick={() => setFilter(s)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border font-interface transition-all duration-200 flex items-center gap-1.5
            ${filter === s ? filterColors[s] : "border-(--border-color) text-(--text-muted) hover:border-(--accent-color) hover:text-(--accent-color)"}`}
        >
          {LABELS[s]}
          <span className="text-[11px] opacity-70">
            {s === "all"
              ? tasks.length
              : tasks.filter((t) => t.status === s).length}
          </span>
        </button>
      ))}
    </div>
  );
}
