import {
  faCalendarDays,
  faCircleHalfStroke,
  faFlag,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OptionChips from "../ui/OptionChips";
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
  "w-full rounded-lg border border-(--border-color) bg-(--bg-primary) py-2 pl-10 text-sm text-(--text-primary) outline-none transition-colors focus:border-(--accent-color) disabled:opacity-50";

const fieldLabelClass =
  "mb-1.5 flex items-center gap-1.5 font-interface text-xs font-semibold uppercase tracking-widest text-(--text-secondary)";

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
    <div className="flex flex-col gap-5 p-4 sm:p-5">
      <div>
        <label className={fieldLabelClass}>
          <FontAwesomeIcon icon={faTag} className="text-[10px] text-(--accent-color)" />
          Task title
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-xs text-(--text-muted)">
            <FontAwesomeIcon icon={faTag} />
          </span>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            disabled={saving}
            className={inputClass}
          />
        </div>
      </div>

      <OptionChips
        label={
          <>
            <FontAwesomeIcon icon={faCircleHalfStroke} className="text-[10px] text-(--accent-color)" />
            Status
          </>
        }
        options={statusList}
        value={localStatus}
        onChange={setLocalStatus}
        selectedClass={statusColor}
        disabled={saving}
      />

      <OptionChips
        label={
          <>
            <FontAwesomeIcon icon={faFlag} className="text-[10px] text-(--accent-color)" />
            Priority
          </>
        }
        options={priorityList}
        value={localPriority}
        onChange={setLocalPriority}
        selectedClass={priorityColor}
        disabled={saving}
      />

      <div>
        <label className={fieldLabelClass}>
          <FontAwesomeIcon icon={faCalendarDays} className="text-[10px] text-(--accent-color)" />
          Due date
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-xs text-(--text-muted)">
            <FontAwesomeIcon icon={faCalendarDays} />
          </span>
          <input
            type="datetime-local"
            value={localDueDate}
            onChange={(e) => setLocalDueDate(e.target.value)}
            disabled={saving}
            className={`${inputClass} pr-10`}
          />
        </div>
        {dueDateStr && (
          <p className="mt-1 font-interface text-xs text-(--text-muted)">{dueDateStr}</p>
        )}
      </div>
    </div>
  );
}