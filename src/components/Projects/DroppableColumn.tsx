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
      className={`flex h-110 min-w-0 flex-col rounded-xl border transition-all duration-200 ${
        isOver
          ? "-translate-y-0.5 border-(--accent-muted) bg-(--accent-bg) shadow-md shadow-(--shadow)"
          : "border-(--border-color) bg-(--bg-secondary)"
      }`}
    >
      <div
        className={`flex items-center justify-between rounded-t-xl border-b border-(--border-color) px-2.5 py-2 ${column.headerBg} ${
          isOver ? "border-(--accent-muted)" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          <span className={`flex h-6 w-6 items-center justify-center rounded-md ${column.countBg} ${column.color}`}>
            <FontAwesomeIcon icon={column.icon} size="2xs" />
          </span>
          <span className="text-xs font-semibold font-interface text-(--text-primary)">
            {column.label}
          </span>
        </div>
        <span
          className={`rounded-full border border-(--border-color) px-1.5 py-0.5 font-interface text-[10px] font-bold tabular-nums ${column.countBg} ${column.color}`}
          title={`${tasks.length} task${tasks.length !== 1 ? "s" : ""}`}
        >
          {tasks.length}
        </span>
      </div>

      <div
        className={`flex min-h-0 flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto p-2 transition-colors ${
          isOver ? "bg-(--accent-bg)" : ""
        }`}
      >
        {tasks.length === 0 ? (
          <div
            className={`flex flex-1 flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed py-8 font-interface ${
              isOver
                ? "border-(--accent-muted) bg-(--accent-bg)"
                : "border-(--border-color)"
            }`}
          >
            <FontAwesomeIcon
              icon={faInbox}
              className={`text-lg ${column.color} opacity-50`}
            />
            <p className="text-[11px] text-(--text-muted)">
              {isOver ? "Drop tasks here" : "No tasks"}
            </p>
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