import { DndContext } from "@dnd-kit/core";
import { columns } from "../../constants/taskConfig";
import DroppableColumn from "./DroppableColumn";

export default function KanbanBoard({ tasks, onTaskClick, onStatusChange, onDelete }) {
  const grouped = {
    todo: tasks.filter((t) => t.status === "todo"),
    doing: tasks.filter((t) => t.status === "doing"),
    done: tasks.filter((t) => t.status === "done"),
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    onStatusChange(taskId, newStatus);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => (
          <DroppableColumn
            key={col.id}
            column={col}
            tasks={grouped[col.id]}
            onTaskClick={onTaskClick}
            onDelete={onDelete}
          />
        ))}
      </div>
    </DndContext>
  );
}
