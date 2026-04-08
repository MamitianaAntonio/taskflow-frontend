import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useUserStore from "../../stores/userStore";
import Button from "../ui/Button";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import TaskOverview from "./TaskOverview";
import TaskStats from "./TaskStats";
import DashboardGreeting from "./DashboardGreeting";
import DashboardTasks from "./DashboardTasks";
import { useState } from 'react'
import QuickAddTask from "./QuickAddTask";
import tasksData from "../../data/tasks.json"

export default function DashboardProfile() {
  const user = useUserStore((state) => state.user);
  const [tasks, setTasks] = useState(tasksData);

  return (
    <div className="p-3 sm:p-4 flex flex-col gap-3">
      {/* Header */}
      <DashboardGreeting name={user?.name ?? "Unknown"} />

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold font-mono uppercase tracking-widest text-(--text-primary) opacity-50">
          Dashboard
        </h1>
      </div>

      {/* Profile card */}
      <div className="bg-(--bg-secondary) border border-(--border-color) rounded-lg p-4 flex items-center gap-4">
        {/* Avatar */}
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 text-2xl sm:text-3xl font-bold
          text-(--text-white) rounded-lg border border-(--border-color)
          flex items-center justify-center select-none
          bg-linear-to-br from-(--gradient-from) to-(--gradient-to)"
        >
          {user?.name?.[0] ?? "A"}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-(--text-primary) truncate">
            {user?.name ?? "Antonio"}
          </p>
          <p className="text-sm text-(--text-secondary) font-mono truncate">
            {user?.email ?? "antonio@mail.com"}
          </p>
        </div>

        {/* Settings */}
        <Button variant="outline" className="shrink-0 flex items-center gap-2">
          <FontAwesomeIcon icon={faGear} />
          <span className="hidden sm:inline text-sm">Settings</span>
        </Button>
      </div>

      {/* Stats grid — stacked on mobile, side-by-side on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TaskStats completed={7} incomplete={3} total={10} />
        <TaskOverview />
      </div>

      {/* Quick Add Task */}
      <div className="bg-(--bg-secondary) border border-(--border-color) rounded-lg p-4">
        <QuickAddTask />
      </div>

      {/* Tasks Sections */}
      <div className="w-full flex flex-col md:flex-row gap-4">
        {/* Each section inside DashboardTasks will stack nicely */}
        <DashboardTasks tasks={tasks} />
      </div>
    </div>
  );
}
