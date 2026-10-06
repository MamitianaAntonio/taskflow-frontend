import { columns } from "../../constants/taskConfig";
import type { TodoStatus } from "../../types/todo";

interface MoveToMenuProps {
  status: TodoStatus;
  onMove: (status: TodoStatus) => void;
}

export default function MoveToMenu({ status, onMove }: MoveToMenuProps) {
  return (
    <select
      value={status}
      aria-label="Move task to"
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => onMove(e.target.value as TodoStatus)}
      className="rounded-md border border-(--border-color) bg-(--bg-tertiary) px-2 py-1 text-xs
      font-medium text-(--text-muted) outline-none focus-visible:ring-2 focus-visible:ring-(--accent-color)"
    >
      {columns.map((col) => (
        <option key={col.id} value={col.id}>
          {col.label}
        </option>
      ))}
    </select>
  );
}
