import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faAdd } from "@fortawesome/free-solid-svg-icons";

export default function QuickAddTask({ onAdd }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!value.trim()) return;
    onAdd?.(value.trim());
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-3 rounded-xl border bg-(--bg-primary) px-4 py-2.5 transition-all duration-200
        ${focused ? "border-(--accent-color)/40 ring-1 ring-(--accent-color)/20" : "border-(--border-color) hover:border-(--text-muted)"}`}
    >
      <FontAwesomeIcon
        icon={faAdd}
        className={`text-sm shrink-0 transition-colors duration-200 ${focused ? "text-(--accent-color)" : "text-(--text-muted)"}`}
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Add a task"
        className="flex-1 min-w-0 bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-muted) outline-none"
      />
      {value.trim() && (
        <button
          type="submit"
          className="text-xs font-semibold text-(--accent-color) hover:text-(--text-primary) transition-colors font-interface"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-1 text-[10px]" />
          Add
        </button>
      )}
    </form>
  );
}
