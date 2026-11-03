import { useEffect } from "react";
import useTodoStore from "../stores/todoStore";
import useUserStore from "../stores/userStore";
import TaskStats from "../components/DashboardProfile/TaskStats";
import ProjectOverview from "../components/DashboardProfile/ProjectOverview";
import DashboardGreeting from "../components/DashboardProfile/DashboardGreeting";
import DashboardTasks from "../components/DashboardProfile/DashboardTasks";
import QuickAddTask from "../components/TaskBoard/QuickAddTask";
import ProfileCard from "../components/DashboardProfile/ProfileCard";
import SectionLabel from "../components/ui/SectionLabel";
import type { DashboardTask } from "../types/todo";

export default function DashboardHome() {
  const user = useUserStore((state) => state.user);
  const tasks = useTodoStore((state) => state.todos);
  const isLoading = useTodoStore((state) => state.isLoading);
  const fetchTodos = useTodoStore((state) => state.fetchTodos);
  const addTodo = useTodoStore((state) => state.addTodo);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const dashboardTasks: DashboardTask[] = tasks.map((task) => ({
    ...task,
    completed: task.status === "done",
    completedAt:
      task.completedAt ||
      (task.status === "done" ? task.updatedAt || task.dueDate : null),
  }));

  const total = dashboardTasks.length;
  const completedCount = dashboardTasks.filter(
    (task) => task.status === "done",
  ).length;
  const incompleteCount = dashboardTasks.filter(
    (task) => task.status === "doing",
  ).length;
  const leftCount = dashboardTasks.filter(
    (task) => task.status === "todo",
  ).length;

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <DashboardGreeting name={user?.name ?? "there"} />
        </div>
        <ProfileCard user={user} />
      </div>

      <TaskStats
        completed={completedCount}
        incomplete={incompleteCount}
        left={leftCount}
        total={total}
        isLoading={isLoading}
      />

      <div>
        <SectionLabel className="mb-2">Quick add</SectionLabel>
        <QuickAddTask onAdd={(title) => addTodo({ title })} />
      </div>

      <div>
        <SectionLabel className="mb-2">Task overview</SectionLabel>
        <DashboardTasks tasks={dashboardTasks} isLoading={isLoading} />
      </div>

      <div>
        <SectionLabel className="mb-2">Projects</SectionLabel>
        <ProjectOverview />
      </div>
    </div>
  );
}