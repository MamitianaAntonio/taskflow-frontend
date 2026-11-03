import { useRef, useState, type FormEvent } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface QuickAddTaskProps {
  onAdd: (title: string) => void;
}

export default function QuickAddTask({ onAdd }: QuickAddTaskProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const title = value.trim();
    if (!title) return;
    onAdd(title);
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-12 w-full items-center gap-3 [border-bottom-width:0.5px] border-(--border-color) transition-colors duration-200 focus-within:border-b-(--accent-color)"
    >
      <FontAwesomeIcon
        icon={faPlus}
        aria-hidden="true"
        className="shrink-0 text-xs text-(--accent-color)"
      />

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Add a task..."
        aria-label="Add a task"
        className="h-full min-w-0 flex-1 border-0 bg-transparent font-interface text-base text-(--text-primary) outline-none placeholder:text-(--text-muted)"
      />

      <kbd className="shrink-0 font-interface text-[11px] text-(--text-muted)">
        Enter
      </kbd>
    </form>
  );
}
