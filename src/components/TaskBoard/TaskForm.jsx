import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTag,
  faCircleHalfStroke,
  faFlag,
  faCalendarDays,
  faXmark,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "../../constants/taskForm";
import Button from "../ui/Button";
import { BadgeGroup, Field } from "../form";
import { toLocalDatetime } from "../../utils/date";

const defaultValues = {
  title: "",
  status: "todo",
  dueDate: toLocalDatetime(new Date()),
  priority: "medium",
};

export default function TaskForm({ onSubmit, onCancel, loading = false }) {
  const [form, setForm] = useState(defaultValues);
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required.";
    if (!form.dueDate) errs.dueDate = "Due date is required.";
    if (Object.keys(errs).length > 0) return setErrors(errs);

    onSubmit?.({
      title: form.title.trim(),
      status: form.status,
      dueDate: new Date(form.dueDate).toISOString(),
      priority: form.priority,
    });
  };

  const handleCancel = () => {
    setForm(defaultValues);
    setErrors({});
    onCancel?.();
  };

  return (
    <div className="p-4 sm:p-6 bg-(--bg-secondary)">
      {/* Title */}
      <Field label="Title" icon={faTag} error={errors.title}>
        <div className="relative">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border outline-none
              bg-(--bg-primary) text-(--text-primary) placeholder:text-(--text-secondary) transition-colors
              ${errors.title
                ? "border-(--color-error) focus:border-(--color-error)"
                : "border-(--border-color) focus:border-(--accent-color)"
              }`}
          />
          <FontAwesomeIcon
            icon={faTag}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-secondary) text-xs pointer-events-none"
          />
        </div>
      </Field>

      {/* Status + Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Status" icon={faCircleHalfStroke}>
          <BadgeGroup
            options={STATUS_OPTIONS}
            value={form.status}
            onChange={(v) => set("status", v)}
          />
        </Field>
        <Field label="Priority" icon={faFlag}>
          <BadgeGroup
            options={PRIORITY_OPTIONS}
            value={form.priority}
            onChange={(v) => set("priority", v)}
          />
        </Field>
      </div>

      {/* Due date */}
      <Field label="Due date" icon={faCalendarDays} error={errors.dueDate}>
        <div className="relative">
          <input
            type="datetime-local"
            value={form.dueDate}
            onChange={(e) => set("dueDate", e.target.value)}
            className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border outline-none
              bg-(--bg-primary) text-(--text-primary) transition-colors
              ${errors.dueDate
                ? "border-(--color-error) focus:border-(--color-error)"
                : "border-(--border-color) focus:border-(--accent-color)"
              }`}
          />
          <FontAwesomeIcon
            icon={faCalendarDays}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-secondary) text-xs pointer-events-none"
          />
        </div>
      </Field>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 mt-2 border-t border-(--border-color)">
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={handleCancel}
          icon={<FontAwesomeIcon icon={faXmark} />}
          text="Cancel"
        />
        <Button
          variant="primary"
          className="w-full sm:w-auto"
          onClick={handleSubmit}
          loading={loading}
          icon={<FontAwesomeIcon icon={faPlus} />}
          text="Create task"
        />
      </div>
    </div>
  );
}
