import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faCircleHalfStroke, faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const baseClass =
  "w-[70px] px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200";

const statusConfig = {
  todo: {
    label: "Todo",
    icon: faCircle,
    dot: "bg-(--color-warning)",
    pill: "bg-(--bg-secondary) text-(--color-warning) border-(--border-color)",
  },
  doing: {
    label: "Doing",
    icon: faCircleHalfStroke,
    dot: "bg-(--accent-color)",
    pill: "bg-(--bg-secondary) text-(--accent-color) border-(--border-color)",
  },
  done: {
    label: "Done",
    icon: faCircleCheck,
    dot: "bg-(--color-success)",
    pill: "bg-(--bg-secondary) text-(--color-success) border-(--border-color)",
  },
};

export default function TaskRow ({ task, onCycle, onDelete, onClick }) {
  const cfg = statusConfig[task.status];

  return (
    <div
      onClick={onClick}
      className="group flex items-center gap-3 px-4 py-3 border-b border-(--border-color) last:border-b-0 hover:bg-(--bg-secondary) transition-colors cursor-pointer"
    >
      {/* Status dot */}
      <span className={`size-2 rounded-full shrink-0 ${cfg.dot}`} />

      {/* Label */}
      <p
        className={`flex-1 text-sm min-w-0 truncate transition-colors
        ${
          task.status === "done"
            ? "line-through text-(--text-secondary)"
            : "text-(--text-primary)"
        }`}
      >
        {task.label}
      </p>

      {/* Status pill */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onCycle(task.id);
        }}
        className={`inline-flex items-center gap-1.5 pl-1.5 pr-2.5 py-0.5 rounded-md text-[11px] font-medium border font-interface shrink-0 transition-[filter] hover:brightness-95 ${cfg.pill}`}
        aria-label="Change status"
      >
        <FontAwesomeIcon
          icon={cfg.icon}
          className="text-[11px]"
          aria-hidden="true"
        />
        {cfg.label}
      </button>

      {/* Delete */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-(--text-primary) hover:text-(--color-error) p-1 rounded"
        aria-label="Delete task"
      >
        <FontAwesomeIcon icon={faXmark} className="text-[13px]" />
      </button>
    </div>
  );
}
