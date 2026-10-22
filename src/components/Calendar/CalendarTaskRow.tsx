import ProjectBadge from "../ui/ProjectBadge";
import TaskProgressBadge from "../TaskBoard/TaskProgressBadge";
import { isOverdue } from "../../utils/date";
import type { Todo, TodoStatus } from "../../types/todo";

interface CalendarTaskRowProps {
  task: Todo;
  projectName: (id: string | null | undefined) => string | null;
  onOpen: (task: Todo) => void;
}

const STATUS_DOT: Record<TodoStatus, string> = {
  todo: "bg-(--text-muted)",
  doing: "bg-(--accent-color)",
  done: "bg-(--color-success)",
};

/** One scheduled task, shared by the agenda and the day drawer. */
export default function CalendarTaskRow({
  task,
  projectName,
  onOpen,
}: CalendarTaskRowProps) {
  const overdue = task.status !== "done" && isOverdue(task.dueDate);
  const project = task.projectId ? projectName(task.projectId) : null;

  const titleClass = overdue
    ? "text-(--color-error)"
    : task.status === "done"
      ? "text-(--text-muted)"
      : "text-(--text-primary)";

  return (
    <button
      type="button"
      onClick={() => onOpen(task)}
      className="flex w-full items-center gap-2.5 rounded-lg border border-(--border-color) bg-(--bg-secondary) px-3 py-2 text-left transition-colors hover:border-(--accent-muted)"
    >
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[task.status]}`}
        aria-hidden
      />
      <span className={`min-w-0 flex-1 truncate text-sm ${titleClass}`}>
        {task.title}
      </span>
      <TaskProgressBadge subtasks={task.subtasks} />
      {project && <ProjectBadge name={project} />}
    </button>
  );
}
