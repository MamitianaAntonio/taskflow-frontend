import { useDroppable } from "@dnd-kit/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TaskCard from "./TaskCard";

export default function DroppableColumn({ column, tasks, onTaskClick, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col h-140 min-w-0 rounded-xl border transition-colors ${
        isOver
          ? "border-(--accent-color)/40 bg-(--accent-color)/3"
          : "border-(--border-color) bg-(--bg-secondary)/50"
      }`}
    >
      <div className={`flex items-center justify-between px-3 py-2.5 border-b border-(--border-color) ${column.headerBg} rounded-t-xl`}>
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={column.icon} className={`text-xs ${column.color}`} />
          <span className="text-xs font-semibold text-(--text-primary) font-interface">
            {column.label}
          </span>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${column.countBg} ${column.color} font-interface`}>
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-2 p-2 min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        {tasks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-[11px] text-(--text-muted) font-interface py-6">
            No tasks
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  );
}
