import { useState } from "react";
import {
  faCalendarDays,
  faCircle,
  faCircleHalfStroke,
  faFlag,
  faPlus,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../ui/Button";
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
  status: "todo",
  dueDate: toLocalDatetime(new Date()),
  priority: "medium",
};

type TaskFormField = keyof CreateTodoPayload;

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

  const inputClass = (hasError?: string) =>
    `w-full rounded-lg border bg-(--bg-primary) py-2 text-sm text-(--text-primary) outline-none transition-colors placeholder:text-(--text-muted) ${
      hasError ? "border-(--color-error)" : "border-(--border-color) focus:border-(--accent-color)"
    }`;

  return (
    <div className="p-4 bg-(--bg-secondary)">
      <div className="mb-3">
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-(--text-secondary) font-interface">
          <FontAwesomeIcon icon={faTag} className="text-[10px] text-(--accent-color)" />
          Title
        </label>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          autoFocus
          className={`${inputClass(errors.title)} px-4`}
        />
        {errors.title && <p className="mt-1 text-xs text-(--color-error)">{errors.title}</p>}
      </div>

      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-(--text-secondary) font-interface">
            <FontAwesomeIcon icon={faCircleHalfStroke} className="text-[10px] text-(--accent-color)" />
            Status
          </label>
          <div className="flex flex-wrap gap-1.5">
            {statusList.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => set("status", opt.value)}
                className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold font-interface transition-colors ${
                  form.status === opt.value
                    ? statusColor[opt.value]
                    : "border-(--border-color) text-(--text-muted) hover:border-(--accent-color) hover:text-(--accent-color)"
                }`}
              >
                <FontAwesomeIcon icon={opt.icon} className="text-[10px]" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-(--text-secondary) font-interface">
            <FontAwesomeIcon icon={faFlag} className="text-[10px] text-(--accent-color)" />
            Priority
          </label>
          <div className="flex flex-wrap gap-1.5">
            {priorityList.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => set("priority", opt.value)}
                className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold font-interface transition-colors ${
                  form.priority === opt.value
                    ? priorityColor[opt.value]
                    : "border-(--border-color) text-(--text-muted) hover:border-(--accent-color) hover:text-(--accent-color)"
                }`}
              >
                <FontAwesomeIcon icon={opt.icon} className="text-[10px]" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-(--text-secondary) font-interface">
          <FontAwesomeIcon icon={faCalendarDays} className="text-[10px] text-(--accent-color)" />
          Due date
        </label>
        <div className="relative">
          <FontAwesomeIcon
            icon={faCalendarDays}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-(--text-muted)"
          />
          <input
            type="datetime-local"
            value={form.dueDate ?? ""}
            onChange={(e) => set("dueDate", e.target.value)}
            className={`${inputClass(errors.dueDate)} pl-8`}
          />
        </div>
        {errors.dueDate && <p className="mt-1 text-xs text-(--color-error)">{errors.dueDate}</p>}
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-(--border-color) pt-3 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          size="small"
          className="w-full sm:w-auto"
          onClick={handleCancel}
          icon={<FontAwesomeIcon icon={faCircle} />}
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