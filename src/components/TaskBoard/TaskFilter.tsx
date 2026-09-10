import { faFire, faFlag, faListCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SectionLabel from "../ui/SectionLabel";
import { statusConfig } from "../../constants/taskConfig";
import type { TodoStatus } from "../../types/todo";

interface TaskFilterProps {
  selected: "all" | TodoStatus | "overdue" | "priority";
  onChange: (value: "all" | TodoStatus | "overdue" | "priority") => void;
}

const filters = [
  { value: "all" as const, label: "All" },
  { value: "overdue" as const, label: "Overdue", icon: faFire, color: "text-(--color-error)" },
  { value: "priority" as const, label: "High priority", icon: faFlag, color: "text-(--color-warning)" },
  { value: "todo" as const, label: "Todo", icon: statusConfig.todo.icon, color: "text-(--color-warning)" },
  { value: "doing" as const, label: "Doing", icon: statusConfig.doing.icon, color: "text-(--accent-color)" },
  { value: "done" as const, label: "Done", icon: statusConfig.done.icon, color: "text-(--color-success)" },
];

export default function TaskFilter({ selected, onChange }: TaskFilterProps) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5">
        <FontAwesomeIcon icon={faListCheck} className="text-[10px] text-(--accent-color)" />
        <SectionLabel>Filter</SectionLabel>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {filters.map((filter) => {
          const active = selected === filter.value;
          return (
            <button
              key={filter.value}
              onClick={() => onChange(filter.value as typeof selected)}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold font-interface transition-colors ${
                active
                  ? "border-(--accent-color) bg-(--accent-soft) text-(--accent-strong)"
                  : "border-(--border-color) bg-(--bg-primary) text-(--text-muted) hover:border-(--accent-color) hover:text-(--accent-color)"
              }`}
            >
              {filter.icon && (
                <FontAwesomeIcon icon={filter.icon} size="xs" className={active ? "" : filter.color} />
              )}
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}