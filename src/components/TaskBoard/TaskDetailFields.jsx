import { faCalendar, faCircleDot, faFlag, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const statusConfig = {
  todo:  { label: "Todo",  activeClass: "bg-(--color-warning)/12 text-(--color-warning) border-(--color-warning)/30", dot: "bg-(--color-warning)" },
  doing: { label: "Doing", activeClass: "bg-(--accent-color)/12 text-(--accent-color) border-(--accent-color)/30", dot: "bg-(--accent-color)" },
  done:  { label: "Done",  activeClass: "bg-(--color-success)/12 text-(--color-success) border-(--color-success)/30", dot: "bg-(--color-success)" },
};

const priorityConfig = {
  low:    { label: "Low",  color: "text-(--color-success)", border: "border-l-(--color-success)" },
  medium: { label: "Medium", color: "text-(--color-warning)", border: "border-l-(--color-warning)" },
  high:   { label: "High", color: "text-(--color-error)", border: "border-l-(--color-error)" },
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
  const priorityLabel = priorityConfig[localPriority]?.label || "Medium";
  const statusLabel = statusConfig[localStatus]?.label || "Todo";

  return (
    <div className="flex flex-col gap-4">

      {/* Title */}
      <div className="rounded-lg border border-(--border-color) bg-(--bg-secondary) p-4 border-l-4 border-l-(--accent-color)">
        <div className="flex items-center gap-2 mb-2">
          <FontAwesomeIcon icon={faTag} className="text-xs text-(--accent-color)" />
          <p className="text-[11px] uppercase tracking-[0.08em] text-(--text-secondary) font-semibold">Task title</p>
        </div>
        <input
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          disabled={saving}
          className="w-full rounded-md border border-(--border-color) bg-(--bg-primary) px-3.5 py-2.5 text-sm text-(--text-primary) outline-none transition focus:border-(--accent-color) disabled:opacity-50"
        />
      </div>

      {/* Status + Priority */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-(--border-color) bg-(--bg-secondary) p-4 border-l-4 border-l-(--color-warning)">
          <div className="flex items-center gap-2 mb-2">
            <FontAwesomeIcon icon={faCircleDot} className="text-xs text-(--color-warning)" />
            <p className="text-[11px] uppercase tracking-[0.08em] text-(--text-secondary) font-semibold">Status</p>
            <span className="ml-auto text-[10px] font-medium text-(--text-secondary) bg-(--bg-primary) px-2 py-0.5 rounded-full border border-(--border-color)">
              {statusLabel}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {Object.entries(statusConfig).map(([s, { label, activeClass, dot }]) => (
              <button
                key={s}
                onClick={() => setLocalStatus(s)}
                disabled={saving}
                className={`${pill} ${localStatus === s ? activeClass : pillIdle} disabled:opacity-50 flex items-center gap-1.5`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-(--border-color) bg-(--bg-secondary) p-4 border-l-4 border-l-(--color-error)">
          <div className="flex items-center gap-2 mb-2">
            <FontAwesomeIcon icon={faFlag} className="text-xs text-(--color-error)" />
            <p className="text-[11px] uppercase tracking-[0.08em] text-(--text-secondary) font-semibold">Priority</p>
            <span className={`ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full border border-(--border-color) bg-(--bg-primary) ${priorityConfig[localPriority]?.color}`}>
              {priorityLabel}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {Object.entries(priorityConfig).map(([p, { label, color }]) => (
              <button
                key={p}
                onClick={() => setLocalPriority(p)}
                disabled={saving}
                className={`${pill} ${localPriority === p ? `bg-(--text-primary) text-(--bg-primary) border-(--text-primary) ${color}` : pillIdle} disabled:opacity-50`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Due date */}
      <div className="rounded-lg border border-(--border-color) bg-(--bg-secondary) p-4 border-l-4 border-l-(--color-success)">
        <div className="flex items-center gap-2 mb-2">
          <FontAwesomeIcon icon={faCalendar} className="text-xs text-(--color-success)" />
          <p className="text-[11px] uppercase tracking-[0.08em] text-(--text-secondary) font-semibold">Due date</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="datetime-local"
            value={localDueDate}
            onChange={(e) => setLocalDueDate(e.target.value)}
            disabled={saving}
            className="flex-1 rounded-md border border-(--border-color) bg-(--bg-primary) px-3.5 py-2.5 text-sm text-(--text-primary) outline-none transition focus:border-(--accent-color) disabled:opacity-50"
          />
        </div>
        <p className="mt-1.5 text-xs text-(--text-secondary) flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-(--color-success)" />
          {dueDateStr}
        </p>
      </div>

    </div>
  );
}
