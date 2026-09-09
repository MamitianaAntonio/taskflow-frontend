import { useRef, useState, type FormEvent } from "react";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface QuickAddTaskProps {
  onAdd: (title: string) => void;
}

export default function QuickAddTask({ onAdd }: QuickAddTaskProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full items-center gap-2.5 rounded-xl border bg-(--bg-primary) py-1.5 pr-1.5 pl-2 transition-all duration-200 ${
        focused
          ? "border-(--accent-color) ring-2 ring-(--accent-soft)"
          : "border-(--border-color) hover:border-(--text-muted)"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
          focused ? "bg-(--accent-soft)" : "bg-(--bg-tertiary)"
        }`}
      >
        <FontAwesomeIcon
          icon={faAdd}
          className={`text-sm transition-colors duration-200 ${
            focused ? "text-(--accent-strong)" : "text-(--text-muted)"
          }`}
        />
      </span>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Write a task and press Enter"
        className="h-8 min-w-0 flex-1 bg-transparent text-sm font-medium text-(--text-primary) placeholder:font-interface placeholder:text-(--text-muted) outline-none"
      />

      {value.trim() ? (
        <button
          type="submit"
          aria-label="Add task"
          className="flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-(--accent-color) px-3 font-interface text-xs font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-(--accent-strong) active:scale-95"
        >
          Add
        </button>
      ) : (
        <span className="hidden shrink-0 pr-1 font-interface text-[11px] text-(--text-muted) sm:inline">
          Enter ↵
        </span>
      )}
    </form>
  );
}