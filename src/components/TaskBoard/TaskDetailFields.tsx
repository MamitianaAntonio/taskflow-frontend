import {
  faAlignLeft,
  faArrowsRotate,
  faCalendarDays,
  faChevronDown,
  faCircleHalfStroke,
  faFlag,
  faFolderOpen,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ChipTabs from "../ui/ChipTabs";
import { repeatHint } from "../../constants/taskConfig";
import { priorityChips, repeatChips, statusChips } from "./taskChips";
import type { Project } from "../../types/project";
import type { RepeatRule, TodoPriority, TodoStatus } from "../../types/todo";

interface TaskDetailFieldsProps {
  localTitle: string;
  setLocalTitle: (value: string) => void;
  localDescription: string;
  setLocalDescription: (value: string) => void;
  localStatus: TodoStatus;
  setLocalStatus: (value: TodoStatus) => void;
  localPriority: TodoPriority;
  setLocalPriority: (value: TodoPriority) => void;
  localDueDate: string;
  setLocalDueDate: (value: string) => void;
  localRepeat: RepeatRule;
  setLocalRepeat: (value: RepeatRule) => void;
  localProjectId: string | null;
  setLocalProjectId: (value: string | null) => void;
  projects: Project[];
  dueDateStr?: string;
  saving: boolean;
}

const inputClass =
  "w-full rounded-lg border border-(--border-color) bg-(--bg-primary) py-2 pl-10 text-sm text-(--text-primary) outline-none transition-colors focus:border-(--accent-color) disabled:opacity-50";

const textareaClass =
  "w-full resize-none rounded-lg border border-(--border-color) bg-(--bg-primary) px-3.5 py-2.5 text-sm leading-relaxed text-(--text-primary) outline-none transition-colors placeholder:text-(--text-muted) focus:border-(--accent-color) disabled:opacity-50";

const fieldLabelClass =
  "mb-1.5 flex items-center gap-1.5 font-interface text-xs font-semibold uppercase tracking-widest text-(--text-secondary)";

const iconSlotClass =
  "pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-xs text-(--text-muted)";

const helperClass = "mt-1 font-interface text-[11px] text-(--text-muted)";

export default function TaskDetailFields({
  localTitle,
  setLocalTitle,
  localDescription,
  setLocalDescription,
  localStatus,
  setLocalStatus,
  localPriority,
  setLocalPriority,
  localDueDate,
  setLocalDueDate,
  localRepeat,
  setLocalRepeat,
  localProjectId,
  setLocalProjectId,
  projects,
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
          <span className={iconSlotClass}>
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

      <div>
        <label className={fieldLabelClass}>
          <FontAwesomeIcon icon={faAlignLeft} className="text-[10px] text-(--accent-color)" />
          Description
        </label>
        <textarea
          rows={3}
          placeholder="Add a description for this task..."
          value={localDescription}
          onChange={(e) => setLocalDescription(e.target.value)}
          disabled={saving}
          className={textareaClass}
        />
      </div>

      <ChipTabs
        label={
          <>
            <FontAwesomeIcon icon={faCircleHalfStroke} className="text-[10px] text-(--accent-color)" />
            Status
          </>
        }
        items={statusChips}
        value={localStatus}
        onChange={setLocalStatus}
        ariaLabel="Status"
        layoutId="task-detail-status"
        disabled={saving}
      />

      <ChipTabs
        label={
          <>
            <FontAwesomeIcon icon={faFlag} className="text-[10px] text-(--accent-color)" />
            Priority
          </>
        }
        items={priorityChips}
        value={localPriority}
        onChange={setLocalPriority}
        ariaLabel="Priority"
        layoutId="task-detail-priority"
        disabled={saving}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={fieldLabelClass}>
            <FontAwesomeIcon icon={faCalendarDays} className="text-[10px] text-(--accent-color)" />
            Due date
          </label>
          <div className="relative">
            <span className={iconSlotClass}>
              <FontAwesomeIcon icon={faCalendarDays} />
            </span>
            <input
              type="datetime-local"
              value={localDueDate}
              onChange={(e) => setLocalDueDate(e.target.value)}
              disabled={saving}
              className={`${inputClass} pr-2`}
            />
          </div>
          {dueDateStr && <p className={helperClass}>{dueDateStr}</p>}
        </div>

        <div>
          <label className={fieldLabelClass}>
            <FontAwesomeIcon icon={faFolderOpen} className="text-[10px] text-(--accent-color)" />
            Project
          </label>
          <div className="relative">
            <span className={iconSlotClass}>
              <FontAwesomeIcon icon={faFolderOpen} />
            </span>
            <select
              value={localProjectId ?? ""}
              onChange={(e) => setLocalProjectId(e.target.value || null)}
              disabled={saving}
              className={`${inputClass} appearance-none pr-9`}
            >
              <option value="">Inbox — no project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex w-9 items-center justify-center text-xs text-(--text-muted)">
              <FontAwesomeIcon icon={faChevronDown} size="2xs" />
            </span>
          </div>
          <p className={helperClass}>
            {projects.length === 0
              ? "Create a project to organize this task there."
              : localProjectId
                ? "Attached to the selected project."
                : "Lives in your inbox."}
          </p>
        </div>
      </div>

      <div>
        <ChipTabs
          label={
            <>
              <FontAwesomeIcon icon={faArrowsRotate} className="text-[10px] text-(--accent-color)" />
              Repeat
            </>
          }
          items={repeatChips}
          value={localRepeat}
          onChange={setLocalRepeat}
          ariaLabel="Repeat"
          layoutId="task-detail-repeat"
          disabled={saving}
        />
        <p className={helperClass}>{repeatHint[localRepeat]}</p>
      </div>
    </div>
  );
}
