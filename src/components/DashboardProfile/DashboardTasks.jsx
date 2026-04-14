import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faClock, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/Button";

// Utility functions
const isToday = (date) => new Date(date).toDateString() === new Date().toDateString();
const isOverdue = (date) => new Date(date) < new Date() && !isToday(date);
const isUpcoming = (date) => {
  const d = new Date(date);
  const now = new Date();
  const in3days = new Date();
  in3days.setDate(now.getDate() + 3);
  return d > now && d <= in3days;
};

// TaskRow component (improved design)
const TaskRow = ({ task }) => {
  const dueDateStr = new Date(task.dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-(--border-color) hover:bg-(--bg-hover) transition-colors">
      <div className="flex items-center gap-3">
        <div
          className={`w-3 h-3 rounded-full shrink-0 ${task.overdue ? "bg-(--color-error)" : "bg-(--color-success)"
            }`}
        />
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-(--text-primary) truncate">{task.title}</p>
          <span className="text-xs text-(--text-secondary)">
            {task.completed ? "Completed" : isToday(task.dueDate) ? "Today" : ""}
          </span>
        </div>
      </div>
      <span
        className={`text-xs font-mono shrink-0 px-2 py-1 rounded-full ${task.overdue
          ? "bg-(--color-error)/20 text-(--color-error)"
          : task.completed
            ? "bg-(--color-success)/20 text-(--color-success)"
            : "bg-(--color-warning)/20 text-(--color-warning)"
          }`}
      >
        {dueDateStr}
      </span>
    </div>
  );
};

// Section component with "Show more / Show less"
const Section = ({ icon, label, color, tasks, emptyText, maxVisible = 3 }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleTasks = showAll ? tasks : tasks.slice(0, maxVisible);

  return (
    <div className="bg-(--bg-secondary) border border-(--border-color) rounded-lg p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-2">
        <FontAwesomeIcon icon={icon} className={`text-sm ${color}`} />
        <p className="text-xs font-semibold font-mono uppercase tracking-widest text-(--text-primary) opacity-60">
          {label}
        </p>
        <span className="ml-auto text-xs font-mono font-bold text-(--text-primary) opacity-40">
          {tasks.length}
        </span>
      </div>

      {tasks.length === 0 ? (
        <p className="text-xs font-mono text-(--text-primary) opacity-30 py-2">{emptyText}</p>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {visibleTasks.map((t) => (
              <TaskRow key={t.id} task={t} />
            ))}
          </div>

          {tasks.length > maxVisible && (
            <div className="mt-2 self-start">
              <Button
                text={showAll ? "Show less" : `Show ${tasks.length - maxVisible} more`}
                variant="outline"
                onClick={() => setShowAll(!showAll)}
                className="text-xs px-3 py-1"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Main DashboardTasks component
export default function DashboardTasks({ tasks = [] }) {
  const todayAndOverdue = useMemo(() =>
    tasks
      .filter((t) => !t.completed && (isToday(t.dueDate) || isOverdue(t.dueDate)))
      .map((t) => ({ ...t, overdue: isOverdue(t.dueDate) }))
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)),
    [tasks]
  );

  const upcoming = useMemo(() =>
    tasks
      .filter((t) => !t.completed && isUpcoming(t.dueDate))
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)),
    [tasks]
  );

  const recentlyDone = useMemo(() =>
    tasks
      .filter((t) => t.completed)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)),
    [tasks]
  );

  return (
    <div className="flex flex-col xl:flex-row w-full gap-4">

      <div className="flex-1">

        <Section
          icon={faClock}
          label="Today & Overdue"
          color="text-(--color-highlight)"
          tasks={todayAndOverdue}
          emptyText="No tasks due today — enjoy your day!"
        />
      </div>
      <div className="flex-1">

        <Section
          icon={faCalendarDays}
          label="Upcoming"
          color="text-(--color-warning)"
          tasks={upcoming}
          emptyText="No tasks in the next 3 days."
        />
      </div>
      <div className="flex-1">
        <Section
          icon={faCircleCheck}
          label="Recently Completed"
          color="text-(--color-success)"
          tasks={recentlyDone}
          emptyText="No tasks completed yet."
        />

      </div>

    </div>
  );
}
