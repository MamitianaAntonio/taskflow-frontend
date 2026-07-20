import {
  faXmark,
  faBolt,
  faFlag,
  faCalendarDay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faCircleHalfStroke,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

const priorityConfig = {
  low: { color: "text-(--color-info)", bg: "bg-(--bg-secondary)" },
  medium: { color: "text-(--color-warning)", bg: "bg-(--color-warning)/10" },
  high: { color: "text-(--color-error)", bg: "bg-(--color-error)/10" },
};

const statusConfig = {
  todo: {
    label: "Todo",
    icon: faCircle,
    bar: "border-l-(--color-warning)",
    pill: "bg-(--color-warning)/10 text-(--color-warning) border-(--color-warning)/20",
  },
  doing: {
    label: "Doing",
    icon: faCircleHalfStroke,
    bar: "border-l-(--accent-color)",
    pill: "bg-(--accent-color)/10 text-(--accent-color) border-(--accent-color)/20",
  },
  done: {
    label: "Done",
    icon: faCircleCheck,
    bar: "border-l-(--color-success)",
    pill: "bg-(--color-success)/10 text-(--color-success) border-(--color-success)/20",
  },
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  const now = new Date();
  const today = now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (d.toDateString() === today) return "Today";
  if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function TaskRow({ task, onCycle, onDelete, onClick }) {
  const cfg = statusConfig[task.status];
  const prioCfg = priorityConfig[task.priority] || priorityConfig.medium;
  const dateLabel = formatDate(task.dueDate);

  return (
    <div
      onClick={onClick}
      className={`group flex items-center gap-3 px-4 py-3 border-b border-(--border-color) last:border-b-0 hover:bg-(--bg-secondary)/80
      transition-all cursor-pointer border-l-2 ${cfg.bar}`}
    >
      {/* Status icon */}
      <span
        className={`text-sm ${task.status === "done" ? "text-(--color-success)" : task.status === "doing" ? "text-(--accent-color)" : "text-(--color-warning)"} shrink-0`}
      >
        <FontAwesomeIcon icon={cfg.icon} />
      </span>

      {/* Label */}
      <p
        className={`flex-1 font-medium text-(--text-secondary) text-sm min-w-0 truncate transition-colors
        ${task.status === "done" ? "line-through text-(--text-secondary)" : "text-(--text-primary)"}`}
      >
        {task.label}
      </p>

      {/* Due date */}
      {dateLabel && (
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-(--text-muted) font-interface">
          <FontAwesomeIcon icon={faCalendarDay} className="text-[10px]" />
          {dateLabel}
        </span>
      )}

      {/* Priority badge */}
      {task.priority && task.priority !== "low" && (
        <span
          className={`hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold font-interface ${prioCfg.bg} ${prioCfg.color}`}
        >
          <FontAwesomeIcon
            icon={task.priority === "high" ? faBolt : faFlag}
            className="text-[9px]"
          />
          {task.priority}
        </span>
      )}

      {/* Status pill */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onCycle(task.id);
        }}
        className={`inline-flex items-center gap-1.5 pl-1.5 pr-2.5 py-0.5 rounded-md text-[11px] font-medium border font-interface shrink-0 transition-all hover:brightness-110 ${cfg.pill}`}
        aria-label="Change status"
      >
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
