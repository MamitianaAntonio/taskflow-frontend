import { useMemo } from "react";
import {
  faCircleCheck,
  faClock,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import TaskSection from "./TaskSection";
import { isOverdue, isToday, isUpcoming } from "../../constants/taskUtilities";

export default function DashboardTasks({ tasks = [] }) {
  const todayAndOverdue = useMemo(
    () =>
      tasks
        .filter(
          (t) => !t.completed && (isToday(t.dueDate) || isOverdue(t.dueDate)),
        )
        .map((t) => ({ ...t, overdue: isOverdue(t.dueDate) }))
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)),
    [tasks],
  );

  const upcoming = useMemo(
    () =>
      tasks
        .filter((t) => !t.completed && isUpcoming(t.dueDate))
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)),
    [tasks],
  );

  const recentlyDone = useMemo(
    () =>
      tasks
        .filter((t) => t.completed)
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)),
    [tasks],
  );

  return (
    <div className="flex flex-col xl:flex-row w-full gap-4">
      <div className="flex-1">
        <TaskSection
          icon={faClock}
          label="Today & Overdue"
          color="text-(--color-highlight)"
          tasks={todayAndOverdue}
        />
      </div>
      <div className="flex-1">
        <TaskSection
          icon={faCalendarDays}
          label="Upcoming"
          color="text-(--color-warning)"
          tasks={upcoming}
        />
      </div>
      <div className="flex-1">
        <TaskSection
          icon={faCircleCheck}
          label="Recently Completed"
          color="text-(--color-success)"
          tasks={recentlyDone}
        />
      </div>
    </div>
  );
}
