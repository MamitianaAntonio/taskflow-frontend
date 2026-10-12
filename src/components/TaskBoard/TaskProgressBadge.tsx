import { faListCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ChecklistItem, Todo } from "../../types/todo";

function getTaskProgress(
  subtasks: Todo[] = [],
  checklist: ChecklistItem[] = [],
) {
  const done =
    subtasks.filter((s) => s.status === "done").length +
    checklist.filter((c) => c.done).length;
  const total = subtasks.length + checklist.length;
  return { done, total, complete: total > 0 && done === total };
}

interface TaskProgressBadgeProps {
  subtasks?: Todo[];
  checklist?: ChecklistItem[];
  className?: string;
}

/**
 * Compact "done/total" indicator for a task's subtasks + checklist.
 * Renders nothing when the task has neither.
 */
export default function TaskProgressBadge({
  subtasks,
  checklist,
  className = "",
}: TaskProgressBadgeProps) {
  const { done, total, complete } = getTaskProgress(subtasks, checklist);
  if (total === 0) return null;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 font-interface text-[10px] font-semibold ${
        complete ? "text-(--color-success)" : "text-(--text-muted)"
      } ${className}`}
      title={`${done} of ${total} steps done`}
    >
      <FontAwesomeIcon icon={faListCheck} size="2xs" />
      {done}/{total}
    </span>
  );
}
