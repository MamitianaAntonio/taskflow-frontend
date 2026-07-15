import { useEffect, useState } from "react";
import QuickAddTask from "../ui/QuickAddTask";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faCircleCheck,
  faCircleHalfStroke,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import TaskDetail from "./TaskDetail";
import useTodoStore from "../../stores/todoStore";
import TaskList from "./TaskList";
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
  const [showCustom, setShowCustom] = useState(false);

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

  const statusIndication = {
    todo: {
      label: "todo",
      icon: faCircle,
    },
    doing: {
      label: "doing",
      icon: faCircleHalfStroke,
    },
    done: {
      label: "done",
      icon: faCircleCheck,
    },
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold font-mono uppercase tracking-widest text-(--accent-color) leading-none">
            Your flow
          </h1>
          <p className="text-xs text-(--text-muted) mt-1.5 font-interface">
            Manage and track your daily tasks
          </p>
        </div>
        <span className="text-sm text-(--text-muted) font-interface">
          {tasks.length} task{tasks.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Quick add row */}
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <QuickAddTask onAdd={addTodo} />
        </div>
        <button
          onClick={() => setShowCustom(true)}
          title="Create a new task with custom fields"
          className="flex items-center gap-1.5 px-3 py-3 rounded-xl border border-(--border-color) bg-(--bg-primary)
          text-xs font-semibold text-(--text-muted) hover:text-(--accent-color) hover:border-(--accent-color)/40 transition-all font-interface shrink-0"
        >
          <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
          New task
        </button>
      </div>

      {/* Custom task modal */}
      <AnimatePresence>
        {showCustom && (
          <CustomTask key="custom-task" onClose={() => setShowCustom(false)} />
        )}
      </AnimatePresence>

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

      {/* Status indication */}
      <div className="flex items-center gap-4 text-xs font-interface text-(--text-muted)">
        {Object.values(statusIndication).map((s) => (
          <span key={s.label} className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={s.icon} className="text-[12px]" />
            {s.label}
          </span>
        ))}
      </div>

      {/* Task list */}
      <TaskList
        filtered={filtered}
        cycleStatus={cycleStatus}
        deleteTask={deleteTask}
        setSelectedTask={setSelectedTask}
        filter={filter}
        setFilter={setFilter}
        tasks={tasks}
      />
    </div>
  );
}
