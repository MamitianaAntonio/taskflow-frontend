import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import TaskProgressBadge from "../TaskBoard/TaskProgressBadge";
import {
  WEEKDAYS,
  isSameMonth,
  monthMatrix,
  parseDayKey,
  todayKey,
  type DayKey,
} from "../../utils/calendar";
import { isOverdue } from "../../utils/date";
import type { Todo, TodoStatus } from "../../types/todo";

interface MonthGridProps {
  cursor: Date;
  tasksByDay: Map<DayKey, Todo[]>;
  selectedDay: DayKey | null;
  onSelectDay: (key: DayKey) => void;
  onOpenTask: (task: Todo) => void;
  /** Phone layout: dots instead of task titles. */
  compact: boolean;
  projectName: (id: string | null | undefined) => string | null;
}

const STATUS_DOT: Record<TodoStatus, string> = {
  todo: "bg-(--text-muted)",
  doing: "bg-(--accent-color)",
  done: "bg-(--color-success)",
};

const MAX_VISIBLE = 3;

function titleClass(task: Todo, overdue: boolean) {
  if (task.status === "done") return "text-(--text-muted)";
  if (overdue) return "text-(--color-error)";
  return "text-(--text-secondary)";
}

export default function MonthGrid({
  cursor,
  tasksByDay,
  selectedDay,
  onSelectDay,
  onOpenTask,
  compact,
  projectName,
}: MonthGridProps) {
  const today = todayKey();
  const days = monthMatrix(cursor).flat();

  return (
    <div className="overflow-hidden rounded-xl border border-(--border-color) bg-(--bg-secondary) shadow-sm">
      <div className="grid grid-cols-7 border-b border-(--border-color)">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="px-1 py-2 text-center font-interface text-[10px] font-semibold uppercase tracking-widest text-(--text-muted)"
          >
            {compact ? day.slice(0, 1) : day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((key, index) => {
          const tasks = tasksByDay.get(key) ?? [];
          const date = parseDayKey(key);
          const isToday = key === today;
          const inMonth = isSameMonth(date, cursor);
          const isSelected = key === selectedDay;
          const isLastColumn = index % 7 === 6;
          const isLastRow = index >= days.length - 7;

          const visible = tasks.slice(0, MAX_VISIBLE);
          const hidden = tasks.length - visible.length;
          const projectNameOf = (id: string | null | undefined) =>
            id ? projectName(id) : null;

          return (
            <div
              key={key}
              role="button"
              tabIndex={0}
              aria-label={key}
              onClick={() => onSelectDay(key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectDay(key);
                }
              }}
              className={[
                "flex flex-col gap-1 p-1.5 outline-none transition-colors",
                compact ? "min-h-16" : "min-h-28",
                inMonth ? "" : "bg-(--bg-primary)",
                isLastColumn ? "" : "border-r border-(--border-color)",
                isLastRow ? "" : "border-b border-(--border-color)",
              ].join(" ")}
            >
              <span
                className={[
                  "inline-flex h-5 min-w-5 w-fit items-center justify-center rounded-full px-1 font-interface text-[11px] font-semibold",
                  isToday
                    ? "bg-(--accent-soft) text-(--accent-strong) ring-1 ring-(--accent-color)"
                    : isSelected
                      ? "bg-(--accent-color) text-(--text-white)"
                      : inMonth
                        ? "text-(--text-primary)"
                        : "text-(--text-muted)",
                ].join(" ")}
              >
                {date.getDate()}
              </span>

              {compact ? (
                tasks.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 pt-0.5">
                    {tasks.slice(0, 4).map((task) => (
                      <span
                        key={task.id}
                        className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[task.status]}`}
                      />
                    ))}
                    {tasks.length > 4 && (
                      <span className="font-interface text-[9px] font-semibold text-(--text-muted)">
                        +{tasks.length - 4}
                      </span>
                    )}
                  </div>
                )
              ) : (
                <>
                  {visible.map((task) => {
                    const overdue =
                      task.status !== "done" && isOverdue(task.dueDate);
                    const project = projectNameOf(task.projectId);

                    return (
                      <button
                        key={task.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenTask(task);
                        }}
                        title={project ? `${task.title} · ${project}` : task.title}
                        className="flex w-full items-center gap-1.5 rounded-md px-1 py-0.5 text-left transition-colors hover:bg-(--bg-hover)"
                      >
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[task.status]}`}
                          aria-hidden
                        />
                        <span
                          className={`min-w-0 flex-1 truncate text-[11px] leading-tight ${titleClass(task, overdue)}`}
                        >
                          {task.title}
                        </span>
                        {task.projectId && (
                          <FontAwesomeIcon
                            icon={faFolderOpen}
                            className="shrink-0 text-[8px] text-(--text-muted)"
                          />
                        )}
                        <TaskProgressBadge
                          subtasks={task.subtasks}
                          className="text-[9px]"
                        />
                      </button>
                    );
                  })}

                  {hidden > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDay(key);
                      }}
                      className="rounded-md px-1 py-0.5 text-left font-interface text-[10px] font-semibold text-(--text-muted) transition-colors hover:text-(--accent-color)"
                    >
                      +{hidden} more
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
