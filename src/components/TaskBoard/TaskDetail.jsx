import { useEffect, useMemo, useState } from "react";
import TaskDetailPanel from "./TaskDetailPanel";

function toLocalDatetime(date) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default function TaskDetail({ task, onClose, onUpdate }) {
  const [localTitle, setLocalTitle] = useState(task.label);
  const [localStatus, setLocalStatus] = useState(task.status);
  const [localPriority, setLocalPriority] = useState(task.priority);
  const [localDueDate, setLocalDueDate] = useState(() => toLocalDatetime(task.dueDate));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalTitle(task.label);
    setLocalStatus(task.status);
    setLocalPriority(task.priority);
    setLocalDueDate(toLocalDatetime(task.dueDate));
  }, [task]);

  const dirty = useMemo(() => {
    if (localTitle !== task.label) return true;
    if (localStatus !== task.status) return true;
    if (localPriority !== task.priority) return true;
    const origDue = toLocalDatetime(task.dueDate);
    if (localDueDate !== origDue) return true;
    return false;
  }, [localTitle, localStatus, localPriority, localDueDate, task]);

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

  const handleSave = async () => {
    const changes = {};
    if (localTitle !== task.label) changes.title = localTitle;
    if (localStatus !== task.status) changes.status = localStatus;
    if (localPriority !== task.priority) changes.priority = localPriority;
    const origDue = toLocalDatetime(task.dueDate);
    if (localDueDate !== origDue) changes.dueDate = localDueDate ? new Date(localDueDate).toISOString() : null;

    if (Object.keys(changes).length === 0) return;

    setSaving(true);
    try {
      await onUpdate(task.id, changes);
    } finally {
      setSaving(false);
    }
  };

  return (
    <TaskDetailPanel
      task={task}
      onClose={onClose}
      onSave={handleSave}
      localTitle={localTitle}
      setLocalTitle={setLocalTitle}
      localStatus={localStatus}
      setLocalStatus={setLocalStatus}
      localPriority={localPriority}
      setLocalPriority={setLocalPriority}
      localDueDate={localDueDate}
      setLocalDueDate={setLocalDueDate}
      dueDateStr={dueDateStr}
      saving={saving}
      dirty={dirty}
    />
  );
}
