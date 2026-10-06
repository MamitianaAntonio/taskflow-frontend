import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
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

const STATUSES: TodoStatus[] = ["todo", "doing", "done"];

export default function KanbanBoard({
  tasks,
  onTaskClick,
  onStatusChange,
  onDeleteTask,
}: KanbanBoardProps) {
  const isMobile = useIsMobile(768);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);
  const [activeTab, setActiveTab] = useState<TodoStatus>("todo");

  const grouped = Object.fromEntries(
    STATUSES.map((s) => [s, tasks.filter((t) => t.status === s)]),
  ) as Record<TodoStatus, KanbanTask[]>;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(tasks.find((t) => t.id === Number(event.active.id)) ?? null);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null);
    if (!over) return;

    const taskId = Number(active.id);
    const overId = String(over.id);

    const newStatus = STATUSES.includes(overId as TodoStatus)
      ? (overId as TodoStatus)
      : tasks.find((t) => t.id === Number(overId))?.status;

    const task = tasks.find((t) => t.id === taskId);
    if (!newStatus || !task || task.status === newStatus) return;

    onStatusChange(taskId, newStatus);
  };

  const visibleColumns = isMobile
    ? columns.filter((col) => col.id === activeTab)
    : columns;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div
        className="overflow-hidden rounded-2xl bg-(--bg-secondary) shadow-sm
       md:overflow-visible md:rounded-none md:bg-transparent md:shadow-none"
      >
        {isMobile && (
          <div
            role="tablist"
            className="flex gap-1 border-b border-(--border-color) p-1.5"
          >
            {columns.map((col) => {
              const selected = col.id === activeTab;
              return (
                <button
                  key={col.id}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveTab(col.id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-[10px] font-medium transition-colors ${
                    selected
                      ? "bg-(--bg-tertiary) text-(--text-primary) shadow-sm"
                      : "text-(--text-muted)"
                  }`}
                >
                  {col.label}
                  <span
                    className={`rounded-full px-1.5 font-mono text-xs tabular-nums ${col.countBg} ${col.color}`}
                  >
                    {grouped[col.id].length}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4">
          {visibleColumns.map((col) => (
            <div
              key={col.id}
              className="md:overflow-hidden md:rounded-2xl md:bg-(--bg-secondary) md:shadow-sm"
            >
              <DroppableColumn
                isMobile={isMobile}
                column={col}
                tasks={grouped[col.id]}
                draggable={!isMobile}
                onTaskClick={onTaskClick}
                onDelete={onDeleteTask}
              />
            </div>
          ))}
        </div>
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: "ease-out" }}>
        {activeTask ? (
          <TaskCardView
            task={activeTask}
            overlay
            onClick={() => {}}
            onDelete={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
