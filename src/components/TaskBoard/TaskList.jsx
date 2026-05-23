import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TaskRow from "./TaskRow";
import { faInbox } from "@fortawesome/free-solid-svg-icons";

export default function TaskList({ filtered, cycleStatus, deleteTask, setSelectedTask }) {
  return (
    <div className="rounded-lg border border-(--border-color) bg-(--bg-secondary) overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-(--border-color) bg-(--accent-color)">
        <h2 className="text-sm font-semibold text-(--text-white)">Tasks</h2>
        <p className="mt-1 text-xs text-(--text-white)">
          Click a task to view details
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-(--text-secondary)">
          <FontAwesomeIcon
            icon={faInbox}
            className="mx-auto mb-4 text-3xl opacity-40"
          />
          <p>No tasks match this filter.</p>
        </div>
      ) : (
        filtered.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onCycle={cycleStatus}
            onDelete={deleteTask}
            onClick={() => setSelectedTask(task)}
          />
        ))
      )}
    </div>
  );
}
