import { useMemo } from "react";
import {
  CalendarDays,
  CircleCheck,
  Clock,
  type LucideIcon,
} from "lucide-react";
import TaskSection from "./TaskSection";
import { isOverdue, isToday, isUpcoming } from "../../utils/date";
import type { DashboardTask } from "../../types/todo";

interface TaskGroup {
  icon: LucideIcon;
  label: string;
  color: string;
  chip: string;
  tasks: DashboardTask[];
}

export default function DashboardTasks({
  tasks,
  isLoading = false,
}: {
  tasks: DashboardTask[];
  isLoading?: boolean;
}) {
  const todayAndOverdue = useMemo(
    () =>
      tasks
        .filter(
          (t) => !t.completed && (isToday(t.dueDate) || isOverdue(t.dueDate)),
        )
        .map((t) => ({ ...t, overdue: isOverdue(t.dueDate) }))
        .sort(
          (a, b) => Date.parse(a.dueDate ?? "") - Date.parse(b.dueDate ?? ""),
        ),
    [tasks],
  );

  const upcoming = useMemo(
    () =>
      tasks
        .filter((t) => !t.completed && isUpcoming(t.dueDate))
        .sort(
          (a, b) => Date.parse(a.dueDate ?? "") - Date.parse(b.dueDate ?? ""),
        ),
    [tasks],
  );

  const recentlyDone = useMemo(
    () =>
      tasks
        .filter((t) => t.completed)
        .sort(
          (a, b) =>
            Date.parse(b.completedAt ?? "") - Date.parse(a.completedAt ?? ""),
        ),
    [tasks],
  );

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-3 xl:flex-row xl:gap-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex flex-1 items-center gap-3 rounded-control border border-(--border-color)
            bg-(--bg-secondary) p-3 shadow-sm"
          >
            <div className="size-8 shrink-0 animate-pulse rounded-lg bg-(--border-color)" />
            <div className="min-w-0 flex-1">
              <div className="h-2.5 w-24 animate-pulse rounded-full bg-(--border-color)" />
              <div className="mt-2 h-5 w-8 animate-pulse rounded-md bg-(--border-color)" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const groups: TaskGroup[] = [
    {
      icon: Clock,
      label: "Due today & overdue",
      color: "text-(--accent-strong)",
      chip: "bg-(--accent-soft)",
      tasks: todayAndOverdue,
    },
    {
      icon: CalendarDays,
      label: "Upcoming",
      color: "text-(--color-warning)",
      chip: "bg-(--color-warning-soft)",
      tasks: upcoming,
    },
    {
      icon: CircleCheck,
      label: "Completed recently",
      color: "text-(--color-success)",
      chip: "bg-(--color-success-soft)",
      tasks: recentlyDone,
    },
  ];

  return (
    <div className="flex w-full flex-col gap-3 xl:flex-row xl:gap-4">
      {groups.map((group) => (
        <div key={group.label} className="flex-1">
          <TaskSection {...group} />
        </div>
      ))}
    </div>
  );
}
