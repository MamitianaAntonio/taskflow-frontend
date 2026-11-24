import { useState } from "react";
import {
  AlignLeft,
  CalendarDays,
  FolderOpen,
  Save,
  Tag,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import Drawer from "../ui/Drawer";
import Button from "../ui/Button";
import WaveInput from "../ui/WaveInput";
import { toLocalDatetime } from "../../utils/date";
import type { Project, UpdateProjectPayload } from "../../types/project";

interface ProjectEditPanelProps {
  project: Project;
  onClose: () => void;
  onSave: (changes: UpdateProjectPayload) => Promise<void>;
  onDelete: () => Promise<void> | void;
}

const inputClass =
  "w-full rounded-lg border border-(--border-color) bg-(--bg-primary) py-2 pl-10 text-sm text-(--text-primary) outline-none transition-colors focus:border-(--accent-color) disabled:opacity-50";

const textareaClass =
  "w-full resize-none rounded-lg border border-(--border-color) bg-(--bg-primary) px-3.5 py-2.5 text-sm leading-relaxed text-(--text-primary) outline-none transition-colors placeholder:text-(--text-muted) focus:border-(--accent-color) disabled:opacity-50";

const fieldLabelClass =
  "mb-1.5 flex items-center gap-1.5 font-interface text-xs font-semibold uppercase tracking-widest text-(--text-secondary)";

const toDateInput = (value: string | null | undefined) =>
  value ? toLocalDatetime(value).slice(0, 10) : "";

export default function ProjectEditPanel({
  project,
  onClose,
  onSave,
  onDelete,
}: ProjectEditPanelProps) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description ?? "");
  const [dueDate, setDueDate] = useState(() => toDateInput(project.dueDate));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const dirty =
    name !== project.name ||
    description !== (project.description ?? "") ||
    toDateInput(project.dueDate) !== dueDate;

  const handleSave = async () => {
    const changes: UpdateProjectPayload = {};
    if (name !== project.name) changes.name = name.trim();
    if (description !== (project.description ?? "")) changes.description = description;
    if (toDateInput(project.dueDate) !== dueDate) {
      changes.dueDate = dueDate
        ? new Date(`${dueDate}T00:00:00`).toISOString()
        : null;
    }
    if (Object.keys(changes).length === 0) {
      onClose();
      return;
    }

    setSaving(true);
    try {
      await onSave(changes);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this project and its tasks permanently?")) return;
    setDeleting(true);
    try {
      await onDelete();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Drawer
      open
      onClose={onClose}
      title={project.name}
      icon={<FolderOpen size={18} strokeWidth={1.8} aria-hidden="true" />}
      subtitle={
        <span className="font-interface text-xs text-(--text-muted)">
          Give this goal a name, a note and a deadline.
        </span>
      }
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            size="small"
            className="w-full sm:w-auto"
            onClick={onClose}
            icon={<X size={14} strokeWidth={2} aria-hidden="true" />}
            text="Cancel"
            disabled={saving}
          />
          <Button
            variant="primary"
            size="small"
            className="w-full sm:w-auto"
            onClick={handleSave}
            loading={saving}
            disabled={!dirty || !name.trim()}
            icon={<Save size={14} strokeWidth={2} aria-hidden="true" />}
            text="Save changes"
          />
        </div>
      }
    >
      <div className="flex flex-col gap-5 p-4 sm:p-5">
        <div>
          <WaveInput
            label="Project name"
            icon={Tag}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
          />
        </div>

        <div>
          <label className={fieldLabelClass}>
            <AlignLeft
              size={12}
              strokeWidth={2}
              aria-hidden="true"
              className="text-(--accent-color)"
            />
            Description
          </label>
          <textarea
            rows={3}
            placeholder="What is this project about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={saving}
            className={textareaClass}
          />
        </div>

        <div>
          <label className={fieldLabelClass}>
            <CalendarDays
              size={12}
              strokeWidth={2}
              aria-hidden="true"
              className="text-(--accent-color)"
            />
            Deadline
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-(--text-muted)">
              <CalendarDays size={15} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={saving}
              className={`${inputClass} pr-10`}
            />
          </div>
          <p className="mt-1 font-interface text-xs text-(--text-muted)">
            {dueDate ? "Target date for this goal." : "No deadline — clear it if not needed."}
          </p>
        </div>

        <div className="mt-1 border-t border-(--border-color) pt-5">
          <div className="flex items-center gap-2">
            <TriangleAlert
              size={14}
              strokeWidth={2}
              aria-hidden="true"
              className="text-(--color-error)"
            />
            <h3 className="text-xs font-bold uppercase tracking-wide text-(--color-error)">
              Danger zone
            </h3>
          </div>
          <p className="mt-1 font-interface text-xs text-(--text-muted)">
            Permanently deletes this project and all of its tasks. This
            can&apos;t be undone.
          </p>
          <Button
            variant="outline"
            size="small"
            className="mt-3 w-full hover:border-(--color-error) hover:text-(--color-error) sm:w-auto"
            onClick={handleDelete}
            loading={deleting}
            disabled={saving}
            icon={<Trash2 size={14} strokeWidth={2} aria-hidden="true" />}
            text="Delete project"
          />
        </div>
      </div>
    </Drawer>
  );
}