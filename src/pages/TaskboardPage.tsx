import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import {
  faCheckCircle as faCircleCheck,
  faCircle,
  faCircleHalfStroke,
  faClipboardList,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import QuickAddTask from "../components/TaskBoard/QuickAddTask";
import TaskDetail from "../components/TaskBoard/TaskDetail";
import CustomTask from "../components/TaskBoard/CustomTask";
import TaskList from "../components/TaskBoard/TaskList";
import TaskboardStats from "../components/TaskBoard/TaskboardStats";
import Button from "../components/ui/Button";
import useTodoStore from "../stores/todoStore";
import { statusConfig } from "../constants/taskConfig";
import type { BoardTask, Todo, UpdateTodoPayload } from "../types/todo";

const toBoardTask = (todo: Todo): BoardTask => ({
  id: todo.id,
  label: todo.title,
  description: todo.description,
  status: todo.status || "todo",
  dueDate: todo.dueDate,
  priority: todo.priority || "medium",
});

export default function TaskboardPage() {
  const todos = useTodoStore((state) => state.todos);
  const fetchTodos = useTodoStore((state) => state.fetchTodos);
  const addTodo = useTodoStore((state) => state.addTodo);
  const updateTodo = useTodoStore((state) => state.updateTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);

  const [openTask, setOpenTask] = useState<BoardTask | null>(null);
  const [showCustom, setShowCustom] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Task opened via ?task=<id> (global search): derived from the URL,
  // so it always reflects the latest store data.
  const paramTaskId = Number(searchParams.get("task")) || null;
  const selectedTask = useMemo<BoardTask | null>(() => {
    if (paramTaskId) {
      const todo = (Array.isArray(todos) ? todos : []).find(
        (t) => t.id === paramTaskId && !t.projectId,
      );
      if (todo) return toBoardTask(todo);
    }
    return openTask;
  }, [paramTaskId, todos, openTask]);

  const closeDetail = () => {
    setOpenTask(null);
    if (searchParams.has("task")) setSearchParams({}, { replace: true });
  };

  const tasks: BoardTask[] = Array.isArray(todos)
    ? todos.filter((todo) => !todo.projectId).map(toBoardTask)
    : [];

  const updateTask = async (id: number, changes: UpdateTodoPayload) => {
    await updateTodo(id, changes);
    setOpenTask((prev) => {
      if (!prev || prev.id !== id) return prev;
      const next: UpdateTodoPayload & { label?: string } = { ...changes };
      if (next.title !== undefined) {
        next.label = next.title;
        delete next.title;
      }
      return { ...prev, ...next };
    });
  };

  return (
    <div className="flex w-full flex-col gap-4 p-3 sm:gap-5 sm:p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="tracking-tight">
          <h1 className="text-xl font-bold uppercase tracking-wide text-(--text-primary) sm:text-2xl">
            Your flow
          </h1>
          <p className="mt-1.5 text-base font-interface text-(--text-muted)">
            Manage and track your daily tasks
          </p>
        </div>
        <span className="rounded-full bg-(--bg-tertiary) px-3 py-1.5 font-interface text-xs font-semibold text-(--text-secondary)">
          {tasks.length} task{tasks.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center">
        <div className="flex-1">
          <QuickAddTask onAdd={(title) => addTodo({ title })} />
        </div>
        <Button
          onClick={() => setShowCustom(true)}
          title="Create a new task with custom fields"
          variant="outline"
          className="h-11 shrink-0 border-(--border-color) text-(--text-primary) hover:border-(--accent-color) hover:bg-(--accent-soft) hover:text-(--accent-strong)"
        >
          <FontAwesomeIcon icon={faPlus} className="text-[11px]" />
          Custom task
        </Button>
      </div>

      <TaskboardStats
        stats={[
          {
            label: "Total",
            value: tasks.length,
            icon: faClipboardList,
            bg: "bg-(--accent-soft)",
            color: "text-(--accent-color)",
          },
          {
            label: "To do",
            value: tasks.filter((t) => t.status === "todo").length,
            icon: faCircle,
            bg: "bg-(--color-warning-soft)",
            color: "text-(--color-warning)",
          },
          {
            label: "In progress",
            value: tasks.filter((t) => t.status === "doing").length,
            icon: faCircleHalfStroke,
            bg: "bg-(--accent-bg)",
            color: "text-(--accent-strong)",
          },
          {
            label: "Done",
            value: tasks.filter((t) => t.status === "done").length,
            icon: faCircleCheck,
            bg: "bg-(--color-success-soft)",
            color: "text-(--color-success)",
          },
        ]}
      />

      <AnimatePresence>
        {showCustom && (
          <CustomTask key="custom-task" onClose={() => setShowCustom(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTask && (
          <TaskDetail
            key="task-detail"
            task={selectedTask}
            onClose={closeDetail}
            onUpdate={updateTask}
            onDelete={(id) => deleteTodo(id)}
          />
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4 text-xs font-interface text-(--text-muted)">
        {Object.entries(statusConfig).map(([status, cfg]) => (
          <span key={status} className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={cfg.icon} className={`text-[12px] ${cfg.color}`} />
            {cfg.label}
          </span>
        ))}
      </div>

      <TaskList
        tasks={tasks}
        onUpdate={async (task) => {
          await updateTodo(task.id, {
            title: task.label,
            status: task.status,
            dueDate: task.dueDate,
            priority: task.priority,
          });
        }}
        onEdit={setOpenTask}
        onDelete={(task) => {
          if (paramTaskId === task.id) setSearchParams({}, { replace: true });
          setOpenTask((prev) => (prev?.id === task.id ? null : prev));
          deleteTodo(task.id);
        }}
      />
    </div>
  );
}