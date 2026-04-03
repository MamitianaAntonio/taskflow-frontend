export default function TaskOverview() {
  return (
    <div className="bg-(--bg-secondary) border border-(--border-color) rounded-lg p-5 flex flex-col gap-4">
      {/* Title */}
      <p className="text-sm font-semibold text-(--text-primary) opacity-50 uppercase tracking-widest">
        Tasks Overview
      </p>

      {/* Stats */}
      <div className="flex items-center justify-between">
        {/* Total */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-3xl font-bold font-mono text-(--text-primary)">
            24
          </span>
          <span className="text-xs text-(--text-primary) opacity-40 uppercase tracking-widest">
            Total
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-(--border-color) opacity-50" />

        {/* Completed */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-3xl font-bold font-mono text-emerald-500">
            18
          </span>
          <span className="text-xs text-(--text-primary) opacity-40 uppercase tracking-widest">
            Completed
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-(--border-color) opacity-50" />

        {/* Incomplete */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-3xl font-bold font-mono text-rose-500">6</span>
          <span className="text-xs text-(--text-primary) opacity-40 uppercase tracking-widest">
            Incomplete
          </span>
        </div>
      </div>
    </div>
  );
}
