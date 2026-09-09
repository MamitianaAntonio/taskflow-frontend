import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TaskRow from "./TaskRow";
import TaskFilter from "./TaskFilter";
import EmptyState from "../ui/EmptyState";
import { isOverdue } from "../../utils/date";
import type { BoardTask, TodoStatus } from "../../types/todo";

type BoardFilter = "all" | TodoStatus | "overdue" | "priority";

interface TaskListProps {
  tasks: BoardTask[];
  onUpdate: (task: BoardTask) => Promise<void>;
  onEdit: (task: BoardTask) => void;
  onDelete?: (task: BoardTask) => void;
}

export default function TaskList({ tasks, onUpdate, onEdit, onDelete }: TaskListProps) {
  const [filter, setFilter] = useState<BoardFilter>("all");

  const filtered = tasks.filter((task) => {
    if (filter === "overdue") return isOverdue(task.dueDate) && task.status !== "done";
    if (filter === "priority") return task.priority === "high";
    if (filter === "all") return true;
    return task.status === filter;
  });

  return (
    <div className="flex flex-col gap-3">
      <TaskFilter selected={filter} onChange={setFilter} />

      {filtered.length === 0 ? (
        <EmptyState
          title="No tasks here"
          text="Create a task to get started, or adjust your filters."
        />
      ) : (
        <div>
          <AnimatePresence initial={false}>
            {filtered.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <TaskRow
                  task={{
                    ...task,
                    overdue: isOverdue(task.dueDate) && task.status !== "done",
                  }}
                  onUpdate={onUpdate}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}