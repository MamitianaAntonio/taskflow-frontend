const baseClass =
  "w-[70px] px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200";

const statusConfig = {
  todo: {
    label: "Todo",
    className: `
      ${baseClass}
      bg-(--bg-secondary)/60
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
      className="flex items-center gap-3 px-4 py-3
        border-b border-(--border-color) last:border-b-0
        hover:bg-(--bg-primary) transition-colors group cursor-pointer"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onCycle(task.id);
        }}
        className={`text-[10px] font-mono px-2 py-0.5 rounded-lg shrink-0 transition-all
          ${statusConfig[task.status].className}`}
      >
        {task.status}
      </button>

      <span
        className={`flex-1 text-sm text-(--text-primary) truncate
        ${task.status === "done" ? "line-through opacity-40" : ""}`}
      >
        {task.label}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity
          text-(--text-tertiary) hover:text-(--color-danger) text-sm px-1"
        aria-label="Delete task"
      >
        ✕
      </button>
    </div>
  );
}
