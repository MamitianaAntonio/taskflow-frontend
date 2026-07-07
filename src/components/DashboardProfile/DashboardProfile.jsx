import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import useTodoStore from "../../stores/todoStore";
import useUserStore from "../../stores/userStore";
import Button from "../ui/Button";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import TaskOverview from "./TaskOverview";
import TaskStats from "./TaskStats";
import DashboardGreeting from "./DashboardGreeting";
import DashboardTasks from "./DashboardTasks";
import QuickAddTask from "../ui/QuickAddTask";

export default function DashboardProfile() {
  const user = useUserStore((state) => state.user);
  const tasks = useTodoStore((state) => state.todos);
  const fetchTodos = useTodoStore((state) => state.fetchTodos);
  const addTodo = useTodoStore((state) => state.addTodo);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const dashboardTasks = tasks.map((task) => ({
    ...task,
    completed: task.status === "done",
    completedAt: task.completedAt || (task.status === "done" ? task.updatedAt || task.dueDate : null),
  }));

  const total = dashboardTasks.length;
  const completedCount = dashboardTasks.filter((task) => task.status === "done").length;
  const incompleteCount = dashboardTasks.filter((task) => task.status === "doing").length;
  const leftCount = dashboardTasks.filter((task) => task.status === "todo").length;

  return (
    <div className="p-3 sm:p-4 flex flex-col gap-4">
      {/* Header */}
      <DashboardGreeting name={user?.name ?? "Unknown"} />

      <div className="flex items-center">
        <h1 className="text-2xl font-semibold font-mono uppercase tracking-widest text-(--text-primary) opacity-60">
          Dashboard
        </h1>
      </div>

      {/* Profile card */}
      <div
        className="bg-(--bg-secondary) border border-(--border-color) rounded-lg p-4 flex items-center gap-4"
        style={{ boxShadow: "var(--shadow-pink)" }}
      >
        {/* Avatar */}
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 text-2xl sm:text-3xl font-bold
          text-(--text-white) rounded-lg
          flex items-center justify-center select-none
          bg-linear-to-br from-(--gradient-from) to-(--gradient-to)"
        >
          {user?.name?.[0] ?? "A"}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-(--text-primary) truncate">
            {user?.name ?? "..."}
          </p>
          <p className="text-sm text-(--text-secondary) font-mono truncate">
            {user?.email ?? "..."}
          </p>
        </div>

        {/* Settings */}
        <Button variant="outline" size="small">
          <FontAwesomeIcon icon={faGear} />
          Settings
        </Button>
      </div>

      {/* task hub */}
      <div className="flex items-center">
        <h1 className="text-base font-semibold font-mono uppercase tracking-widest text-(--text-primary) opacity-60">
          Insights
        </h1>
      </div>

      {/* Stats grid — stacked on mobile, side-by-side on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TaskStats
          completed={completedCount}
          incomplete={incompleteCount}
          left={leftCount}
          total={total}
        />
        <TaskOverview
          completed={completedCount}
          incomplete={incompleteCount}
          total={total}
        />
      </div>

      {/* task hub */}
      <div className="flex items-center">
        <h1 className="text-base font-semibold font-mono uppercase tracking-widest text-(--text-primary) opacity-60">
          Workspace
        </h1>
      </div>

      {/* Quick Add Task */}
      <QuickAddTask onAdd={addTodo} />

      {/* Tasks Sections */}
      <div className="w-full flex flex-col md:flex-row gap-4">
        {/* Each section inside DashboardTasks will stack nicely */}
        <DashboardTasks tasks={dashboardTasks} />
      </div>
    </div>
  );
}
