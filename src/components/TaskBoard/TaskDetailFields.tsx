import {
  faCalendarDays,
  faCircleHalfStroke,
  faFlag,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { priorityColor, priorityList, statusColor, statusList } from "../../constants/taskConfig";
import type { TodoPriority, TodoStatus } from "../../types/todo";

interface TaskDetailFieldsProps {
  localTitle: string;
  setLocalTitle: (value: string) => void;
  localStatus: TodoStatus;
  setLocalStatus: (value: TodoStatus) => void;
  localPriority: TodoPriority;
  setLocalPriority: (value: TodoPriority) => void;
  localDueDate: string;
  setLocalDueDate: (value: string) => void;
  dueDateStr?: string;
  saving: boolean;
}

const inputClass =
  "w-full rounded-lg border border-(--border-color) bg-(--bg-primary) py-2 text-sm text-(--text-primary) outline-none transition-colors focus:border-(--accent-color) disabled:opacity-50";

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
}: TaskDetailFieldsProps) {
  return (
    <div className="p-4 bg-(--bg-secondary)">
      <div className="mb-3">
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-(--text-secondary) font-interface">
          <FontAwesomeIcon icon={faTag} className="text-[10px] text-(--accent-color)" />
          Task title
        </label>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          disabled={saving}
          autoFocus
          className={`${inputClass} px-4`}
        />
      </div>

      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-(--text-secondary) font-interface">
            <FontAwesomeIcon icon={faCircleHalfStroke} className="text-[10px] text-(--accent-color)" />
            Status
          </label>
          <div className="flex flex-wrap gap-1.5">
            {statusList.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setLocalStatus(opt.value)}
                className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold font-interface transition-colors ${
                  localStatus === opt.value
                    ? statusColor[opt.value]
                    : "border-(--border-color) text-(--text-muted) hover:border-(--accent-color) hover:text-(--accent-color)"
                }`}
              >
                <FontAwesomeIcon icon={opt.icon} className="text-[10px]" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-(--text-secondary) font-interface">
            <FontAwesomeIcon icon={faFlag} className="text-[10px] text-(--accent-color)" />
            Priority
          </label>
          <div className="flex flex-wrap gap-1.5">
            {priorityList.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setLocalPriority(opt.value)}
                className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold font-interface transition-colors ${
                  localPriority === opt.value
                    ? priorityColor[opt.value]
                    : "border-(--border-color) text-(--text-muted) hover:border-(--accent-color) hover:text-(--accent-color)"
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
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-(--text-secondary) font-interface">
          <FontAwesomeIcon icon={faCalendarDays} className="text-[10px] text-(--accent-color)" />
          Due date
        </label>
        <div className="relative">
          <FontAwesomeIcon
            icon={faCalendarDays}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-(--text-muted)"
          />
          <input
            type="datetime-local"
            value={localDueDate}
            onChange={(e) => setLocalDueDate(e.target.value)}
            disabled={saving}
            className={`${inputClass} pl-8`}
          />
        </div>
        {dueDateStr && (
          <p className="mt-0.5 text-[11px] text-(--text-muted)">{dueDateStr}</p>
        )}
      </div>
    </div>
  );
}