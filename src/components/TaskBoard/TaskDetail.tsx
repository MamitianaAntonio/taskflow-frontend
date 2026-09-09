import { useMemo, useState } from "react";
import TaskDetailPanel from "./TaskDetailPanel";
import { formatDate, toLocalDatetime } from "../../utils/date";
import type { BoardTask } from "../../types/todo";
import type { UpdateTodoPayload } from "../../types/todo";

interface TaskDetailProps {
  task: BoardTask;
  onClose: () => void;
  onUpdate: (id: number, changes: UpdateTodoPayload) => Promise<void>;
  onDelete?: (id: number) => void | Promise<void>;
}

export default function TaskDetail({ task, onClose, onUpdate, onDelete }: TaskDetailProps) {
  const [localTitle, setLocalTitle] = useState(task.label);
  const [localStatus, setLocalStatus] = useState(task.status);
  const [localPriority, setLocalPriority] = useState(task.priority);
  const [localDueDate, setLocalDueDate] = useState(() => toLocalDatetime(task.dueDate));
  const [saving, setSaving] = useState(false);

  const dirty = useMemo(() => {
    return (
      localTitle !== task.label ||
      localStatus !== task.status ||
      localPriority !== task.priority ||
      toLocalDatetime(task.dueDate) !== localDueDate
    );
  }, [localTitle, localStatus, localPriority, localDueDate, task]);

  const handleSave = async () => {
    const changes: UpdateTodoPayload = {};
    if (localTitle !== task.label) changes.title = localTitle;
    if (localStatus !== task.status) changes.status = localStatus;
    if (localPriority !== task.priority) changes.priority = localPriority;
    if (toLocalDatetime(task.dueDate) !== localDueDate) {
      changes.dueDate = localDueDate ? new Date(localDueDate).toISOString() : null;
    }
    if (Object.keys(changes).length === 0) return;

    setSaving(true);
    try {
      await onUpdate(task.id, changes);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setSaving(true);
    try {
      await onDelete(task.id);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <TaskDetailPanel
      task={task}
      onClose={onClose}
      onSave={handleSave}
      onDelete={onDelete ? handleDelete : undefined}
      localTitle={localTitle}
      setLocalTitle={setLocalTitle}
      localStatus={localStatus}
      setLocalStatus={setLocalStatus}
      localPriority={localPriority}
      setLocalPriority={setLocalPriority}
      localDueDate={localDueDate}
      setLocalDueDate={setLocalDueDate}
      dueDateStr={formatDate(task.dueDate)}
      saving={saving}
      dirty={dirty}
    />
  );
}