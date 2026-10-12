import { useEffect, useMemo, useState } from "react";
import TaskDetailPanel from "./TaskDetailPanel";
import { formatDate, toLocalDatetime } from "../../utils/date";
import { useProjectStore } from "../../stores/projectStore";
import type { BoardTask } from "../../types/todo";
import type { UpdateTodoPayload } from "../../types/todo";

interface TaskDetailProps {
  task: BoardTask;
  onClose: () => void;
  onUpdate: (id: string, changes: UpdateTodoPayload) => Promise<void>;
  onDelete?: (id: string) => void | Promise<void>;
  onAddSubtask?: (title: string) => Promise<void>;
  onToggleSubtask?: (id: string, done: boolean) => Promise<void>;
  onDeleteSubtask?: (id: string) => Promise<void>;
}

export default function TaskDetail({
  task,
  onClose,
  onUpdate,
  onDelete,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
}: TaskDetailProps) {
  const projects = useProjectStore((state) => state.projects);
  const fetchProjects = useProjectStore((state) => state.fetchAll);

  const [localTitle, setLocalTitle] = useState(task.label);
  const [localDescription, setLocalDescription] = useState(task.description ?? "");
  const [localStatus, setLocalStatus] = useState(task.status);
  const [localPriority, setLocalPriority] = useState(task.priority);
  const [localDueDate, setLocalDueDate] = useState(() => toLocalDatetime(task.dueDate));
  const [localProjectId, setLocalProjectId] = useState<string | null>(
    task.projectId ?? null,
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (projects.length === 0) fetchProjects().catch(() => {});
  }, [projects.length, fetchProjects]);

  const projectName = useMemo(
    () =>
      task.projectId
        ? (projects.find((p) => p.id === task.projectId)?.name ?? null)
        : null,
    [task.projectId, projects],
  );

  const dirty = useMemo(() => {
    return (
      localTitle !== task.label ||
      localDescription !== (task.description ?? "") ||
      localStatus !== task.status ||
      localPriority !== task.priority ||
      toLocalDatetime(task.dueDate) !== localDueDate ||
      (task.projectId ?? null) !== localProjectId
    );
  }, [localTitle, localDescription, localStatus, localPriority, localDueDate, localProjectId, task]);

  const handleSave = async () => {
    const changes: UpdateTodoPayload = {};
    if (localTitle !== task.label) changes.title = localTitle;
    if (localDescription !== (task.description ?? "")) changes.description = localDescription;
    if (localStatus !== task.status) changes.status = localStatus;
    if (localPriority !== task.priority) changes.priority = localPriority;
    if (toLocalDatetime(task.dueDate) !== localDueDate) {
      changes.dueDate = localDueDate ? new Date(localDueDate).toISOString() : null;
    }
    if ((task.projectId ?? null) !== localProjectId) {
      changes.projectId = localProjectId;
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
      localDescription={localDescription}
      setLocalDescription={setLocalDescription}
      localStatus={localStatus}
      setLocalStatus={setLocalStatus}
      localPriority={localPriority}
      setLocalPriority={setLocalPriority}
      localDueDate={localDueDate}
      setLocalDueDate={setLocalDueDate}
      localProjectId={localProjectId}
      setLocalProjectId={setLocalProjectId}
      projects={projects}
      projectName={projectName}
      dueDateStr={formatDate(task.dueDate)}
      saving={saving}
      dirty={dirty}
      onAddSubtask={onAddSubtask}
      onToggleSubtask={onToggleSubtask}
      onDeleteSubtask={onDeleteSubtask}
    />
  );
}