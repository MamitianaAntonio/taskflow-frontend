import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRoute, faArrowRight } from "@fortawesome/free-solid-svg-icons";

interface ProgressReminderProps {
  completed?: number;
  total?: number;
  isLoading?: boolean;
}

interface Milestone {
  pct: number;
  message: string;
}

const MILESTONES: Milestone[] = [
  { pct: 0, message: "Every big win starts with a plan" },
  { pct: 25, message: "Great start — keep the momentum going" },
  { pct: 50, message: "Halfway there! The best is yet to come" },
  { pct: 75, message: "Almost there — finish strong" },
  { pct: 100, message: "All done — you crushed it!" },
];

export default function ProgressReminder({
  completed = 0,
  total = 0,
  isLoading = false,
}: ProgressReminderProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const activeIndex = MILESTONES.reduce(
    (acc, m, i) => (pct >= m.pct ? i : acc),
    -1,
  );
  const active = MILESTONES[activeIndex];
  const next =
    activeIndex < MILESTONES.length - 1 ? MILESTONES[activeIndex + 1] : null;

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-lg border border-(--border-color) bg-(--bg-secondary) p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-pulse rounded-full bg-(--border-color)" />
            <div className="h-3 w-32 animate-pulse rounded-full bg-(--border-color)" />
          </div>
          <div className="h-6 w-11 animate-pulse rounded-md bg-(--border-color)" />
        </div>
        <div className="relative mt-7 h-14">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute top-0 flex -translate-x-1/2 flex-col items-center gap-1.5"
              style={{ left: `${(i * 25)}%` }}
            >
              <div className="h-3.5 w-3.5 animate-pulse rounded-full bg-(--border-color)" />
              <div className="h-2 w-7 animate-pulse rounded-full bg-(--border-color)" />
            </div>
          ))}
        </div>
        <div className="mt-2 h-3 w-1/3 animate-pulse rounded-full bg-(--border-color)" />
        <div className="mt-2 h-5 w-2/3 animate-pulse rounded-full bg-(--border-color)" />
        <div className="mt-1.5 h-3 w-1/3 animate-pulse rounded-full bg-(--border-color)" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-(--border-color) bg-(--bg-secondary) p-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 font-interface text-xs font-semibold uppercase tracking-widest text-(--text-muted)">
          <FontAwesomeIcon icon={faRoute} className="text-(--accent-color)" />
          Progress reminder
        </p>
        <span className="flex h-6 min-w-11 shrink-0 items-center justify-center rounded-md bg-linear-to-r from-(--accent-color) to-(--accent-strong)
          px-3 font-mono text-sm font-bold text-(--text-white) tabular-nums shadow-(--shadow-pink)">
          {pct}%
        </span>
      </div>

      <div className="relative mt-7 h-14 mx-10 px-5">
        <div className="absolute inset-x-0 top-1.5 flex h-0.5">
          <div className="absolute inset-0 rounded-full bg-(--bg-tertiary)" />
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-(--accent-color) to-(--accent-strong) transition-all duration-700 ease-out"
            style={{ width: `${pct}%`, opacity: pct > 0 ? 1 : 0 }}
          />
        </div>
        {MILESTONES.map((m, i) => {
          const reached = pct >= m.pct;
          const isActive = i === activeIndex;
          return (
            <div
              key={m.pct}
              className="absolute top-0 flex -translate-x-1/2 flex-col items-center gap-1.5"
              style={{ left: `${m.pct}%` }}
            >
              <span
                className={`relative z-10 h-3.5 w-3.5 rounded-full transition-all duration-300 ${reached
                  ? isActive
                    ? "scale-125 bg-(--accent-strong) shadow-(--shadow-pink)"
                    : "bg-(--accent-color)"
                  : "bg-(--bg-secondary) ring-2 ring-(--border-color)"
                  }`}
              />
              <span
                className={`font-mono text-[10px] font-semibold tabular-nums ${reached ? "text-(--accent-strong)" : "text-(--text-muted)"
                  }`}
              >
                {m.pct}%
              </span>
            </div>
          );
        })}
      </div>

      <div className="border-t border-(--border-color) pt-3">
        <p className="font-interface text-[10px] font-semibold uppercase tracking-widest text-(--text-muted)">
          Milestone {activeIndex + 1} of {MILESTONES.length} ·{" "}
          <span className="text-(--accent-strong)">{active.pct}% reached</span>
        </p>
        <p className="mt-1 bg-linear-to-r from-(--accent-color) to-(--accent-strong) bg-clip-text font-sans text-lg leading-snug font-bold text-transparent">
          {active.message}
        </p>
        {next && (
          <p className="mt-1.5 flex items-center gap-1.5 font-interface text-xs font-medium text-(--text-muted)">
            <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
            Next up:{" "}
            <span className="font-semibold text-(--text-secondary)">
              {next.message}
            </span>{" "}
            ({next.pct}%)
          </p>
        )}
      </div>
    </div>
  );
}
