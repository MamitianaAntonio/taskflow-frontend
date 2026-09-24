import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { columns } from "../../constants/taskConfig";
import DroppableColumn from "./DroppableColumn";
import { TaskCardView } from "./TaskCard";
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

  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);

  const grouped: Record<TodoStatus, KanbanTask[]> = {
    todo: tasks.filter((t) => t.status === "todo"),
    doing: tasks.filter((t) => t.status === "doing"),
    done: tasks.filter((t) => t.status === "done"),
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(tasks.find((t) => t.id === Number(event.active.id)) ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const taskId = Number(active.id);
    const overId = over.id;

    const overTask = tasks.find((t) => t.id === Number(overId));
    const newStatus: TodoStatus | undefined =
      overId === "todo" || overId === "doing" || overId === "done"
        ? (overId as TodoStatus)
        : overTask?.status;

    if (!newStatus) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    onStatusChange(taskId, newStatus);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="overflow-hidden rounded-2xl border border-(--border-color) bg-(--bg-secondary)">
        <div className="grid grid-cols-1 divide-y divide-(--border-color) md:grid-cols-3 md:divide-x md:divide-y-0">
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
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: "ease-out" }}>
        {activeTask ? (
          <TaskCardView task={activeTask} overlay onClick={() => {}} onDelete={() => {}} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}