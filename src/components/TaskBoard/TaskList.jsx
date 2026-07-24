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
    <div className="rounded-xl border border-(--border-color) bg-(--bg-primary) overflow-hidden w-full flex flex-col h-130">
      {/* Header — merged filter + count */}
      <div className="flex bg-(--bg-secondary) items-center justify-between px-3 py-2 border-b border-(--border-color)">
        <TaskFilter tasks={tasks} filter={filter} setFilter={setFilter} />
        <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-(--bg-secondary) border border-(--border-color)
          text-(--text-muted) font-interface">
          {filtered.length} task{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-2 text-(--text-secondary)">
          <FontAwesomeIcon icon={faInbox} className="text-4xl opacity-30" />
          <p className="text-sm font-medium text-(--text-primary)">
            Nothing here yet
          </p>
          <p className="text-xs">Add a task above to get started.</p>
        </div>
      ) : (
        <ul className="overflow-y-auto flex-1 ">
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
