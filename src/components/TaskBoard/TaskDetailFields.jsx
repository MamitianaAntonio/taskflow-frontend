import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTag,
  faCircleHalfStroke,
  faFlag,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "../../constants/taskForm";

function BadgeGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200
            ${value === opt.value
              ? `${opt.classes} scale-105 shadow-sm`
              : "bg-(--bg-primary) border-(--border-color) text-(--text-secondary) hover:border-(--accent-color) hover:text-(--accent-color) hover:scale-105"
            }`}
        >
          {opt.icon && (
            <FontAwesomeIcon icon={opt.icon} className="text-[10px]" />
          )}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Field({ label, icon, children }) {
  return (
    <div className="mb-4">
      <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-(--text-secondary) uppercase tracking-widest">
        {icon && (
          <FontAwesomeIcon icon={icon} className="text-[10px] text-(--accent-color)" />
        )}
        {label}
      </label>
      {children}
    </div>
  );
}

export default function TaskDetailFields({
  localTitle, setLocalTitle,
  localStatus, setLocalStatus,
  localPriority, setLocalPriority,
  localDueDate, setLocalDueDate,
  dueDateStr, saving,
}) {
  return (
    <div>
      {/* Title */}
      <Field label="Task title" icon={faTag}>
        <div className="relative">
          <FontAwesomeIcon
            icon={faTag}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-(--accent-color) text-xs pointer-events-none"
          />
          <input
            type="text"
            placeholder="What needs to be done?"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            disabled={saving}
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border outline-none
              bg-(--bg-primary) text-(--text-primary) placeholder:text-(--text-secondary) transition-colors
              border-(--border-color) focus:border-(--accent-color) disabled:opacity-50"
          />
        </div>
      </Field>

      {/* Status + Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Status" icon={faCircleHalfStroke}>
          <BadgeGroup
            options={STATUS_OPTIONS}
            value={localStatus}
            onChange={setLocalStatus}
          />
        </Field>
        <Field label="Priority" icon={faFlag}>
          <BadgeGroup
            options={PRIORITY_OPTIONS}
            value={localPriority}
            onChange={setLocalPriority}
          />
        </Field>
      </div>

      {/* Due date */}
      <Field label="Due date" icon={faCalendarDays}>
        <div className="relative">
          <FontAwesomeIcon
            icon={faCalendarDays}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-(--accent-color) text-xs pointer-events-none"
          />
          <input
            type="datetime-local"
            value={localDueDate}
            onChange={(e) => setLocalDueDate(e.target.value)}
            disabled={saving}
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border outline-none
              bg-(--bg-primary) text-(--text-primary) transition-colors
              border-(--border-color) focus:border-(--accent-color) disabled:opacity-50"
          />
        </div>
        <p className="mt-1 text-xs text-(--text-secondary)">{dueDateStr}</p>
      </Field>
    </div>
  );
}
