import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faAdd } from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/Button";

export default function QuickAddTask({ onAdd }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd?.(value.trim());
    setValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 bg-(--bg-secondary) border border-(--border-color) rounded-lg px-2 py-2"
    >
      {/* Plus icon */}
      <FontAwesomeIcon
        icon={faPlus}
        className="text-(--text-primary) opacity-30 text-sm shrink-0"
      />

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add a task..."
        className="flex-1 bg-transparent text-sm text-(--text-primary) placeholder:opacity-30 outline-none"
      />

      {/* Add button — always present but invisible when input empty */}
      <Button
        type="submit"
        variant="outline"
        className={`flex items-center gap-1 text-xl font-semibold shrink-0 transition-opacity ${value.trim() ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
      >
        <FontAwesomeIcon icon={faAdd} /> Add
      </Button>
    </form>
  );
}
