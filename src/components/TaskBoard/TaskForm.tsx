import { useState } from "react";
import {
  faAlignLeft,
  faCalendarDays,
  faCircleHalfStroke,
  faFlag,
  faPlus,
  faTag,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../ui/Button";
import OptionChips from "../ui/OptionChips";
import { priorityColor, priorityList, statusColor, statusList } from "../../constants/taskConfig";
import { toLocalDatetime } from "../../utils/date";
import type { CreateTodoPayload, TodoPriority, TodoStatus } from "../../types/todo";

interface TaskFormProps {
  onSubmit: (payload: CreateTodoPayload) => void;
  onCancel: () => void;
  loading?: boolean;
}

const defaultValues: CreateTodoPayload = {
  title: "",
  description: "",
  status: "todo",
  dueDate: toLocalDatetime(new Date()),
  priority: "medium",
};

type TaskFormField = keyof CreateTodoPayload;

const fieldLabelClass =
  "mb-1.5 flex items-center gap-1.5 font-interface text-xs font-semibold uppercase tracking-widest text-(--text-secondary)";

const inputClass = (hasError?: string) =>
  `w-full rounded-lg border bg-(--bg-primary) py-2 pl-10 text-sm text-(--text-primary) outline-none transition-colors placeholder:text-(--text-muted) ${hasError ? "border-(--color-error)" : "border-(--border-color) focus:border-(--accent-color)"
  }`;

const textareaClass = (hasError?: string) =>
  `w-full resize-none rounded-lg border bg-(--bg-primary) px-3.5 py-2.5 text-sm leading-relaxed text-(--text-primary) outline-none transition-colors placeholder:text-(--text-muted) ${hasError ? "border-(--color-error)" : "border-(--border-color) focus:border-(--accent-color)"
  }`;

export default function TaskForm({ onSubmit, onCancel, loading = false }: TaskFormProps) {
  const [form, setForm] = useState<CreateTodoPayload>(defaultValues);
  const [errors, setErrors] = useState<Partial<Record<TaskFormField, string>>>({});

  const set = (field: TaskFormField, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = () => {
    const errs: Partial<Record<TaskFormField, string>> = {};
    if (!form.title?.trim()) errs.title = "Title is required.";
    if (!form.dueDate) errs.dueDate = "Due date is required.";
    if (Object.keys(errs).length > 0) return setErrors(errs);

    onSubmit({
      title: form.title!.trim(),
      description: form.description?.trim() || undefined,
      status: form.status as TodoStatus,
      dueDate: new Date(form.dueDate!).toISOString(),
      priority: form.priority as TodoPriority,
    });
  };

  const handleCancel = () => {
    setForm(defaultValues);
    setErrors({});
    onCancel();
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-5">
      <div>
        <label className={fieldLabelClass}>
          <FontAwesomeIcon icon={faTag} className="text-[10px] text-(--accent-color)" />
          Title
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-xs text-(--text-muted)">
            <FontAwesomeIcon icon={faTag} />
          </span>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            autoFocus
            className={inputClass(errors.title)}
          />
        </div>
        {errors.title && <p className="mt-1 text-xs text-(--color-error)">{errors.title}</p>}
      </div>

      <div>
        <label className={fieldLabelClass}>
          <FontAwesomeIcon icon={faAlignLeft} className="text-[10px] text-(--accent-color)" />
          Description
        </label>
        <textarea
          rows={3}
          placeholder="Add a description for this task..."
          value={form.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
          disabled={loading}
          className={textareaClass(errors.description)}
        />
      </div>

      <OptionChips
        label={
          <>
            <FontAwesomeIcon icon={faCircleHalfStroke} className="text-[10px] text-(--accent-color)" />
            Status
          </>
        }
        options={statusList}
        value={form.status as TodoStatus}
        onChange={(value) => set("status", value)}
        selectedClass={statusColor}
      />

      <OptionChips
        label={
          <>
            <FontAwesomeIcon icon={faFlag} className="text-[10px] text-(--accent-color)" />
            Priority
          </>
        }
        options={priorityList}
        value={form.priority as TodoPriority}
        onChange={(value) => set("priority", value)}
        selectedClass={priorityColor}
      />

      <div>
        <label className={fieldLabelClass}>
          <FontAwesomeIcon icon={faCalendarDays} className="text-[10px] text-(--accent-color)" />
          Due date
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-xs text-(--text-muted)">
            <FontAwesomeIcon icon={faCalendarDays} />
          </span>
          <input
            type="datetime-local"
            value={form.dueDate ?? ""}
            onChange={(e) => set("dueDate", e.target.value)}
            className={`${inputClass(errors.dueDate)} pr-2`}
          />
        </div>
        {errors.dueDate && <p className="mt-1 text-xs text-(--color-error)">{errors.dueDate}</p>}
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-(--border-color) pt-4 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          size="small"
          className="w-full sm:w-auto"
          onClick={handleCancel}
          icon={<FontAwesomeIcon icon={faXmark} />}
          text="Cancel"
        />
        <Button
          variant="primary"
          size="small"
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
