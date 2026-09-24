import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRoute } from "@fortawesome/free-solid-svg-icons";

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
  { pct: 25, message: "Great start, keep the momentum going" },
  { pct: 50, message: "Halfway there, the best is yet to come" },
  { pct: 75, message: "Almost there, finish strong" },
  { pct: 100, message: "All done, you crushed it!" },
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

  if (isLoading) {
    return (
      <div className="shadow-sm rounded-xl border border-(--border-color) bg-(--bg-secondary) p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 animate-pulse rounded-full bg-(--border-color)" />
            <div className="h-2.5 w-20 animate-pulse rounded-full bg-(--border-color)" />
          </div>
          <div className="h-2.5 w-16 animate-pulse rounded-full bg-(--border-color)" />
        </div>
        <div className="mt-4 h-5 w-3/4 animate-pulse rounded-full bg-(--border-color)" />
        <div className="mt-4 h-1.5 animate-pulse rounded-full bg-(--border-color)" />
        <div className="mt-3 h-2.5 w-24 animate-pulse rounded-full bg-(--border-color)" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-(--border-color) bg-(--bg-secondary) p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-xs font-semibold text-(--text-primary)">
          <FontAwesomeIcon icon={faRoute} className="text-(--accent-color)" />
          Progress
        </p>
        <span className="font-interface text-xs text-(--text-muted)">
          {completed} of {total} done
        </span>
      </div>

      <p className="mt-3 text-xl font-semibold leading-snug text-(--text-primary)">
        {active.message}
      </p>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-(--bg-tertiary)">
        <div
          className="h-full rounded-full bg-(--accent-color) transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 font-interface text-xs text-(--text-muted)">
        <span>
          Milestone {Math.max(activeIndex + 1, 1)} of {MILESTONES.length}
        </span>
        <span>{pct}%</span>
      </div>
    </div>
  );
}
