import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const statusConfig = {
  todo:  { label: "Todo",  activeClass: "bg-(--color-warning)/12 text-(--color-warning) border-(--color-warning)/30" },
  doing: { label: "Doing", activeClass: "bg-(--accent-color)/12 text-(--accent-color) border-(--accent-color)/30" },
  done:  { label: "Done",  activeClass: "bg-(--color-success)/12 text-(--color-success) border-(--color-success)/30" },
};

const priorityConfig = {
  low:    { label: "Low" },
  medium: { label: "Medium" },
  high:   { label: "High" },
};

const pill = "text-[11px] font-medium px-3 py-1.5 rounded-full border transition-all duration-150 cursor-pointer";
const pillIdle = "border-(--border-color) text-(--text-secondary) hover:border-(--accent-color) hover:text-(--text-primary)";

export default function TaskDetailFields({ task, onUpdate, label, setLabel, dueDateStr }) {
  return (
    <div className="flex flex-col gap-4">

      {/* Title */}
      <div className="rounded-lg border border-(--border-color) bg-(--bg-secondary) p-4">
        <p className="text-[11px] uppercase tracking-[0.08em] text-(--text-tertiary) mb-2">Task title</p>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={() => onUpdate(task.id, { label })}
          className="w-full rounded-md border border-(--border-color) bg-(--bg-primary) px-3.5 py-2.5 text-sm text-(--text-primary) outline-none transition focus:border-(--accent-color)"
        />
      </div>

      {/* Status + Priority */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-(--border-color) bg-(--bg-secondary) p-4">
          <p className="text-[11px] uppercase tracking-[0.08em] text-(--text-tertiary) mb-2">Status</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(statusConfig).map(([s, { label, activeClass }]) => (
              <button
                key={s}
                onClick={() => onUpdate(task.id, { status: s })}
                className={`${pill} ${task.status === s ? activeClass : pillIdle}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-(--border-color) bg-(--bg-secondary) p-4">
          <p className="text-[11px] uppercase tracking-[0.08em] text-(--text-tertiary) mb-2">Priority</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(priorityConfig).map(([p, { label }]) => (
              <button
                key={p}
                onClick={() => onUpdate(task.id, { priority: p })}
                className={`${pill} ${task.priority === p ? "bg-(--text-primary) text-(--bg-primary) border-(--text-primary)" : pillIdle}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Due date */}
      <div className="rounded-lg border border-(--border-color) bg-(--bg-secondary) p-4 flex items-center gap-3">
        <FontAwesomeIcon icon={faCalendar} className="text-sm text-(--text-tertiary)" />
        <p className="text-[11px] uppercase tracking-[0.08em] text-(--text-tertiary)">Due date</p>
        <p className="ml-auto text-sm text-(--text-secondary)">{dueDateStr}</p>
      </div>

    </div>
  );
}