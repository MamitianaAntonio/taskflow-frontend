import { useDraggable } from "@dnd-kit/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faFlag,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { priorityConfig, statusCardColor } from "../../constants/taskConfig";
import { formatRelativeDate } from "../../utils/date";
import type { KanbanTask } from "../../types/todo";

interface TaskCardProps {
  task: KanbanTask;
  draggable?: boolean;
  onClick: (task: KanbanTask) => void;
  onDelete: (taskId: number) => void;
}

interface TaskCardViewProps {
  task: KanbanTask;
  overlay?: boolean;
  onClick?: () => void;
  onDelete?: (taskId: number) => void;
}

const priorityIcon = {
  medium: faFlag,
  high: faBolt,
};

export function TaskCardView({
  task,
  overlay = false,
  onClick,
  onDelete,
}: TaskCardViewProps) {
  const prioCfg = priorityConfig[task.priority] || priorityConfig.medium;
  const dateLabel = formatRelativeDate(task.dueDate);
  const isDone = task.status === "done";
  const tint = statusCardColor[task.status];

  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col gap-0.5 rounded-lg px-2.5 py-1.5 ${tint.bg} ${
        overlay
          ? "border border-(--accent-muted) shadow-lg"
          : `border border-transparent transition-colors ${tint.hover}`
      }`}
    >
      <div className="flex items-center gap-1.5">
        <p
          className={`min-w-0 flex-1 truncate rounded text-[13px] font-semibold leading-snug ${
            isDone
              ? "text-(--text-secondary) line-through"
              : "text-(--text-primary)"
          }`}
        >
          {task.title}
        </p>

        <span className="shrink-0 md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(task.id);
            }}
            className="flex h-5 w-5 items-center justify-center rounded text-(--text-muted) transition-colors hover:bg-(--color-error) hover:text-(--text-white)"
            aria-label="Delete task"
            title="Delete task"
          >
            <FontAwesomeIcon icon={faTrashCan} size="2xs" />
          </button>
        </span>
      </div>

      {task.description && (
        <p className="line-clamp-1 text-[11px] leading-relaxed text-(--text-secondary)">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between gap-2">
        <span className="font-interface text-[10px] font-medium text-(--text-muted)">
          {dateLabel || "No date"}
        </span>

        {task.priority && task.priority !== "low" && (
          <span
            className={`inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold ${isDone ? "text-(--text-muted)" : prioCfg.color}`}
          >
            <FontAwesomeIcon
              icon={priorityIcon[task.priority] ?? faFlag}
              size="2xs"
            />
          </span>
        )}
      </div>
    </div>
  );
}

export default function TaskCard({
  task,
  draggable = true,
  onClick,
  onDelete,
}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { task },
    disabled: !draggable,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(task);
      }}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(task);
        }
      }}
      className={`transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-color) ${
        isDragging ? "opacity-60" : ""
      }`}
    >
      <TaskCardView task={task} onDelete={onDelete} />
    </div>
  );
}