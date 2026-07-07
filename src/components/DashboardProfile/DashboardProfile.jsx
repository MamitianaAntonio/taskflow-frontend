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

      {/* Welcome + Profile in one row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <DashboardGreeting name={user?.name ?? "there"} />
        </div>
        <div className="flex items-center gap-4 bg-(--bg-secondary) border border-(--border-color) rounded-lg p-3 sm:p-4 shrink-0">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 text-xl sm:text-2xl font-bold
            text-(--text-white) rounded-lg
            flex items-center justify-center select-none
            bg-linear-to-br from-(--gradient-from) to-(--gradient-to)"
          >
            {user?.name?.[0] ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-(--text-primary) truncate">
              {user?.name ?? "Guest user"}
            </p>
            <p className="text-xs text-(--text-secondary) font-mono truncate">
              {user?.email ?? "No email address"}
            </p>
          </div>
          <Button variant="outline" size="small">
            <FontAwesomeIcon icon={faGear} />
          </Button>
        </div>
      </div>

      {/* Stats grid */}
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

      {/* Quick Add Task */}
      <div>
        <p className="text-xs font-semibold text-(--text-primary) opacity-50 uppercase tracking-widest mb-2 font-interface">
          Quick add
        </p>
        <QuickAddTask onAdd={addTodo} />
      </div>

      {/* Tasks Sections */}
      <div>
        <p className="text-xs font-semibold text-(--text-primary) opacity-50 uppercase tracking-widest mb-2 font-interface">
          Task overview
        </p>
        <DashboardTasks tasks={dashboardTasks} />
      </div>

    </div>
  );
}
