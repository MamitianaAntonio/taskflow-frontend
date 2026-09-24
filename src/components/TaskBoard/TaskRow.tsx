import {
  faArrowDown,
  faBolt,
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
import { priorityConfig, statusCardColor } from "../../constants/taskConfig";
import type { BoardTask, TodoPriority, TodoStatus } from "../../types/todo";

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

const priorityIndicator = {
  medium: faFlag,
  high: faBolt,
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

  const prioCfg = priorityConfig[task.priority] || priorityConfig.medium;
  const tint = statusCardColor[task.status];
  const isDone = task.status === "done";

  return (
    <div
      className={`group cursor-pointer rounded-lg border border-transparent px-2.5 py-1.5 transition-colors ${tint.bg} ${tint.hover}`}
      onClick={() => onEdit(task)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setFlagOpen(false);
      }}
    >
      <div className="flex min-h-5 items-center gap-1.5">
        {isEditing ? (
          <div
            className="flex flex-1 gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={toggleStatus}
              className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${completed
                ? "border-(--color-success) bg-(--color-success) text-(--text-white)"
                : "border-(--text-muted) text-transparent hover:border-(--accent-color) hover:text-(--accent-color)"
                }`}
              aria-label={completed ? "Mark as not done" : "Mark as done"}
            >
              <FontAwesomeIcon icon={faCheck} size="2xs" />
            </button>
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
              className="min-w-0 flex-1 rounded-md border border-(--accent-color) bg-(--bg-primary) px-2 py-0.5 text-[13px] font-semibold text-(--text-primary) outline-none"
            />
            <span
              className="flex items-center gap-0.5 md:opacity-0 md:group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
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
            <button
              onClick={toggleStatus}
              className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${completed
                ? "border-(--color-success) bg-(--color-success) text-(--text-white)"
                : "border-(--text-muted) text-transparent hover:border-(--accent-color) hover:text-(--accent-color)"
                }`}
              aria-label={completed ? "Mark as not done" : "Mark as done"}
            >
              <FontAwesomeIcon icon={faCheck} size="2xs" />
            </button>

            <p
              className={`min-w-0 flex-1 truncate rounded font-sans text-[13px] font-semibold leading-snug ${
                isDone
                  ? "text-(--text-secondary) line-through"
                  : "text-(--text-primary)"
              }`}
            >
              {task.label}
            </p>

            {showActions && (
              <span className="flex shrink-0 items-center gap-0.5">
                <div className="relative" ref={flagRef}>
                  <button
                    onClick={toggleFlag}
                    className="flex h-5 w-5 items-center justify-center rounded text-(--text-muted) transition-colors hover:bg-(--bg-primary) hover:text-(--accent-color)"
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
                  className="flex h-5 w-5 items-center justify-center rounded text-(--text-muted) transition-colors hover:bg-(--bg-primary) hover:text-(--accent-color)"
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
                    className="flex h-5 w-5 items-center justify-center rounded text-(--text-muted) transition-colors hover:bg-(--color-error) hover:text-(--text-white)"
                    aria-label="Delete task"
                  >
                    <FontAwesomeIcon icon={faTrashCan} size="xs" />
                  </button>
                )}
              </span>
            )}
          </>
        )}
      </div>

      {!isEditing && task.description && (
        <p className="line-clamp-1 pl-6 text-[11px] leading-relaxed text-(--text-secondary)">
          {task.description}
        </p>
      )}

      {!isEditing && (
        <div className="flex items-center justify-between gap-2 pl-6">
          {task.dueDate ? (
            <span
              className={`flex items-center gap-1 font-interface text-[10px] font-medium ${
                task.overdue && !isDone ? "text-(--color-error)" : "text-(--text-muted)"
              }`}
            >
              <FontAwesomeIcon icon={faClockFour} size="2xs" />
              {formatDate(task.dueDate)}
            </span>
          ) : (
            <span className="font-interface text-[10px] font-medium text-(--text-muted)">
              No date
            </span>
          )}

          {task.priority && task.priority !== "low" && (
            <span
              className={`flex shrink-0 items-center gap-1 text-[10px] font-semibold ${isDone ? "text-(--text-muted)" : prioCfg.color}`}
            >
              <FontAwesomeIcon
                icon={priorityIndicator[task.priority] ?? faFlag}
                size="2xs"
              />
            </span>
          )}
        </div>
      )}
    </div>
  );
}