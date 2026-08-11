import { useDraggable } from "@dnd-kit/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay, faBolt, faFlag, faCircle } from "@fortawesome/free-solid-svg-icons";
import { priorityConfig, statusConfig } from "../../constants/taskConfig";
import { formatRelativeDate } from "../../utils/date";
import CloseButton from "../ui/CloseButton";

export default function TaskCard({ task, onClick, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
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
      className={`group flex items-center gap-3 px-3 py-2 border-b border-l-2 border-(--border-color)
        last:border-b-0 hover:bg-(--bg-secondary) hover:border-(--border-color)
        transition-colors cursor-grab active:cursor-grabbing
        ${isDragging ? "z-9999 opacity-50 shadow-lg ring-2 ring-(--accent-color)/30" : ""}`}
    >
      <span className={`text-sm shrink-0 ${cfg.color}`}>
        <FontAwesomeIcon icon={cfg.icon} />
      </span>

      <p
        className={`flex-1 font-medium text-sm min-w-0 truncate transition-colors
        ${task.status === "done" ? "line-through text-(--text-secondary)" : "text-(--text-primary)"}`}
      >
        {task.title}
      </p>

      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-(--text-muted) font-interface w-20 shrink-0">
        {dateLabel && (
          <>
            <FontAwesomeIcon icon={faCalendarDay} className="text-[10px]" />
            {dateLabel}
          </>
        )}
      </span>

      <span className="hidden sm:flex items-center w-20 shrink-0">
        {task.priority && task.priority !== "low" && (
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold font-interface ${prioCfg.bg} ${prioCfg.color}`}
          >
            <FontAwesomeIcon
              icon={task.priority === "high" ? faBolt : faFlag}
              className="text-[9px]"
            />
            {task.priority}
          </span>
        )}
      </span>

      {/* Delete */}
      <span className="group-hover:inline-flex shrink-0">
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
