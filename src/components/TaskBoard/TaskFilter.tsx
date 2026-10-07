import { faFire, faFlag, faListCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SectionLabel from "../ui/SectionLabel";
import ChipTabs, { type ChipTabItem } from "../ui/ChipTabs";
import { statusConfig } from "../../constants/taskConfig";
import type { TodoStatus } from "../../types/todo";

export type TaskFilterValue = "all" | TodoStatus | "overdue" | "priority";

interface TaskFilterProps {
  selected: TaskFilterValue;
  onChange: (value: TaskFilterValue) => void;
}

const FILTERS: ChipTabItem<TaskFilterValue>[] = [
  { id: "all", label: "All" },
  { id: "overdue", label: "Overdue", icon: faFire, iconClassName: "text-(--color-error)" },
  { id: "priority", label: "High priority", icon: faFlag, iconClassName: "text-(--color-warning)" },
  { id: "todo", label: "Todo", icon: statusConfig.todo.icon, iconClassName: "text-(--color-warning)" },
  { id: "doing", label: "Doing", icon: statusConfig.doing.icon, iconClassName: "text-(--accent-color)" },
  { id: "done", label: "Done", icon: statusConfig.done.icon, iconClassName: "text-(--color-success)" },
];

export default function TaskFilter({ selected, onChange }: TaskFilterProps) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5">
        <FontAwesomeIcon icon={faListCheck} className="text-[10px] text-(--accent-color)" />
        <SectionLabel>Filter</SectionLabel>
      </div>

      <ChipTabs items={FILTERS} value={selected} onChange={onChange} ariaLabel="Filter tasks" />
    </div>
  );
}
