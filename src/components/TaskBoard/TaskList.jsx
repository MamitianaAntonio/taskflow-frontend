import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox, faList } from "@fortawesome/free-solid-svg-icons";
import TaskRow from "./TaskRow";

export default function TaskList({ filtered, cycleStatus, deleteTask, setSelectedTask }) {
  return (
    <div className="rounded-xl border border-(--border-color) bg-(--bg-primary) overflow-hidden w-full flex flex-col shadow-md h-102">

      {/* Header */}
      <div className="flex bg-(--bg-secondary) items-start justify-between px-5 py-4 border-b border-(--border-color)">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-(--accent-color)/10 border border-(--border-color) flex items-center justify-center shrink-0">
            <FontAwesomeIcon icon={faList} className="text-sm text-(--accent-color)" />
          </div>
          <div>
            <p className="text-[15px] font-medium text-(--accent-color)">Tasks</p>
            <p className="text-[11px] text-(--text-secondary) mt-0.5">Click a task to view details</p>
          </div>
        </div>
        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-(--bg-secondary) border border-(--border-color) text-(--text-secondary)">
          {filtered.length} task{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-2 text-(--text-secondary)">
          <FontAwesomeIcon icon={faInbox} className="text-4xl opacity-30" />
          <p className="text-sm font-medium text-(--text-primary)">No tasks found</p>
          <p className="text-xs">No tasks match this filter.</p>
        </div>
      ) : (
        <ul className="overflow-y-auto flex-1 ">
          {filtered.map((task) => (
            <li key={task.id} className="border-b border-b-(--border-color)">
              <TaskRow
                task={task}
                onCycle={cycleStatus}
                onDelete={deleteTask}
                onClick={() => setSelectedTask(task)}
              />
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}