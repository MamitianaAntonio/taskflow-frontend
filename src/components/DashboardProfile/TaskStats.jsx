import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
ChartJS.register(ArcElement, Tooltip);

const TaskStats = ({ completed = 0, incomplete = 0, left = 0, total = 0 }) => {
  const incompleteValue = Math.max(0, incomplete);
  const leftValue = Math.max(0, left);
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const [colors, setColors] = useState({
    success: "#22c55e",
    highlight: "#ef4444",
    warning: "#f59e0b",
    bg: "#f5f5f5",
  });

  useEffect(() => {
    const s = getComputedStyle(document.documentElement);
    setColors({
      success: s.getPropertyValue("--color-success").trim() || "#10b981",
      highlight: s.getPropertyValue("--color-highlight").trim() || "#fbcfe8",
      warning: s.getPropertyValue("--color-warning").trim() || "#f59e0b",
      bg: s.getPropertyValue("--bg-secondary").trim(),
    });
  }, []);

  const data = {
    datasets: [
      {
        data: [completed, incompleteValue, leftValue],
        backgroundColor: [colors.success, colors.highlight, colors.warning],
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
      color: colors.success,
      pct: total > 0 ? (completed / total) * 100 : 0,
    },
    {
      label: "Incomplete",
      value: incompleteValue,
      color: colors.highlight,
      pct: total > 0 ? (incompleteValue / total) * 100 : 0,
    },
    {
      label: "Left",
      value: leftValue,
      color: colors.warning,
      pct: total > 0 ? (leftValue / total) * 100 : 0,
    },
  ];

  return (
    <div className="bg-(--bg-secondary) border border-(--border-color) shadow-sm rounded-lg p-3 flex flex-col gap-3 w-full box-border">
      <p className="text-xs font-semibold text-(--text-primary) py-1 opacity-50 uppercase tracking-widest font-interface">
        Task breakdown
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Donut */}
        <div className="relative w-28 h-28 shrink-0">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold font-mono text-(--text-primary) leading-none">
              {pct}%
            </span>
            <span className="text-[10px] text-(--text-primary) opacity-40 mt-0.5">
              done
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0 w-full sm:w-auto">
          {items.map(({ label, value, color, pct: barPct }) => (
            <div key={label} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: color }}
              />
              <span className="text-xs text-(--text-primary) opacity-50 min-w-20 shrink-0 truncate">
                {label}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-(--border-color) overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${barPct}%`, background: color }}
                />
              </div>
              <span className="text-xs font-mono font-medium text-(--text-primary) w-5 text-right shrink-0">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskStats;
