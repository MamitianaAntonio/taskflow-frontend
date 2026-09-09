import { useDroppable } from "@dnd-kit/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
      className={`flex h-140 min-w-0 flex-col rounded-xl border transition-colors ${
        isOver
          ? "border-(--accent-muted) bg-(--accent-bg)"
          : "border-(--border-color) bg-(--bg-secondary)"
      }`}
    >
      <div
        className={`flex items-center justify-between rounded-t-xl border-b border-(--border-color) px-3 py-2.5 ${column.headerBg}`}
      >
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={column.icon} className={`text-xs ${column.color}`} />
          <span className="text-xs font-semibold font-interface text-(--text-primary)">
            {column.label}
          </span>
        </div>
        <span
          className={`px-2 py-0.5 text-[10px] font-semibold font-interface ${column.countBg} ${column.color}`}
        >
          {tasks.length}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-x-hidden overflow-y-auto p-2">
        {tasks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-6 text-[11px] font-interface text-(--text-muted)">
            No tasks
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