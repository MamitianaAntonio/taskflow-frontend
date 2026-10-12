import { faListCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Todo } from "../../types/todo";

function getTaskProgress(subtasks: Todo[] = []) {
  const done = subtasks.filter((s) => s.status === "done").length;
  const total = subtasks.length;
  return { done, total, complete: total > 0 && done === total };
}

interface TaskProgressBadgeProps {
  subtasks?: Todo[];
  className?: string;
}

/**
 * Compact "done/total" indicator for a task's subtasks.
 * Renders nothing when the task has no subtasks.
 */
export default function TaskProgressBadge({
  subtasks,
  className = "",
}: TaskProgressBadgeProps) {
  const { done, total, complete } = getTaskProgress(subtasks);
  if (total === 0) return null;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 font-interface text-[10px] font-semibold ${
        complete ? "text-(--color-success)" : "text-(--text-muted)"
      } ${className}`}
      title={`${done} of ${total} subtasks done`}
    >
      <FontAwesomeIcon icon={faListCheck} size="2xs" />
      {done}/{total}
    </span>
  );
}