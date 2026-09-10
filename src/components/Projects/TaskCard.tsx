import { useDraggable } from "@dnd-kit/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faCalendarDay,
  faFlag,
  faGripVertical,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { priorityConfig, statusConfig } from "../../constants/taskConfig";
import { formatRelativeDate } from "../../utils/date";
import type { KanbanTask } from "../../types/todo";

interface TaskCardProps {
  task: KanbanTask;
  draggable?: boolean;
  onClick: (task: KanbanTask) => void;
  onDelete: (taskId: number) => void;
}

const cardAccent: Record<KanbanTask["status"], string> = {
  todo: "border-l-(--color-warning)",
  doing: "border-l-(--accent-color)",
  done: "border-l-(--color-success)",
};

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
      className={`group flex cursor-pointer flex-col gap-2 rounded-lg border border-(--border-color) border-l-4 bg-(--bg-primary) px-3 py-2.5 shadow-sm transition-all duration-200 hover:border-(--accent-muted) hover:shadow-md ${cardAccent[task.status]} ${
        draggable ? "cursor-grab active:cursor-grabbing" : ""
      } ${
        isDragging ? "z-50 opacity-80 shadow-lg ring-2 ring-(--accent-soft)" : ""
      }`}
    >
      <div className="flex items-start gap-2">
        <span className={`mt-0.5 shrink-0 text-xs ${cfg.color}`}>
          <FontAwesomeIcon icon={cfg.icon} />
        </span>

        <p
          className={`min-w-0 flex-1 text-sm font-medium leading-snug transition-colors ${
            task.status === "done"
              ? "text-(--text-secondary) line-through"
              : "text-(--text-primary)"
          }`}
        >
          {task.title}
        </p>

        <span className="flex shrink-0 items-center gap-0.5">
          {task.priority && task.priority !== "low" && (
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-md ${prioCfg.bg} ${prioCfg.color}`}
              title={prioCfg.label}
            >
              <FontAwesomeIcon
                icon={task.priority === "high" ? faBolt : faFlag}
                size="2xs"
              />
            </span>
          )}
          {draggable && (
            <span className="ml-0.5 text-(--text-muted) opacity-0 transition-opacity group-hover:opacity-70">
              <FontAwesomeIcon icon={faGripVertical} size="xs" />
            </span>
          )}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 pl-5">
        <div className="flex min-w-0 items-center gap-2">
          {dateLabel && (
            <span
              className={`inline-flex shrink-0 items-center gap-1 text-[10px] font-interface ${
                task.status === "todo" && dateLabel === "Today"
                  ? "text-(--color-warning)"
                  : dateLabel === "Tomorrow"
                  ? "text-(--color-info)"
                  : "text-(--text-muted)"
              }`}
            >
              <FontAwesomeIcon icon={faCalendarDay} className="text-[9px]" />
              {dateLabel}
            </span>
          )}
          <span
            className={`truncate text-[10px] font-medium font-interface ${prioCfg.color}`}
          >
            {prioCfg.label}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(task.id);
          }}
          className="flex h-5 w-5 items-center justify-center rounded-md text-(--text-muted) opacity-0 transition-all hover:bg-(--bg-tertiary) hover:text-(--color-error) group-hover:opacity-100"
          aria-label="Delete task"
          title="Delete task"
        >
          <FontAwesomeIcon icon={faTrashCan} size="2xs" />
        </button>
      </div>
    </div>
  );
}