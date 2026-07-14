import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTag,
  faCircleHalfStroke,
  faFlag,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "../../constants/taskForm";
import { BadgeGroup, Field } from "../form";

export default function TaskDetailFields({
  localTitle, setLocalTitle,
  localStatus, setLocalStatus,
  localPriority, setLocalPriority,
  localDueDate, setLocalDueDate,
  dueDateStr, saving,
}) {
  return (
    <div className="p-4 sm:p-6 bg-(--bg-secondary)">
      {/* Title */}
      <Field label="Task title" icon={faTag}>
        <div className="relative">
          <FontAwesomeIcon
            icon={faTag}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-secondary) text-xs pointer-events-none"
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
            className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-secondary) text-xs pointer-events-none"
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
