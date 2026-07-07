import { useEffect, useState } from "react";
import TaskDetailPanel from "./TaskDetailPanel";

export default function TaskDetail({ task, onClose, onUpdate }) {
  const [label, setLabel] = useState(task.label);

  useEffect(() => {
    setLabel(task.label);
  }, [task.label]);

  const dueDateStr = (() => {
    if (!task.dueDate) return "No date";
    const d = new Date(task.dueDate);
    if (isNaN(d.getTime())) return "No date";
    return d.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  })();

  return (
    <TaskDetailPanel
      task={task}
      onClose={onClose}
      onUpdate={onUpdate}
      label={label}
      setLabel={setLabel}
      dueDateStr={dueDateStr}
    />
  );
}
