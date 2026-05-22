import { useEffect, useState } from "react";
import QuickAddTask from "../DashboardProfile/QuickAddTask";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faInbox, faList, faSpinner, faTableColumns } from "@fortawesome/free-solid-svg-icons";
import TaskRow from "./TaskRow";
import TaskDetail from "./TaskDetail";
import useTodoStore from "../../stores/todoStore";
import TaskFilter from "./TaskFilter";

const STATUSES = ["all", "todo", "doing", "done"];
const cycle = { todo: "doing", doing: "done", done: "todo" };

export default function Taskboard() {
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
          icon={faTableColumns}
          className="text-3xl text-(--text-tertiary)"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, color, icon, bg }) => (
          <div
            key={label}
            className="rounded-lg border border-(--border-color) bg-(--bg-secondary) p-4"
          >
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center mb-3 ${bg}`}
            >
              <FontAwesomeIcon icon={icon} className={`text-sm ${color}`} />
            </div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-(--text-tertiary)">
              {label}
            </p>
            <p className={`mt-2 text-3xl font-semibold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Quick add */}
      <div className="rounded-lg border border-(--border-color) bg-(--bg-secondary) p-4">
        <p className="text-[11px] uppercase tracking-widest text-(--text-tertiary) mb-3">
          Quick add task
        </p>
        <QuickAddTask onAdd={addTodo} />
      </div>

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
      <div className="rounded-lg border border-(--border-color) bg-(--bg-secondary) overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-(--border-color) bg-(--accent-color)">
          <h2 className="text-sm font-semibold text-(--text-white)">Tasks</h2>
          <p className="mt-1 text-xs text-(--text-white)">
            Click a task to view details
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-(--text-secondary)">
            <FontAwesomeIcon
              icon={faInbox}
              className="mx-auto mb-4 text-3xl opacity-40"
            />
            <p>No tasks match this filter.</p>
          </div>
        ) : (
          filtered.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onCycle={cycleStatus}
              onDelete={deleteTask}
              onClick={() => setSelectedTask(task)}
            />
          ))
        )}
      </div>
    </div>
  );
}
