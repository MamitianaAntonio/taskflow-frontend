import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTag,
  faCircleHalfStroke,
  faFlag,
  faCalendarDays,
  faCircleDot,
  faSpinner,
  faCircleCheck,
  faArrowDown,
  faMinus,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";

const statusList = [
  { value: "todo", label: "Todo", icon: faCircleDot },
  { value: "doing", label: "Doing", icon: faSpinner },
  { value: "done", label: "Done", icon: faCircleCheck },
];

const priorityList = [
  { value: "low", label: "Low", icon: faArrowDown },
  { value: "medium", label: "Medium", icon: faMinus },
  { value: "high", label: "High", icon: faArrowUp },
];

const statusColor = {
  todo: "text-(--color-warning) border-(--color-warning)/30 bg-(--color-warning)/10",
  doing:
    "text-(--accent-color) border-(--accent-color)/30 bg-(--accent-color)/10",
  done: "text-(--color-success) border-(--color-success)/30 bg-(--color-success)/10",
};

const priorityColor = {
  low: "border(--color-success)/30 text-(--color-success) bg-(--color-success)/10",
  medium:
    "border-(--accent-color)/30 text-(--accent-color) bg-(--accent-color)/10",
  high: "border-(--color-warning)/30 text-(--color-warning) bg-(--color-warning)/10",
};

export default function TaskDetailFields({
  localTitle,
  setLocalTitle,
  localStatus,
  setLocalStatus,
  localPriority,
  setLocalPriority,
  localDueDate,
  setLocalDueDate,
  dueDateStr,
  saving,
}) {
  return (
    <div className="p-4 bg-(--bg-secondary)">
      <div className="mb-3">
        <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-(--text-secondary) uppercase tracking-widest font-interface">
          <FontAwesomeIcon
            icon={faTag}
            className="text-[10px] text-(--accent-color)"
          />
          Task title
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            disabled={saving}
            autoFocus
            enterkeyhint="next"
            className="w-full pl-8 pr-3 py-2 min-h-9 text-sm rounded-lg border outline-none
              bg-(--bg-primary) text-(--text-primary) placeholder:text-(--text-secondary) transition-colors
              border-(--border-color) focus:border-(--accent-color) disabled:opacity-50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-(--text-secondary) uppercase tracking-widest font-interface">
            <FontAwesomeIcon
              icon={faCircleHalfStroke}
              className="text-[10px] text-(--accent-color)"
            />
            Status
          </label>
          <div className="flex flex-wrap gap-1.5">
            {statusList.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setLocalStatus(opt.value)}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border font-interface transition-colors
                  ${localStatus === opt.value
                    ? statusColor[opt.value]
                    : "border-(--border-color) text-(--text-muted) hover:border-(--accent-color)/40 hover:text-(--accent-color)"
                  }`}
              >
                <FontAwesomeIcon icon={opt.icon} className="text-[10px]" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-(--text-secondary) uppercase tracking-widest font-interface">
            <FontAwesomeIcon
              icon={faFlag}
              className="text-[10px] text-(--accent-color)"
            />
            Priority
          </label>
          <div className="flex flex-wrap gap-1.5">
            {priorityList.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setLocalPriority(opt.value)}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border font-interface transition-colors
                  ${localPriority === opt.value
                    ? priorityColor[opt.value]
                    : "border-(--border-color) text-(--text-muted) hover:border-(--accent-color)/40 hover:text-(--accent-color)"
                  }`}
              >
                <FontAwesomeIcon icon={opt.icon} className="text-[10px]" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-(--text-secondary) uppercase tracking-widest font-interface">
          <FontAwesomeIcon
            icon={faCalendarDays}
            className="text-[10px] text-(--accent-color)"
          />
          Due date
        </label>
        <div className="relative">
          <FontAwesomeIcon
            icon={faCalendarDays}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-(--text-muted) text-[10px] pointer-events-none"
          />
          <input
            type="datetime-local"
            value={localDueDate}
            onChange={(e) => setLocalDueDate(e.target.value)}
            disabled={saving}
            enterkeyhint="done"
            className="w-full pl-8 pr-3 py-2 min-h-9 text-sm rounded-lg border outline-none
              bg-(--bg-primary) text-(--text-primary) transition-colors
              border-(--border-color) focus:border-(--accent-color) disabled:opacity-50"
          />
        </div>
        {dueDateStr && (
          <p className="mt-0.5 text-[11px] text-(--text-muted)">{dueDateStr}</p>
        )}
      </div>
    </div>
  );
}
