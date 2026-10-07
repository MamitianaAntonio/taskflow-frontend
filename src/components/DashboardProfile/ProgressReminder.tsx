interface ProgressReminderProps {
  completed?: number;
  total?: number;
  isLoading?: boolean;
}

const MILESTONES = [
  { pct: 0, message: "Ready when you are" },
  { pct: 25, message: "Good start, keep going" },
  { pct: 50, message: "Halfway there" },
  { pct: 75, message: "Almost there" },
  { pct: 100, message: "Everything's done. Nice work!" },
];

export default function ProgressReminder({
  completed = 0,
  total = 0,
  isLoading = false,
}: ProgressReminderProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const active = [...MILESTONES].reverse().find((m) => pct >= m.pct)!;

  const card =
    "rounded-lg border-(--border-color) bg-(--bg-secondary) p-4 shadow-sm";

  if (isLoading) {
    return (
      <div className={card}>
        <div className="flex items-baseline justify-between">
          <div className="h-3.5 w-40 animate-pulse rounded-full bg-(--border-color)" />
          <div className="h-5 w-10 animate-pulse rounded-md bg-(--border-color)" />
        </div>
        <div className="mt-4 h-1.5 animate-pulse rounded-full bg-(--border-color)" />
      </div>
    );
  }

  return (
    <div className={card}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium text-(--text-primary)">
          {active.message}
        </p>
        <span className="font-mono text-sm font-semibold text-(--accent-strong) tabular-nums">
          {pct}%
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative mt-4 h-1.5 rounded-full bg-(--border-color)"
      >
        <div
          className="h-full rounded-full bg-(--accent-color) transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
        {MILESTONES.slice(1, -1).map((m) => (
          <span
            key={m.pct}
            className={`absolute top-1/2 h-3 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${
              pct >= m.pct ? "bg-(--bg-tertiary)" : "bg-(--text-muted)/40"
            }`}
            style={{ left: `${m.pct}%` }}
          />
        ))}
      </div>

      <p className="mt-2 font-mono text-xs text-(--text-muted) tabular-nums">
        {completed} / {total} tasks
      </p>
    </div>
  );
}
