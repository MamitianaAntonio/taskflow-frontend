import { useEffect, useState } from "react";
import TaskDetailPanel from "./TaskDetailPanel";

export default function TaskDetail({ task, onClose, onUpdate }) {
  const [label, setLabel] = useState(task.label);

  useEffect(() => {
    setLabel(task.label);
  }, [task.label]);

  const dueDateStr = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No date";

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
