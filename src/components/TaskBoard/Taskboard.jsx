import { useEffect, useState } from "react";
import QuickAddTask from "../ui/QuickAddTask";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faList,
  faSpinner,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";
import TaskDetail from "./TaskDetail";
import useTodoStore from "../../stores/todoStore";
import TaskFilter from "./TaskFilter";
import TaskList from "./TaskList";
import TaskboadStats from "./TaskboadStats";
import CustomTask from "./CustomTask";
import { AnimatePresence } from "framer-motion";

export default function Taskboard() {
  const cycle = { todo: "doing", doing: "done", done: "todo" };
  const todos = useTodoStore((state) => state.todos);
  const fetchTodos = useTodoStore((state) => state.fetchTodos);
  const addTodo = useTodoStore((state) => state.addTodo);
  const updateTodo = useTodoStore((state) => state.updateTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);

  const [filter, setFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const tasks = Array.isArray(todos)
    ? todos.map((todo) => ({
      id: todo.id,
      label: todo.title,
      status: todo.status || "todo",
      dueDate: todo.dueDate,
      priority: todo.priority || "medium",
    }))
    : [];

  const statusCount = tasks.reduce(
    (counts, task) => {
      counts[task.status] = (counts[task.status] || 0) + 1;
      return counts;
    },
    { todo: 0, doing: 0, done: 0 },
  );

  const filtered = tasks.filter((t) => filter === "all" || t.status === filter);

  const cycleStatus = (id) => {
    const todo = todos.find((item) => item.id === id);
    if (!todo) return;
    updateTodo(id, { status: cycle[todo.status || "todo"] });
  };

  const deleteTask = (id) => {
    deleteTodo(id);
    if (selectedTask?.id === id) setSelectedTask(null);
  };

  const updateTask = async (id, changes) => {
    await updateTodo(id, changes);
    setSelectedTask((prev) => {
      if (!prev) return null;
      const mapped = { ...changes };
      if (mapped.title !== undefined) {
        mapped.label = mapped.title;
        delete mapped.title;
      }
      return { ...prev, ...mapped };
    });
  };

  const stats = [
    {
      label: "Total",
      value: tasks.length,
      color: "text-(--text-primary)",
      bg: "bg-(--border-color)",
      icon: faList,
    },
    {
      label: "To do",
      value: statusCount.todo,
      color: "text-(--color-warning)",
      bg: "bg-(--color-warning)/10",
      icon: faClock,
    },
    {
      label: "In progress",
      value: statusCount.doing,
      color: "text-(--accent-color)",
      bg: "bg-(--accent-color)/10",
      icon: faSpinner,
    },
  ];

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 mx-auto">
      {/* Header */}
      <div className="rounded-lg flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold font-mono uppercase tracking-widest text-(--accent-color)">
          Your flow
        </h1>
        <FontAwesomeIcon icon={faTasks} className="text-xl sm:text-2xl text-(--accent-color)" />
      </div>

      {/* Stats */}
      <TaskboadStats stats={stats} />

      {/* Quick add + Custom task — stack on mobile */}
      <div className="flex flex-col sm:flex-row w-full gap-3">
        <div className="flex-1">
          <QuickAddTask onAdd={addTodo} />
        </div>
        <div className="flex-1">
          <CustomTask />
        </div>
      </div>

      {/* Filter */}
      <TaskFilter tasks={tasks} filter={filter} setFilter={setFilter} />

      {/* Task detail */}
      <AnimatePresence>
        {selectedTask && (
          <TaskDetail
            key="task-detail"
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={updateTask}
          />
        )}
      </AnimatePresence>

      {/* Task list */}
      <TaskList
        filtered={filtered}
        cycleStatus={cycleStatus}
        deleteTask={deleteTask}
        setSelectedTask={setSelectedTask}
      />
    </div>
  );
}
