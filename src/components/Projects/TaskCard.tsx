import { useDraggable } from "@dnd-kit/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faCalendarDay,
  faCircle,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";
import { priorityConfig, statusConfig } from "../../constants/taskConfig";
import { formatRelativeDate } from "../../utils/date";
import CloseButton from "../ui/CloseButton";
import type { KanbanTask } from "../../types/todo";

interface TaskCardProps {
  task: KanbanTask;
  draggable?: boolean;
  onClick: (task: KanbanTask) => void;
  onDelete: (taskId: number) => void;
}

export default function TaskCard({
  task,
  draggable = true,
  onClick,
  onDelete,
}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
    disabled: !draggable,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  const cfg = statusConfig[task.status] || statusConfig.todo;
  const prioCfg = priorityConfig[task.priority] || priorityConfig.medium;
  const dateLabel = formatRelativeDate(task.dueDate);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(task);
      }}
      className={`group flex cursor-pointer items-center gap-3 rounded-lg border border-(--border-color) bg-(--bg-primary) px-3 py-2 shadow-sm transition-colors hover:border-(--accent-muted) hover:bg-(--bg-tertiary) ${
        draggable ? "cursor-grab active:cursor-grabbing" : ""
      } ${
        isDragging ? "z-50 opacity-70 shadow-lg ring-2 ring-(--accent-soft)" : ""
      }`}
    >
      <span className={`shrink-0 text-sm ${cfg.color}`}>
        <FontAwesomeIcon icon={cfg.icon} />
      </span>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium transition-colors ${
            task.status === "done"
              ? "text-(--text-secondary) line-through"
              : "text-(--text-primary)"
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="mt-0.5 truncate text-xs text-(--text-muted)">{task.description}</p>
        )}
      </div>

      {dateLabel && (
        <span className="hidden w-20 shrink-0 items-center gap-1 text-[11px] font-interface text-(--text-muted) sm:inline-flex">
          <FontAwesomeIcon icon={faCalendarDay} className="text-[10px]" />
          {dateLabel}
        </span>
      )}

      <span className="hidden w-20 shrink-0 items-center sm:flex">
        {task.priority && task.priority !== "low" && (
          <span
            className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold font-interface ${prioCfg.bg} ${prioCfg.color}`}
          >
            <FontAwesomeIcon
              icon={task.priority === "high" ? faBolt : faFlag}
              className="text-[9px]"
            />
            {task.priority}
          </span>
        )}
      </span>

      <span className="shrink-0 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
        <CloseButton
          icon={faCircle}
          size="xs"
          onClose={(e) => {
            e.stopPropagation();
            onDelete?.(task.id);
          }}
        />
      </span>
    </div>
  );
}