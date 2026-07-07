import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faAdd } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";

export default function QuickAddTask({ onAdd }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!value.trim()) return;
    onAdd?.(value.trim());
    setValue("");
  };

  return (
    <div className="w-full rounded-lg border border-(--border-color) bg-(--bg-tertiary) p-4 border-l-4 border-l-(--accent-color)">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-md flex items-center justify-center bg-(--accent-color)/15">
          <FontAwesomeIcon icon={faPlus} className="text-[10px] text-(--accent-color)" />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-(--accent-color)">
          Quick add task
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2.5 items-stretch">
        {/* Input */}
        <div
          className={`flex-1 min-w-0 flex items-center gap-2.5 px-3.5 h-11 rounded-lg border bg-(--bg-primary) transition-all duration-150
          ${
            value.length > 0
              ? "border-(--accent-color)/30 ring-1 ring-(--accent-color)/50"
              : "border-(--border-color) hover:border-(--accent-color)/50"
          }`}
        >
          <FontAwesomeIcon
            icon={faAdd}
            className="text-sm shrink-0 text-(--accent-color)"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="New task title…"
            className="flex-1 min-w-0 bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-secondary)/40 outline-none"
          />
          <span
            className={`text-[11px] font-mono text-(--text-secondary) shrink-0 transition-opacity duration-150 ${value.length > 0 ? "opacity-100" : "opacity-0"}`}
          >
            {value.length}
          </span>
        </div>

        {/* Button */}
        <Button
          type="submit"
          size="small"
          variant="outline"
          onClick={handleSubmit}
          className="h-11 w-11 sm:w-auto px-0 sm:px-6 shrink-0"
          icon={<FontAwesomeIcon icon={faPlus} className="text-sm" />}
        >
          <span className="hidden sm:inline">Add task</span>
        </Button>
      </form>
    </div>
  );
}
