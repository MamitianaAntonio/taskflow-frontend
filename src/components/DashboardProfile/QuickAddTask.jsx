import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faAdd } from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/Button";

export default function QuickAddTask({ onAdd }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd?.(value.trim());
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className={`
          flex items-center gap-3 px-3 py-2 rounded-xl
          bg-(--bg-secondary)
          border transition-all duration-200
          ${focused
            ? "border-(--accent-color)/40 outline-(--accent-color)/8"
            : "border-(--border-color)"
          }
        `}
      >
        {/* Icon */}
        <div className={`shrink-0 transition-colors duration-200 ${focused ? "text-(--accent-color)" : "text-(--text-secondary) opacity-40"}`}>
          <FontAwesomeIcon icon={faPlus} className="text-sm" />
        </div>

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Add a task..."
          className="flex-1 bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-secondary) placeholder:opacity-30 outline-none"
        />

        {/* Character count */}
        {value.length > 0 && (
          <span className="text-[10px] font-mono text-(--text-secondary) opacity-40 shrink-0">
            {value.length}
          </span>
        )}

        {/* Submit */}
        <div className={`shrink-0 transition-all duration-200 ${value.trim() ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
          <Button type="submit" variant="primary" size="small" className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faAdd} className="text-[11px]" />
            Add
          </Button>
        </div>

      </div>
    </form>
  );
}