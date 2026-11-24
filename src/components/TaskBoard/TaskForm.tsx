import { useState } from "react";
import {
  AlignLeft,
  CalendarDays,
  CircleDashed,
  Flag,
  Plus,
  Repeat,
  Tag,
  X,
} from "lucide-react";
import Button from "../ui/Button";
import ChipTabs from "../ui/ChipTabs";
import WaveInput from "../ui/WaveInput";
import { repeatHint } from "../../constants/taskConfig";
import { priorityChips, repeatChips, statusChips } from "./taskChips";
import { toLocalDatetime } from "../../utils/date";
import type {
  CreateTodoPayload,
  RepeatRule,
  TodoPriority,
  TodoStatus,
} from "../../types/todo";

interface TaskFormProps {
  onSubmit: (payload: CreateTodoPayload) => void;
  onCancel: () => void;
  loading?: boolean;
  /** Values pre-filled on mount, e.g. the day picked on the calendar. */
  initial?: Partial<CreateTodoPayload>;
}

const defaultValues: CreateTodoPayload = {
  title: "",
  description: "",
  status: "todo",
  dueDate: toLocalDatetime(new Date()),
  priority: "medium",
  repeat: "none",
};

type TaskFormField = keyof CreateTodoPayload;

const fieldLabelClass =
  "mb-1.5 flex items-center gap-1.5 font-interface text-xs font-semibold uppercase tracking-widest text-(--text-secondary)";

const inputClass = (hasError?: string) =>
  `w-full rounded-lg border bg-(--bg-primary) py-1.5 pl-9 text-sm text-(--text-primary) outline-none transition-colors placeholder:text-(--text-muted) sm:py-2 sm:pl-10 ${hasError ? "border-(--color-error)" : "border-(--border-color) focus:border-(--accent-color)"
  }`;

const textareaClass = (hasError?: string) =>
  `w-full resize-none rounded-lg border bg-(--bg-primary) px-3 py-2 text-sm leading-relaxed text-(--text-primary) outline-none transition-colors placeholder:text-(--text-muted) sm:px-3.5 sm:py-2.5 ${hasError ? "border-(--color-error)" : "border-(--border-color) focus:border-(--accent-color)"
  }`;

export default function TaskForm({
  onSubmit,
  onCancel,
  loading = false,
  initial,
}: TaskFormProps) {
  const [form, setForm] = useState<CreateTodoPayload>(() => ({
    ...defaultValues,
    ...initial,
  }));
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
      repeat: form.repeat ?? "none",
    });
  };

  const handleCancel = () => {
    setForm(defaultValues);
    setErrors({});
    onCancel();
  };

  return (
    <div className="flex flex-col gap-3.5 p-3.5 pb-0 sm:gap-5 sm:p-5 sm:pb-0">
      <WaveInput
        label="Title"
        icon={Tag}
        value={form.title}
        onChange={(e) => set("title", e.target.value)}
        autoFocus
        error={errors.title}
      />

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
          placeholder="Add a description for this task..."
          value={form.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
          disabled={loading}
          className={textareaClass(errors.description)}
        />
      </div>

      <ChipTabs
        label={
          <>
            <CircleDashed
              size={12}
              strokeWidth={2}
              aria-hidden="true"
              className="text-(--accent-color)"
            />
            Status
          </>
        }
        items={statusChips}
        value={form.status as TodoStatus}
        onChange={(value) => set("status", value)}
        ariaLabel="Status"
        layoutId="task-form-status"
      />

      <ChipTabs
        label={
          <>
            <Flag
              size={12}
              strokeWidth={2}
              aria-hidden="true"
              className="text-(--accent-color)"
            />
            Priority
          </>
        }
        items={priorityChips}
        value={form.priority as TodoPriority}
        onChange={(value) => set("priority", value)}
        ariaLabel="Priority"
        layoutId="task-form-priority"
      />

      <div>
        <label className={fieldLabelClass}>
          <CalendarDays
            size={12}
            strokeWidth={2}
            aria-hidden="true"
            className="text-(--accent-color)"
          />
          Due date
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex w-9 items-center justify-center text-(--text-muted) sm:w-10">
            <CalendarDays size={15} strokeWidth={1.8} aria-hidden="true" />
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

      <ChipTabs<RepeatRule>
        label={
          <>
            <Repeat
              size={12}
              strokeWidth={2}
              aria-hidden="true"
              className="text-(--accent-color)"
            />
            Repeat
          </>
        }
        items={repeatChips}
        value={form.repeat ?? "none"}
        onChange={(value) => setForm((prev) => ({ ...prev, repeat: value }))}
        ariaLabel="Repeat"
        layoutId="task-form-repeat"
      />
      <p className="-mt-2 font-interface text-xs text-(--text-muted)">
        {repeatHint[form.repeat ?? "none"]}
      </p>

      {/* Pinned to the bottom of the sheet so creating a task never needs a scroll. */}
      <div className="sticky bottom-0 -mx-3.5 flex flex-col-reverse gap-2 border-t border-(--border-color) bg-(--bg-secondary) px-3.5 pt-3 pb-3 sm:-mx-5 sm:px-5 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          size="small"
          className="w-full sm:w-auto"
          onClick={handleCancel}
          icon={<X size={14} strokeWidth={2} aria-hidden="true" />}
          text="Cancel"
        />
        <Button
          variant="primary"
          size="small"
          className="w-full sm:w-auto"
          onClick={handleSubmit}
          loading={loading}
          icon={<Plus size={14} strokeWidth={2} aria-hidden="true" />}
          text="Create task"
        />
      </div>
    </div>
  );
}
