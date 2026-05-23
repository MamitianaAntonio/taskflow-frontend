import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const baseClass =
  "w-[70px] px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200";

const statusConfig = {
  todo: {
    label: "Todo",
    className: `
      ${baseClass}
      bg-(--bg-secondary)/80
      text-(--text-secondary)
      border-(--border-color)
      hover:bg-(--bg-secondary)
      `,
  },

  doing: {
    label: "Doing",
    className: `
      ${baseClass}
      bg-(--color-warning)/15
      text-(--color-warning)
      border-(--color-warning)/30
      hover:bg-(--color-warning)/20
      `,
  },

  done: {
    label: "Done",
    className: `
      ${baseClass}
      bg-(--color-success)/15
      text-(--color-success)
      border-(--color-success)/30
      hover:bg-(--color-success)/20
      `,
  },
};

export default function TaskRow({ task, onCycle, onDelete, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group flex items-center gap-4 px-5 py-4 border-b border-(--border-color) last:border-b-0 transition-colors hover:bg-(--bg-primary) cursor-pointer"
    >
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-3xl text-[11px] font-semibold uppercase tracking-[0.22em]
          ${
            task.status === "todo"
              ? "bg-(--bg-secondary)/80 text-(--text-secondary)"
              : task.status === "doing"
              ? "bg-(--color-warning)/20 text-(--color-warning)"
              : "bg-(--color-success)/20 text-(--color-success)"
          }`}
      >
        {task.status[0].toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-semibold text-(--text-primary) truncate ${
            task.status === "done" ? "line-through opacity-50" : ""
          }`}
        >
          {task.label}
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onCycle(task.id);
        }}
        className={statusConfig[task.status].className}
        aria-label="Change status"
      >
        {statusConfig[task.status].label}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 text-(--text-tertiary) hover:text-(--color-danger)"
        aria-label="Delete task"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
}
