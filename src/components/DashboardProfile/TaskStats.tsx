import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

interface TaskStatsProps {
  completed?: number;
  incomplete?: number;
  left?: number;
  total?: number;
  isLoading?: boolean;
}

interface ChartColors {
  success: string;
  highlight: string;
  warning: string;
}

const FALLBACK: ChartColors = {
  success: "#10b981",
  highlight: "#ec4599",
  warning: "#f59e0b",
};

function readThemeColors(): ChartColors {
  const s = getComputedStyle(document.documentElement);
  return {
    success: s.getPropertyValue("--color-success").trim() || FALLBACK.success,
    highlight: s.getPropertyValue("--color-highlight").trim() || FALLBACK.highlight,
    warning: s.getPropertyValue("--color-warning").trim() || FALLBACK.warning,
  };
}

const chartColors: ChartColors = readThemeColors();

export default function TaskStats({
  completed = 0,
  incomplete = 0,
  left = 0,
  total = 0,
  isLoading = false,
}: TaskStatsProps) {
  const incompleteValue = Math.max(0, incomplete);
  const leftValue = Math.max(0, left);
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const data = {
    datasets: [
      {
        data: [completed, incompleteValue, leftValue],
        backgroundColor: [chartColors.success, chartColors.highlight, chartColors.warning],
      },
    ],
  };

  const options = {
    cutout: "76%",
    animation: { duration: 800 },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
  };

  const items = [
    {
      label: "Done",
      value: completed,
      color: chartColors.success,
      pct: total > 0 ? (completed / total) * 100 : 0,
    },
    {
      label: "Incomplete",
      value: incompleteValue,
      color: chartColors.highlight,
      pct: total > 0 ? (incompleteValue / total) * 100 : 0,
    },
    {
      label: "Left",
      value: leftValue,
      color: chartColors.warning,
      pct: total > 0 ? (leftValue / total) * 100 : 0,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-3 rounded-lg border border-(--border-color) bg-(--bg-secondary) p-3 shadow-sm">
        <div className="h-3 w-28 animate-pulse rounded-full bg-(--border-color)" />
        <div className="flex items-center gap-3">
          <div className="h-28 w-28 shrink-0 animate-pulse rounded-full bg-(--border-color)" />
          <div className="flex w-full flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-6 w-11 animate-pulse rounded-md bg-(--border-color)" />
                <div className="h-2 w-full animate-pulse rounded-full bg-(--border-color)" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3 rounded-lg border border-(--border-color) bg-(--bg-secondary) p-3 shadow-sm">
      <p className="font-interface text-xs font-semibold uppercase tracking-widest text-(--text-muted)">
        Task breakdown
      </p>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <div className="relative h-28 w-28 shrink-0">
          <Doughnut data={data} options={options} />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-xl leading-none font-bold text-(--text-primary) tabular-nums">
              {pct}%
            </span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-(--text-muted)">
              done
            </span>
          </div>
        </div>

        <div className="flex min-w-0 w-full flex-col gap-2 sm:w-auto sm:flex-1">
          {items.map(({ label, value, color, pct: barPct }) => (
            <div key={label} className="flex items-center gap-2">
              <span
                className="flex h-6 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-md px-1.5"
                style={{ background: `${color}1f` }}
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: color }}
                />
                <span
                  className="font-mono text-xs leading-none font-bold tabular-nums"
                  style={{ color }}
                >
                  {value}
                </span>
              </span>
              <span className="min-w-0 flex-1 truncate text-xs font-medium text-(--text-secondary)">
                {label}
              </span>
              <div className="h-1.5 w-14 shrink-0 overflow-hidden rounded-full bg-(--bg-tertiary)">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${barPct}%`, background: color }}
                />
              </div>
              <span className="w-8 shrink-0 text-right font-mono text-[11px] font-medium text-(--text-muted) tabular-nums">
                {Math.round(barPct)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}