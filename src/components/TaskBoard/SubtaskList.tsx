import { useState } from "react";
import {
  faListCheck,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CheckBox from "../ui/CheckBox";
import type { Todo } from "../../types/todo";

interface SubtaskListProps {
  subtasks: Todo[];
  disabled?: boolean;
  onAdd: (title: string) => Promise<void>;
  onToggle: (id: string, done: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const fieldLabelClass =
  "flex items-center gap-1.5 font-interface text-xs font-semibold uppercase tracking-widest text-(--text-secondary)";

export default function SubtaskList({
  subtasks,
  disabled,
  onAdd,
  onToggle,
  onDelete,
}: SubtaskListProps) {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);

  const done = subtasks.filter((s) => s.status === "done").length;
  const total = subtasks.length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  const submit = async () => {
    const title = value.trim();
    if (!title || busy) return;
    setBusy(true);
    try {
      await onAdd(title);
      setValue("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className={fieldLabelClass}>
          <FontAwesomeIcon
            icon={faListCheck}
            className="text-[10px] text-(--accent-color)"
          />
          Subtasks
        </span>
        {total > 0 && (
          <span className="font-interface text-xs font-semibold text-(--text-muted)">
            {done}/{total}
          </span>
        )}
      </div>

      {total > 0 && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-(--bg-tertiary)">
          <div
            className="h-full rounded-full bg-(--accent-color) transition-[width] duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}

      {total > 0 && (
        <div className="flex flex-col gap-0.5">
          {subtasks.map((subtask) => {
            const isDone = subtask.status === "done";
            return (
              <div
                key={subtask.id}
                className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-(--bg-secondary)"
              >
                <CheckBox
                  checked={isDone}
                  disabled={busy || disabled}
                  ariaLabel={subtask.title}
                  onToggle={() => onToggle(subtask.id, !isDone)}
                />
                <span
                  className={`flex-1 truncate text-sm ${
                    isDone
                      ? "text-(--text-muted) line-through"
                      : "text-(--text-primary)"
                  }`}
                >
                  {subtask.title}
                </span>
                <button
                  type="button"
                  aria-label="Delete subtask"
                  onClick={() => onDelete(subtask.id)}
                  className="text-(--text-muted) opacity-0 transition-all hover:text-(--color-error) group-hover:opacity-100 focus-visible:opacity-100"
                >
                  <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-2 rounded-lg border border-(--border-color) bg-(--bg-primary) px-3 py-2 transition-colors focus-within:border-(--accent-color)">
        <FontAwesomeIcon icon={faPlus} className="text-xs text-(--text-muted)" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void submit();
            }
          }}
          placeholder="Add a subtask..."
          disabled={disabled || busy}
          className="w-full bg-transparent text-sm text-(--text-primary) outline-none placeholder:text-(--text-muted) disabled:opacity-50"
        />
      </div>
    </div>
  );
}
