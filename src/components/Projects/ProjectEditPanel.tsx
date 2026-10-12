import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAlignLeft,
  faCalendarDays,
  faFolderOpen,
  faFloppyDisk,
  faTag,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Drawer from "../ui/Drawer";
import Button from "../ui/Button";
import { toLocalDatetime } from "../../utils/date";
import type { Project, UpdateProjectPayload } from "../../types/project";

interface ProjectEditPanelProps {
  project: Project;
  onClose: () => void;
  onSave: (changes: UpdateProjectPayload) => Promise<void>;
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
}: ProjectEditPanelProps) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description ?? "");
  const [dueDate, setDueDate] = useState(() => toDateInput(project.dueDate));
  const [saving, setSaving] = useState(false);

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

  return (
    <Drawer
      open
      onClose={onClose}
      title={project.name}
      icon={faFolderOpen}
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
            icon={<FontAwesomeIcon icon={faXmark} />}
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
            icon={<FontAwesomeIcon icon={faFloppyDisk} />}
            text="Save changes"
          />
        </div>
      }
    >
      <div className="flex flex-col gap-5 p-4 sm:p-5">
        <div>
          <label className={fieldLabelClass}>
            <FontAwesomeIcon icon={faTag} className="text-[10px] text-(--accent-color)" />
            Project name
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-xs text-(--text-muted)">
              <FontAwesomeIcon icon={faTag} />
            </span>
            <input
              type="text"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={fieldLabelClass}>
            <FontAwesomeIcon icon={faAlignLeft} className="text-[10px] text-(--accent-color)" />
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
            <FontAwesomeIcon icon={faCalendarDays} className="text-[10px] text-(--accent-color)" />
            Deadline
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-xs text-(--text-muted)">
              <FontAwesomeIcon icon={faCalendarDays} />
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
      </div>
    </Drawer>
  );
}