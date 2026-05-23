import { useEffect, useState } from "react";
import QuickAddTask from "../DashboardProfile/QuickAddTask";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faInbox, faList, faSpinner, faTableColumns, faTasks } from "@fortawesome/free-solid-svg-icons";
import TaskRow from "./TaskRow";
import TaskDetail from "./TaskDetail";
import useTodoStore from "../../stores/todoStore";
import TaskFilter from "./TaskFilter";
import TaskList from "./TaskList";
import TaskboadStats from "./TaskboadStats";

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

  const addTask = (label) => {
    if (!label.trim()) return;
    addTodo(label.trim());
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
    <div className="p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="rounded-lg flex items-center justify-between">
        <h1 className="text-2xl font-semibold font-mono uppercase tracking-widest text-(--text-primary) opacity-60">
          Your flow
        </h1>
        <FontAwesomeIcon
          icon={faTasks}
          className="text-2xl text-(--accent-color)"
        />
      </div>

      {/* Stats */}
      <TaskboadStats stats={stats} />

      {/* Quick add */}
      <QuickAddTask onAdd={addTodo} />

      {/* Filter */}
      <TaskFilter tasks={tasks} filter={filter} setFilter={setFilter} />

      {/* Task detail panel */}
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={updateTask}
        />
      )}

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
