import { useState } from "react";
import {
  faListUl,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CheckBox from "../ui/CheckBox";
import type { ChecklistItem } from "../../types/todo";

interface ChecklistSectionProps {
  items: ChecklistItem[];
  disabled?: boolean;
  onAdd: (text: string) => Promise<void>;
  onToggle: (id: string, done: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const fieldLabelClass =
  "flex items-center gap-1.5 font-interface text-xs font-semibold uppercase tracking-widest text-(--text-secondary)";

export default function ChecklistSection({
  items,
  disabled,
  onAdd,
  onToggle,
  onDelete,
}: ChecklistSectionProps) {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);

  const done = items.filter((i) => i.done).length;
  const total = items.length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  const submit = async () => {
    const text = value.trim();
    if (!text || busy) return;
    setBusy(true);
    try {
      await onAdd(text);
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
            icon={faListUl}
            className="text-[10px] text-(--accent-color)"
          />
          Checklist
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
            className="h-full rounded-full bg-(--color-success) transition-[width] duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}

      {total > 0 && (
        <div className="flex flex-col gap-0.5">
          {items.map((item) => (
            <div
              key={item.id}
              className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-(--bg-secondary)"
            >
              <CheckBox
                checked={item.done}
                disabled={busy || disabled}
                ariaLabel={item.text}
                onToggle={() => onToggle(item.id, !item.done)}
              />
              <span
                className={`flex-1 truncate text-sm ${
                  item.done
                    ? "text-(--text-muted) line-through"
                    : "text-(--text-primary)"
                }`}
              >
                {item.text}
              </span>
              <button
                type="button"
                aria-label="Delete checklist item"
                onClick={() => onDelete(item.id)}
                className="text-(--text-muted) opacity-0 transition-all hover:text-(--color-error) group-hover:opacity-100 focus-visible:opacity-100"
              >
                <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
              </button>
            </div>
          ))}
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
          placeholder="Add a checklist item..."
          disabled={disabled || busy}
          className="w-full bg-transparent text-sm text-(--text-primary) outline-none placeholder:text-(--text-muted) disabled:opacity-50"
        />
      </div>
    </div>
  );
}
