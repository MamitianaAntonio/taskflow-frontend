import { useDroppable } from "@dnd-kit/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";
import TaskCard from "./TaskCard";
import type { ColumnConfig } from "../../constants/taskConfig";
import type { KanbanTask } from "../../types/todo";

interface DroppableColumnProps {
  column: ColumnConfig;
  tasks: KanbanTask[];
  draggable?: boolean;
  onTaskClick: (task: KanbanTask) => void;
  onDelete: (taskId: number) => void;
}

export default function DroppableColumn({
  column,
  tasks,
  draggable = true,
  onTaskClick,
  onDelete,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={`flex h-96 min-w-0 flex-col transition-colors ${
        isOver ? "bg-(--accent-bg)" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3 px-3 py-2">
        <span className="flex min-w-0 items-center gap-2">
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${column.color}`}
          />
          <span className="truncate font-interface text-[11px] font-semibold uppercase tracking-widest text-(--text-secondary)">
            {column.label}
          </span>
        </span>
        <span className="shrink-0 font-interface text-[11px] font-medium tabular-nums text-(--text-muted)">
          {tasks.length}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2 pb-2">
        {tasks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-dashed border-(--border-color) py-2.5 text-(--text-muted)">
            <FontAwesomeIcon icon={faInbox} size="2xs" className="opacity-60" />
            <span className="font-interface text-[10px]">No tasks here</span>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              draggable={draggable}
              onClick={onTaskClick}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}