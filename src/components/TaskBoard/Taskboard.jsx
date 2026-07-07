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
import { AnimatePresence, motion } from "framer-motion";

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

  const updateTask = (id, changes) => {
    updateTodo(id, changes);
    setSelectedTask((prev) => (prev ? { ...prev, ...changes } : null));
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
        <h1 className="text-xl sm:text-2xl font-semibold font-mono uppercase tracking-widest text-(--text-primary) opacity-60">
          Your flow
        </h1>
        <FontAwesomeIcon
          icon={faTasks}
          className="text-xl sm:text-2xl text-(--accent-color)"
        />
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

      {/* Task detail — bottom drawer on mobile, inline on sm+ */}
      <AnimatePresence>
        {selectedTask && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              key="detail-backdrop"
              className="fixed inset-0 bg-(--overlay) z-40 sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedTask(null)}
            />

            {/* Mobile: bottom drawer */}
            <motion.div
              key="detail-drawer"
              className="fixed bottom-0 left-0 right-0 z-50 sm:hidden
                         bg-(--bg-secondary) rounded-t-2xl shadow-2xl
                         max-h-[85vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-(--border-color)" />
              </div>
              <TaskDetail
                task={selectedTask}
                onClose={() => setSelectedTask(null)}
                onUpdate={updateTask}
              />
            </motion.div>

            {/* Desktop: inline */}
            <motion.div
              key="detail-inline"
              className="hidden sm:block"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <TaskDetail
                task={selectedTask}
                onClose={() => setSelectedTask(null)}
                onUpdate={updateTask}
              />
            </motion.div>
          </>
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
