import {
  faArrowDown,
  faArrowsRotate,
  faBolt,
  faCalendarDays,
  faCheck,
  faCircleXmark,
  faFlag,
  faListCheck,
  faMinus,
  faPenToSquare,
  faTrashCan,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { formatRelativeDate } from "../../utils/date";
import { priorityConfig, repeatPhrase } from "../../constants/taskConfig";
import type { BoardTask, TodoPriority } from "../../types/todo";

interface TaskRowProps {
  task: BoardTask;
  onUpdate: (task: BoardTask) => Promise<void>;
  onEdit: (task: BoardTask) => void;
  onDelete?: (task: BoardTask) => void;
}

const priorityIcons: Record<TodoPriority, typeof faFlag> = {
  low: faArrowDown,
  medium: faMinus,
  high: faArrowUp,
};

const ACTION_BUTTON =
  "flex h-5 w-5 items-center justify-center rounded text-(--text-muted) transition-colors hover:bg-(--bg-primary) hover:text-(--accent-color)";

const REPEAT_LABEL = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
} as const;

export default function TaskRow({ task, onUpdate, onEdit, onDelete }: TaskRowProps) {
  const [flagOpen, setFlagOpen] = useState(false);
  const [title, setTitle] = useState(task.label);
  const [completed, setCompleted] = useState(task.status === "done");
  const [isEditing, setIsEditing] = useState(false);
  const isTitleDirty = title !== task.label;

  const [lastTaskId, setLastTaskId] = useState(task.id);
  if (lastTaskId !== task.id) {
    setLastTaskId(task.id);
    setTitle(task.label);
    setCompleted(task.status === "done");
  }

  const flagRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLInputElement>(null);

  const toggleStatus = async (e: MouseEvent) => {
    e.stopPropagation();
    const next = completed ? "doing" : "done";
    setCompleted(next === "done");
    await onUpdate({ ...task, status: next });
  };

  const saveTitle = async () => {
    const clean = title.trim();
    setIsEditing(false);
    if (!clean || clean === task.label) {
      setTitle(task.label);
      return;
    }
    setTitle(clean);
    await onUpdate({ ...task, label: clean });
  };

  const cancelTitle = () => {
    setTitle(task.label);
    setIsEditing(false);
  };

  const toggleFlag = (e: MouseEvent) => {
    e.stopPropagation();
    setFlagOpen((v) => !v);
  };

  const cyclePriority = async () => {
    const order = ["low", "medium", "high"] as const;
    const current = order.indexOf(task.priority);
    const next = order[(current + 1) % order.length];
    setFlagOpen(false);
    await onUpdate({ ...task, priority: next });
  };

  const isDone = task.status === "done";
  const isDoing = task.status === "doing";
  const dueLabel = task.dueDate ? formatRelativeDate(task.dueDate) : null;

  const checkboxClass = `mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
    completed
      ? "border-(--color-success) bg-(--color-success) text-(--text-white)"
      : isDoing
        ? "border-(--accent-color) text-transparent hover:bg-(--accent-soft)"
        : "border-(--text-muted) text-transparent hover:border-(--accent-color) hover:text-(--accent-color)"
  }`;

  const meta: ReactNode[] = [];
  if (dueLabel) {
    meta.push(
      <span
        key="due"
        className={
          task.overdue && !isDone ? "text-(--color-error)" : undefined
        }
      >
        <FontAwesomeIcon icon={faCalendarDays} className="mr-1 text-[9px]" />
        {dueLabel}
      </span>,
    );
  }
  if (isDoing) {
    meta.push(
      <span key="status" className="text-(--accent-strong)">
        In progress
      </span>,
    );
  }
  if (task.subtasks && task.subtasks.length > 0) {
    const done = task.subtasks.filter((s) => s.status === "done").length;
    meta.push(
      <span key="progress" className="inline-flex items-center gap-1">
        <FontAwesomeIcon icon={faListCheck} className="text-[9px]" />
        {done}/{task.subtasks.length}
      </span>,
    );
  }
  if (task.repeat && task.repeat !== "none") {
    meta.push(
      <span
        key="repeat"
        className="inline-flex items-center gap-1"
        title={repeatPhrase[task.repeat]}
      >
        <FontAwesomeIcon icon={faArrowsRotate} className="text-[9px]" />
        {REPEAT_LABEL[task.repeat]}
      </span>,
    );
  }
  if (task.priority === "high" && !isDone) {
    meta.push(
      <span key="priority" className="inline-flex items-center gap-1 text-(--color-error)">
        <FontAwesomeIcon icon={faBolt} className="text-[9px]" />
        High
      </span>,
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className="group flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-(--bg-hover)/60 focus:outline-none focus-visible:bg-(--bg-hover)/60"
      onClick={() => onEdit(task)}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEdit(task);
        }
      }}
      onMouseLeave={() => setFlagOpen(false)}
    >
      <button
        onClick={toggleStatus}
        className={checkboxClass}
        aria-label={completed ? "Mark as not done" : "Mark as done"}
      >
        <FontAwesomeIcon icon={faCheck} size="2xs" />
      </button>

      <div className="min-w-0 flex-1">
        {isEditing ? (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <input
              ref={editRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === "Enter") saveTitle();
                if (e.key === "Escape") cancelTitle();
              }}
              onBlur={isTitleDirty ? saveTitle : cancelTitle}
              autoFocus
              className="min-w-0 flex-1 rounded-md border border-(--accent-color) bg-(--bg-primary) px-2 py-0.5 text-[13px] font-medium text-(--text-primary) outline-none"
            />
            <span className="flex items-center gap-0.5">
              <button
                onClick={saveTitle}
                disabled={!isTitleDirty}
                className="flex h-5 w-5 items-center justify-center rounded text-(--color-success) hover:bg-(--color-success-soft)"
                aria-label="Save"
              >
                <FontAwesomeIcon icon={faCheck} size="xs" />
              </button>
              <button
                onClick={cancelTitle}
                className="flex h-5 w-5 items-center justify-center rounded text-(--text-muted) hover:bg-(--color-error-soft) hover:text-(--color-error)"
                aria-label="Cancel"
              >
                <FontAwesomeIcon icon={faCircleXmark} size="xs" />
              </button>
            </span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <p
                className={`min-w-0 flex-1 truncate text-[13px] leading-snug ${
                  isDone
                    ? "text-(--text-muted) line-through"
                    : "font-medium text-(--text-primary)"
                }`}
                title={task.label}
              >
                {task.label}
              </p>

              <span className="flex shrink-0 items-center gap-0.5 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                <div className="relative" ref={flagRef}>
                  <button
                    onClick={toggleFlag}
                    className={ACTION_BUTTON}
                    aria-label="Change priority"
                  >
                    <FontAwesomeIcon icon={faFlag} size="xs" />
                  </button>
                  {flagOpen && (
                    <div className="absolute top-full right-0 z-10 mt-1 w-28 rounded-lg border border-(--border-color) bg-(--bg-primary) p-1">
                      {(["low", "medium", "high"] as const).map((priority) => (
                        <button
                          key={priority}
                          onClick={(e) => {
                            e.stopPropagation();
                            setFlagOpen(false);
                            onUpdate({ ...task, priority });
                          }}
                          className="flex w-full items-center gap-1.5 rounded-md px-2 py-1 font-interface text-xs text-(--text-secondary) hover:bg-(--bg-hover)"
                        >
                          <FontAwesomeIcon
                            icon={priorityIcons[priority]}
                            size="2xs"
                          />
                          {priorityConfig[priority].label}
                        </button>
                      ))}
                      <div className="my-1 border-t border-(--border-color)" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          cyclePriority();
                        }}
                        className="flex w-full items-center gap-1.5 rounded-md px-2 py-1 font-interface text-xs text-(--text-muted) hover:bg-(--bg-hover)"
                      >
                        <FontAwesomeIcon icon={faFlag} size="2xs" />
                        Cycle
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                  }}
                  className={ACTION_BUTTON}
                  aria-label="Edit task"
                >
                  <FontAwesomeIcon icon={faPenToSquare} size="xs" />
                </button>
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task);
                    }}
                    className={`${ACTION_BUTTON} hover:bg-(--color-error) hover:text-(--text-white)`}
                    aria-label="Delete task"
                  >
                    <FontAwesomeIcon icon={faTrashCan} size="xs" />
                  </button>
                )}
              </span>
            </div>

            <div className="mt-1 flex min-h-4 items-center gap-3">
              {task.description && (
                <p className="min-w-0 flex-1 truncate text-[11px] leading-relaxed text-(--text-muted)">
                  {task.description}
                </p>
              )}

              {meta.length > 0 && (
                <div className="ml-auto flex shrink-0 items-center gap-2 font-interface text-[10px] font-medium text-(--text-muted)">
                  {meta.map((item, index) => (
                    <span key={index} className="inline-flex items-center gap-2">
                      {index > 0 && (
                        <span
                          aria-hidden="true"
                          className="text-(--text-muted)/50"
                        >
                          ·
                        </span>
                      )}
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
