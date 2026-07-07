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

export default function TaskDetailFields({
  localTitle, setLocalTitle,
  localStatus, setLocalStatus,
  localPriority, setLocalPriority,
  localDueDate, setLocalDueDate,
  dueDateStr, saving,
}) {
  return (
    <div className="flex flex-col gap-4">

      {/* Title */}
      <div className="rounded-lg border border-(--border-color) bg-(--bg-secondary) p-4">
        <p className="text-[11px] uppercase tracking-[0.08em] text-(--text-tertiary) mb-2">Task title</p>
        <input
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          disabled={saving}
          className="w-full rounded-md border border-(--border-color) bg-(--bg-primary) px-3.5 py-2.5 text-sm text-(--text-primary) outline-none transition focus:border-(--accent-color) disabled:opacity-50"
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
                onClick={() => setLocalStatus(s)}
                disabled={saving}
                className={`${pill} ${localStatus === s ? activeClass : pillIdle} disabled:opacity-50`}
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
                onClick={() => setLocalPriority(p)}
                disabled={saving}
                className={`${pill} ${localPriority === p ? "bg-(--text-primary) text-(--bg-primary) border-(--text-primary)" : pillIdle} disabled:opacity-50`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Due date */}
      <div className="rounded-lg border border-(--border-color) bg-(--bg-secondary) p-4">
        <p className="text-[11px] uppercase tracking-[0.08em] text-(--text-tertiary) mb-2">Due date</p>
        <div className="flex items-center gap-3 mt-2">
          <FontAwesomeIcon icon={faCalendar} className="text-sm text-(--text-tertiary)" />
          <input
            type="datetime-local"
            value={localDueDate}
            onChange={(e) => setLocalDueDate(e.target.value)}
            disabled={saving}
            className="flex-1 rounded-md border border-(--border-color) bg-(--bg-primary) px-3.5 py-2.5 text-sm text-(--text-primary) outline-none transition focus:border-(--accent-color) disabled:opacity-50"
          />
        </div>
        <p className="mt-1.5 text-xs text-(--text-secondary)">{dueDateStr}</p>
      </div>

    </div>
  );
}
