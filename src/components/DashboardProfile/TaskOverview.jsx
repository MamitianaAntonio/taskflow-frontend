export default function TaskOverview() {
  const total = 24;
  const completed = 18;
  const incomplete = 6;
  const pct = Math.round((completed / total) * 100);

  return (
    <div className="bg-(--bg-secondary) border border-(--border-color) rounded-lg p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold py-2 text-(--text-primary) opacity-50 uppercase tracking-widest">
            Tasks Overview
          </p>
          <span className="text-5xl font-bold font-mono text-(--text-primary) leading-none">
            {total}
          </span>
        </div>
        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-(--color-success)/15 text-(--color-success) tracking-wide">
          {pct}% done
        </span>
      </div>

      {/* Progress + Stats */}
      <div className="flex flex-col gap-2.5">
        {/* Track */}
        <div className="w-full h-1.5 rounded-full bg-(--bg-primary) border border-(--border-color) overflow-hidden">
          <div className="h-full rounded-full bg-(--color-success)" style={{ width: `${pct}%` }} />
        </div>
        {/* Stats row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-(--color-success)" />
            <span className="text-sm font-bold font-mono text-(--color-success)">{completed}</span>
            <span className="text-[11px] font-semibold text-(--text-primary) opacity-40 uppercase tracking-widest">
              Completed
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-(--color-highlight)" />
            <span className="text-sm font-bold font-mono text-(--color-highlight)">
              {incomplete}
            </span>
            <span className="text-[11px] font-semibold text-(--text-primary) opacity-40 uppercase tracking-widest">
              Incomplete
            </span>
          </div>
          <span className="text-sm font-mono text-(--text-primary) opacity-40">
            {completed} / {total}
          </span>
        </div>
      </div>
    </div>
  );
}
