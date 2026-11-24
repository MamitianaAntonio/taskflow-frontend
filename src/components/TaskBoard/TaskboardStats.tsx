import type { LucideIcon } from "lucide-react";

interface TaskboardStat {
  label: string;
  value: number;
  icon: LucideIcon;
  bg: string;
  color?: string;
}

interface TaskboardStatsProps {
  stats: TaskboardStat[];
}

export default function TaskboardStats({ stats }: TaskboardStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`flex items-center gap-3 rounded-control px-3 py-2.5 ${stat.bg}`}
          >
            <Icon
              aria-hidden="true"
              size={18}
              strokeWidth={1.8}
              className={stat.color ?? "text-(--accent-color)"}
            />
            <div>
              <p className="font-interface text-[11px] font-medium text-(--text-muted)">
                {stat.label}
              </p>
              <p className="font-mono text-lg leading-none font-bold text-(--text-primary) tabular-nums">
                {stat.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
