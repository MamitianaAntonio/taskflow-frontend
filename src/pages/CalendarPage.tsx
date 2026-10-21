import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence } from "framer-motion";
import MonthGrid from "../components/Calendar/MonthGrid";
import TaskDetail from "../components/TaskBoard/TaskDetail";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import { useIsMobile } from "../hooks/useIsMobile";
import { useProjectStore } from "../stores/projectStore";
import useTodoStore from "../stores/todoStore";
import {
  addMonths,
  dayKey,
  groupByDay,
  monthLabel,
  startOfMonth,
  type DayKey,
} from "../utils/calendar";
import { toBoardTask } from "../utils/task";
import type { Todo, UpdateTodoPayload } from "../types/todo";

export default function CalendarPage() {
  const todos = useTodoStore((state) => state.todos);
  const isLoading = useTodoStore((state) => state.isLoading);
  const fetchTodos = useTodoStore((state) => state.fetchTodos);
  const updateTodo = useTodoStore((state) => state.updateTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const addSubtask = useTodoStore((state) => state.addSubtask);
  const updateSubtask = useTodoStore((state) => state.updateSubtask);
  const deleteSubtask = useTodoStore((state) => state.deleteSubtask);

  const projects = useProjectStore((state) => state.projects);
  const fetchProjects = useProjectStore((state) => state.fetchAll);

  const compact = useIsMobile(768);

  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState<DayKey | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const tasksByDay = useMemo(
    () => groupByDay(todos, (todo) => dayKey(todo.dueDate)),
    [todos],
  );

  const projectNames = useMemo(
    () => new Map(projects.map((project) => [project.id, project.name])),
    [projects],
  );

  const selectedTask = useMemo(
    () => todos.find((todo) => todo.id === selectedTaskId) ?? null,
    [todos, selectedTaskId],
  );

  const handleUpdate = async (taskId: string, changes: UpdateTodoPayload) => {
    await updateTodo(taskId, changes);
  };

  const handleDelete = (taskId: string) => {
    void deleteTodo(taskId);
    setSelectedTaskId(null);
  };

  if (isLoading && todos.length === 0) {
    return (
      <div className="mx-auto flex flex-col gap-5 p-4 sm:p-6">
        <Spinner className="py-10" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex flex-col gap-4 p-4 sm:gap-5 sm:p-6">
      <div>
        <h1 className="text-xl font-bold uppercase tracking-wide text-(--text-primary) sm:text-2xl">
          Calendar
        </h1>
        <p className="mt-1.5 font-interface text-(--text-muted)">
          See every deadline at a glance
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="small"
            aria-label="Previous month"
            onClick={() => setCursor((current) => addMonths(current, -1))}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
          </Button>
          <h2 className="min-w-40 text-center font-interface text-sm font-semibold uppercase tracking-wide text-(--text-primary)">
            {monthLabel(cursor)}
          </h2>
          <Button
            variant="outline"
            size="small"
            aria-label="Next month"
            onClick={() => setCursor((current) => addMonths(current, 1))}
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="small"
          onClick={() => setCursor(startOfMonth(new Date()))}
          icon={<FontAwesomeIcon icon={faCalendarDays} className="text-xs" />}
          text="Today"
        />
      </div>

      {todos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-(--border-color)">
          <EmptyState
            icon={faCalendarDays}
            title="Nothing scheduled yet."
            text="Tasks with a due date show up here."
          />
        </div>
      ) : (
        <MonthGrid
          cursor={cursor}
          tasksByDay={tasksByDay}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          onOpenTask={(task) => setSelectedTaskId(task.id)}
          compact={compact}
          projectName={(id) => (id ? projectNames.get(id) ?? null : null)}
        />
      )}

      <AnimatePresence>
        {selectedTask && (
          <TaskDetail
            key="task-detail"
            task={toBoardTask(selectedTask)}
            onClose={() => setSelectedTaskId(null)}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onAddSubtask={async (title) => {
              await addSubtask(selectedTask.id, title);
            }}
            onToggleSubtask={async (subtaskId, done) => {
              await updateSubtask(selectedTask.id, subtaskId, {
                status: done ? "done" : "todo",
              });
            }}
            onDeleteSubtask={async (subtaskId) => {
              await deleteSubtask(selectedTask.id, subtaskId);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
