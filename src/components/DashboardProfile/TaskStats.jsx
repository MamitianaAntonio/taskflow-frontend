import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
ChartJS.register(ArcElement, Tooltip);

const TaskStats = ({ completed = 18, incomplete = 3, total = 24 }) => {
  const remaining = Math.max(0, total - completed - incomplete);
  const pct = Math.round((completed / total) * 100);

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
        data: [completed, incomplete, remaining],
        backgroundColor: [colors.success, colors.highlight, colors.warning],
      },
    ],
  };

  const options = {
    cutout: "72%",
    animation: { duration: 600 },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
  };

  const items = [
    { label: "Done", value: completed, color: colors.success, pct: (completed / total) * 100 },
    {
      label: "Failed",
      value: incomplete,
      color: colors.highlight,
      pct: (incomplete / total) * 100,
    },
    { label: "Left", value: remaining, color: colors.warning, pct: (remaining / total) * 100 },
  ];

  return (
    <div className="bg-(--bg-secondary) border border-(--border-color) rounded-lg p-5 flex flex-col gap-5 w-full box-border">
      <p className="text-[11px] font-bold text-(--text-primary) opacity-50 uppercase tracking-widest">
        Tasks Statistics
      </p>

      <div className="flex items-center gap-6">
        {/* Donut */}
        <div className="relative w-40 h-40 shrink-0">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold font-mono text-(--text-primary) leading-none">
              {pct}%
            </span>
            <span className="text-[11px] text-(--text-primary) opacity-40 mt-0.5">done</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2.5 flex-1 min-w-0">
          {items.map(({ label, value, color, pct: barPct }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
              <span className="text-xs text-(--text-primary) opacity-50 w-10 shrink-0">
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
