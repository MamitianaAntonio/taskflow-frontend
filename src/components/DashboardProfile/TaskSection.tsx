import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import type { DashboardTask } from "../../types/todo";

interface TaskSectionProps {
  icon: IconDefinition;
  label: string;
  color: string;
  chip: string;
  tasks: DashboardTask[];
}

export default function TaskSection({
  icon,
  label,
  color,
  chip,
  tasks,
}: TaskSectionProps) {
  const count = tasks.length;
  const overdueCount = tasks.filter((t) => t.overdue).length;

  return (
    <div className="group flex items-center gap-3 rounded-lg border border-(--border-color) bg-(--bg-secondary) p-3 shadow-sm transition-colors duration-200 hover:border-(--accent-muted)">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${chip}`}
      >
        <FontAwesomeIcon icon={icon} className={`text-sm ${color}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-interface text-xs font-semibold text-(--text-secondary)">
            {label}
          </p>
          {overdueCount > 0 && (
            <span className="shrink-0 rounded-full bg-(--color-error-soft) px-2 py-0.5 font-interface text-[9px] font-bold text-(--color-error) tabular-nums">
              {overdueCount} overdue
            </span>
          )}
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <p className={`font-mono text-lg leading-none font-bold ${color} tabular-nums`}>
            {count}
          </p>
          {count === 0 && (
            <p className="font-interface text-[10px] font-medium text-(--text-muted)">
              All clear
            </p>
          )}
        </div>
      </div>
      {count > 0 && (
        <FontAwesomeIcon
          icon={faArrowRight}
          className={`shrink-0 text-xs opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 ${color}`}
        />
      )}
    </div>
  );
}