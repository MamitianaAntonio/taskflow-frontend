import {
  faArrowDown,
  faCheck,
  faCircleXmark,
  faClockFour,
  faFlag,
  faMinus,
  faPenToSquare,
  faTrashCan,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import type { MouseEvent } from "react";
import { formatDate } from "../../utils/date";
import { priorityConfig, statusConfig } from "../../constants/taskConfig";
import type { BoardTask, TodoPriority, TodoStatus } from "../../types/todo";

interface TaskRowProps {
  task: BoardTask;
  onUpdate: (task: BoardTask) => Promise<void>;
  onEdit: (task: BoardTask) => void;
  onDelete?: (task: BoardTask) => void;
}

const rowAccent: Record<TodoStatus, string> = {
  todo: "border-l-(--color-warning)",
  doing: "border-l-(--accent-color)",
  done: "border-l-(--color-success)",
};

const pill: Record<TodoStatus, string> = {
  todo: "border-(--color-warning) bg-(--color-warning-soft) text-(--color-warning)",
  doing: "border-(--accent-muted) bg-(--accent-soft) text-(--accent-strong)",
  done: "border-(--color-success) bg-(--color-success-soft) text-(--color-success)",
};

const priorityIcons: Record<TodoPriority, typeof faFlag> = {
  low: faArrowDown,
  medium: faMinus,
  high: faArrowUp,
};

export default function TaskRow({ task, onUpdate, onEdit, onDelete }: TaskRowProps) {
  const [showActions, setShowActions] = useState(false);
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
    setShowActions(false);
    await onUpdate({ ...task, status: next });
  };

  const saveTitle = async () => {
    const clean = title.trim();
    setIsEditing(false);
    setShowActions(false);
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

  const statusMeta = statusConfig[task.status];

  return (
    <div
      className={`group flex cursor-pointer items-center justify-between gap-2 border-l-4 border-b border-(--border-color) bg-(--bg-secondary) px-3 py-2.5 transition-colors hover:bg-(--bg-hover) ${rowAccent[task.status]}`}
      onClick={() => onEdit(task)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setFlagOpen(false);
      }}
    >
      {isEditing ? (
        <div
          className="flex flex-1 gap-2"
          onClick={(e) => e.stopPropagation()}
        >
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
            className="min-w-0 flex-1 rounded-md border border-(--accent-color) bg-(--bg-primary) px-2 py-1 text-sm text-(--text-primary) outline-none"
          />
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                saveTitle();
              }}
              disabled={!isTitleDirty}
              className="text-(--color-success) hover:text-(--color-success)"
              aria-label="Save"
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                cancelTitle();
              }}
              className="text-(--text-muted) hover:text-(--color-error)"
              aria-label="Cancel"
            >
              <FontAwesomeIcon icon={faCircleXmark} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <button
            onClick={toggleStatus}
            className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
              completed
                ? "border-(--color-success) bg-(--color-success) text-(--text-white)"
                : "border-(--text-muted) text-transparent hover:border-(--accent-color) hover:text-(--accent-color)"
            }`}
            aria-label={completed ? "Mark as not done" : "Mark as done"}
          >
            <FontAwesomeIcon icon={faCheck} size="2xs" />
          </button>

          <div className="min-w-0 flex-1">
            <span
              className={`block truncate text-sm ${
                completed
                  ? "text-(--text-muted) line-through"
                  : "text-(--text-primary)"
              }`}
            >
              {task.label}
            </span>
            {task.dueDate && (
              <span
                className={`flex items-center gap-1 text-[11px] ${
                  task.overdue && !completed
                    ? "text-(--color-error)"
                    : "text-(--text-muted)"
                }`}
              >
                <FontAwesomeIcon icon={faClockFour} size="xs" />
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex shrink-0 items-center gap-1.5">
        {showActions && (
          <>
            <div className="relative" ref={flagRef}>
              <button
                onClick={toggleFlag}
                className="text-(--text-muted) transition-colors hover:text-(--accent-color)"
                aria-label="Change priority"
              >
                <FontAwesomeIcon icon={faFlag} size="xs" />
              </button>
              {flagOpen && (
                <div className="absolute right-0 top-full z-10 mt-1 w-28 rounded-lg border border-(--border-color) bg-(--bg-primary) p-1">
                  {(["low", "medium", "high"] as const).map((priority) => (
                    <button
                      key={priority}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlagOpen(false);
                        setShowActions(false);
                        onUpdate({ ...task, priority });
                      }}
                      className="flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-xs text-(--text-secondary) font-interface hover:bg-(--bg-hover)"
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
                    className="flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-xs text-(--text-muted) font-interface hover:bg-(--bg-hover)"
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
              className="text-(--text-muted) transition-colors hover:text-(--accent-color)"
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
                className="text-(--text-muted) transition-colors hover:text-(--color-error)"
                aria-label="Delete task"
              >
                <FontAwesomeIcon icon={faTrashCan} size="xs" />
              </button>
            )}
          </>
        )}
        {showActions && task.status !== "done" && (
          <span
            className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold font-interface ${pill[task.status]}`}
          >
            <FontAwesomeIcon icon={statusMeta.icon} size="2xs" />
            {statusMeta.label}
          </span>
        )}
      </div>
    </div>
  );
}