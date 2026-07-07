export default function TaskOverview({ completed = 0, incomplete = 0, total = 0 }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-(--bg-secondary) border border-(--border-color) rounded-lg p-4 flex flex-col gap-4">
      <p className="text-xs font-semibold text-(--text-primary) opacity-50 uppercase tracking-widest font-interface">
        Completion progress
      </p>

      <div className="flex items-end justify-between">
        <span className="text-4xl font-bold font-mono text-(--text-primary) leading-none">
          {total}
        </span>
        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-(--color-success)/15 text-(--color-success) tracking-wide font-interface">
          {pct}% done
        </span>
      </div>

      <div className="w-full h-2 rounded-full bg-(--bg-primary) border border-(--border-color) overflow-hidden">
        <div
          className="h-full rounded-full bg-(--color-success) transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 bg-(--color-success)/5 rounded-lg px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-(--color-success) shrink-0" />
          <span className="text-sm font-bold font-mono text-(--color-success)">{completed}</span>
          <span className="text-[10px] text-(--color-success) font-interface">completed</span>
        </div>
        <div className="flex items-center gap-2 bg-(--color-highlight)/5 rounded-lg px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-(--color-highlight) shrink-0" />
          <span className="text-sm font-bold font-mono text-(--color-highlight)">{incomplete}</span>
          <span className="text-[10px] text-(--color-highlight) font-interface">incomplete</span>
        </div>
      </div>
    </div>
  );
}
