import { useState } from "react";
import { faListUl, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
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
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);

  const done = items.filter((i) => i.done).length;
  const total = items.length;

  const add = async () => {
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
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className={fieldLabelClass}>
          <FontAwesomeIcon
            icon={faListUl}
            className="text-[10px] text-(--accent-color)"
          />
          Checklist
        </span>
        {total > 0 && (
          <span className="font-interface text-[11px] font-medium text-(--text-muted)">
            {done}/{total} done
          </span>
        )}
      </div>

      {total > 0 && (
        <div className="flex flex-col">
          {items.map((item) => (
            <div
              key={item.id}
              className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-(--bg-hover)"
            >
              <CheckBox
                checked={item.done}
                disabled={busy || disabled}
                ariaLabel={item.text}
                onToggle={() => onToggle(item.id, !item.done)}
              />
              <span
                className={`min-w-0 flex-1 truncate text-sm ${
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
                className="shrink-0 text-(--text-muted) opacity-0 transition-opacity hover:text-(--color-error) group-hover:opacity-100 focus-visible:opacity-100"
              >
                <FontAwesomeIcon icon={faTrashCan} size="xs" />
              </button>
            </div>
          ))}
        </div>
      )}

      {adding ? (
        <div className="flex items-center gap-2.5 rounded-lg bg-(--bg-primary) px-2 py-1.5">
          <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border border-(--border-color) text-(--text-muted)">
            <FontAwesomeIcon icon={faPlus} size="2xs" />
          </span>
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void add();
              } else if (e.key === "Escape") {
                setValue("");
                setAdding(false);
              }
            }}
            onBlur={() => {
              if (value.trim()) void add();
              setAdding(false);
            }}
            placeholder="Add an item..."
            disabled={disabled || busy}
            className="w-full bg-transparent text-sm text-(--text-primary) outline-none placeholder:text-(--text-muted) disabled:opacity-50"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          disabled={disabled}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left font-interface text-xs font-medium text-(--text-muted) transition-colors hover:bg-(--bg-hover) hover:text-(--accent-strong) disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
          Add checklist item
        </button>
      )}
    </div>
  );
}
