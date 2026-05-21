import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPencil } from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/Button";

export default function QuickAddTask({ onAdd }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!value.trim()) return;
    onAdd?.(value.trim());
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2.5 items-stretch">
      {/* Input shell */}
      <div
        className={`
          flex-1 flex items-center gap-2.5 px-3.5 h-11 rounded-lg
          border bg-(--bg-primary) transition-all duration-150
          ${value.length > 0
            ? "border-(--border-color-focus) ring-3 ring-(--ring-color)"
            : "border-(--border-color) hover:border-(--border-color-hover)"
          }
        `}
      >
        <FontAwesomeIcon
          icon={faPencil}
          className={`text-sm shrink-0 transition-colors duration-150 ${
            value.length > 0 ? "text-(--text-secondary)" : "text-(--text-tertiary)"
          }`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="New task title…"
          className="flex-1 bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-tertiary) outline-none"
        />
        <span
          className={`text-[11px] font-mono text-(--text-tertiary) shrink-0 transition-opacity duration-150 ${
            value.length > 0 ? "opacity-100" : "opacity-0"
          }`}
        >
          {value.length}
        </span>
      </div>

      {/* Button */}
      <Button
        type="submit"
        variant="outline"
        onClick={handleSubmit}
        className="rounded-lg h-11 px-4 gap-2"
      >
        <FontAwesomeIcon icon={faPlus} className="text-sm" />
        Add task
      </Button>
    </form>
  );
}