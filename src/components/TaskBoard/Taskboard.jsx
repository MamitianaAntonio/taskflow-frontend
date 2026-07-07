import { useEffect, useState } from "react";
import QuickAddTask from "../ui/QuickAddTask";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
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

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold font-mono uppercase tracking-widest text-(--accent-color)">
          Your flow
        </h1>
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
          title="Create a task with details"
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-(--border-color) bg-(--bg-primary) text-xs font-semibold text-(--text-muted) hover:text-(--accent-color) hover:border-(--accent-color)/40 transition-all font-interface shrink-0"
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
