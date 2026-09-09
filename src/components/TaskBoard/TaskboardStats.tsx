import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface TaskboardStat {
  label: string;
  value: number;
  icon: IconDefinition;
  bg: string;
  color?: string;
}

interface TaskboardStatsProps {
  stats: TaskboardStat[];
}

export default function TaskboardStats({ stats }: TaskboardStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${stat.bg}`}
        >
          <FontAwesomeIcon
            icon={stat.icon}
            className={`text-base ${stat.color ?? "text-(--accent-color)"}`}
          />
          <div>
            <p className="text-[11px] font-medium text-(--text-muted) font-interface">
              {stat.label}
            </p>
            <p className="text-lg font-extrabold text-(--text-primary)">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}