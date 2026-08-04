import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";
import TaskRow from "./TaskRow";
import TaskFilter from "./TaskFilter";

export default function TaskList({
  filtered,
  cycleStatus,
  deleteTask,
  setSelectedTask,
  filter,
  setFilter,
  tasks,
}) {
  return (
    <div className="shadow-sm rounded-xl border border-(--border-color)
     bg-(--bg-primary) overflow-hidden w-full flex flex-col h-115">
      <div className="flex bg-(--bg-secondary) items-center justify-between px-3 py-2 border-b border-(--border-color)">
        <TaskFilter tasks={tasks} filter={filter} setFilter={setFilter} />
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border
         border-(--border-color) text-(--text-muted) font-interface">
          {filtered.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-1 text-(--text-secondary) px-4">
          <FontAwesomeIcon
            icon={faInbox}
            className="text-xl text-(--accent-color) opacity-40"
          />
          <p className="text-sm text-(--text-primary)">No tasks yet</p>
          <p className="text-xs text-(--text-muted)">
            Add one above to get started.
          </p>
        </div>
      ) : (
        <ul className="overflow-y-auto flex-1">
          {filtered.map((task) => (
            <li key={task.id}>
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
