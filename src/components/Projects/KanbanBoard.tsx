import {
  DndContext,
  MouseSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { columns } from "../../constants/taskConfig";
import DroppableColumn from "./DroppableColumn";
import { useIsMobile } from "../../hooks/useIsMobile";
import type { KanbanTask, TodoStatus } from "../../types/todo";

interface KanbanBoardProps {
  tasks: KanbanTask[];
  onTaskClick: (task: KanbanTask) => void;
  onStatusChange: (taskId: number, status: TodoStatus) => void;
  onDeleteTask: (taskId: number) => void;
}

export default function KanbanBoard({
  tasks,
  onTaskClick,
  onStatusChange,
  onDeleteTask,
}: KanbanBoardProps) {
  const isMobile = useIsMobile(768);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
  );

  const grouped: Record<TodoStatus, KanbanTask[]> = {
    todo: tasks.filter((t) => t.status === "todo"),
    doing: tasks.filter((t) => t.status === "doing"),
    done: tasks.filter((t) => t.status === "done"),
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = Number(active.id);
    const newStatus = over.id as TodoStatus;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    onStatusChange(taskId, newStatus);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {columns.map((col) => (
          <DroppableColumn
            key={col.id}
            column={col}
            tasks={grouped[col.id]}
            draggable={!isMobile}
            onTaskClick={onTaskClick}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </DndContext>
  );
}