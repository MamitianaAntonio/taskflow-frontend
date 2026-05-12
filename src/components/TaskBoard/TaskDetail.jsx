import { useState } from "react";

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

export default function TaskDetail({ task, onClose, onUpdate }) {
  const [label, setLabel] = useState(task.label);

  return (
    <div
      className="border border-(--border-color) rounded-lg p-4 flex flex-col gap-3
      bg-(--bg-secondary)"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-widest text-(--text-tertiary)">
          Task detail
        </span>
        <button
          onClick={onClose}
          className="text-(--text-tertiary) hover:text-(--text-primary)"
        >
          ✕
        </button>
      </div>

      {/* Title editable */}
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onBlur={() => onUpdate(task.id, { label })}
        className="bg-transparent text-sm text-(--text-primary) outline-none
          border-b border-(--border-color) pb-1 focus:border-(--text-primary) transition-colors"
      />

      {/* Status */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-(--text-tertiary) w-16">
          Status
        </span>
        <div className="flex gap-2">
          {["todo", "doing", "done"].map((s) => (
            <button
              key={s}
              onClick={() => onUpdate(task.id, { status: s })}
              className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border transition-all
                ${
                  task.status === s
                    ? statusConfig[s].className
                    : "border-(--border-color) text-(--text-tertiary)"
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Priority */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-(--text-tertiary) w-16">
          Priority
        </span>
        <div className="flex gap-2">
          {["low", "medium", "high"].map((p) => (
            <button
              key={p}
              onClick={() => onUpdate(task.id, { priority: p })}
              className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border transition-all
                ${
                  task.priority === p
                    ? "bg-(--text-primary) text-(--bg-primary) border-(--text-primary)"
                    : "border-(--border-color) text-(--text-tertiary)"
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
