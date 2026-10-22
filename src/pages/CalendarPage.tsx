import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faChevronLeft,
  faChevronRight,
  faCirclePlus,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence } from "framer-motion";
import MonthGrid from "../components/Calendar/MonthGrid";
import AgendaList from "../components/Calendar/AgendaList";
import DayDrawer from "../components/Calendar/DayDrawer";
import TaskDetail from "../components/TaskBoard/TaskDetail";
import CustomTask from "../components/TaskBoard/CustomTask";
import Button from "../components/ui/Button";
import ChipTabs from "../components/ui/ChipTabs";
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
  todayKey,
  type DayKey,
} from "../utils/calendar";
import { isOverdue, toLocalDatetime } from "../utils/date";
import { toBoardTask } from "../utils/task";
import type { Project } from "../types/project";
import type { Todo, UpdateTodoPayload } from "../types/todo";

type CalendarView = "month" | "agenda";

/** 9am, a sane default when someone picks a day on the calendar. */
function defaultTimeFor(day: DayKey) {
  return toLocalDatetime(`${day}T09:00:00`);
}

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
  const [view, setView] = useState<CalendarView>(() =>
    compact ? "agenda" : "month",
  );
  const [selectedDay, setSelectedDay] = useState<DayKey | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createDay, setCreateDay] = useState<DayKey | null>(null);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const today = todayKey();

  const tasksByDay = useMemo(
    () => groupByDay(todos, (todo) => dayKey(todo.dueDate)),
    [todos],
  );

  const projectNames = useMemo(
    () => new Map(projects.map((project) => [project.id, project.name])),
    [projects],
  );

  const projectName = (id: string | null | undefined) =>
    id ? projectNames.get(id) ?? null : null;

  const overdue = useMemo(
    () =>
      todos
        .filter((todo) => todo.status !== "done" && isOverdue(todo.dueDate))
        .sort(
          (a, b) =>
            new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime(),
        ),
    [todos],
  );

  const upcomingDays = useMemo(
    () =>
      [...tasksByDay.entries()]
        .filter(([day]) => day >= today)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([day, tasks]) => ({ day, tasks })),
    [tasksByDay, today],
  );

  const deadlines = useMemo(
    () =>
      projects
        .map((project) => ({ day: dayKey(project.dueDate), project }))
        .filter(
          (item): item is { day: DayKey; project: Project } =>
            Boolean(item.day) && item.day >= today,
        )
        .sort((a, b) => a.day.localeCompare(b.day)),
    [projects, today],
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

  const openCreate = (day: DayKey | null) => {
    setCreateDay(day);
    setShowCreate(true);
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

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="small"
            onClick={() => setCursor(startOfMonth(new Date()))}
            icon={<FontAwesomeIcon icon={faCalendarDays} className="text-xs" />}
            text="Today"
          />
          <ChipTabs<CalendarView>
            items={[
              { id: "month", label: "Month", icon: faCalendarDays },
              { id: "agenda", label: "Agenda", icon: faListCheck },
            ]}
            value={view}
            onChange={setView}
            ariaLabel="Calendar view"
          />
          <Button
            variant="primary"
            size="small"
            onClick={() => openCreate(null)}
            icon={<FontAwesomeIcon icon={faCirclePlus} className="text-[10px]" />}
            text="New task"
          />
        </div>
      </div>

      {todos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-(--border-color)">
          <EmptyState
            icon={faCalendarDays}
            title="Nothing scheduled yet."
            text="Tasks with a due date show up here."
          />
        </div>
      ) : view === "month" ? (
        <MonthGrid
          cursor={cursor}
          tasksByDay={tasksByDay}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          onOpenTask={(task) => setSelectedTaskId(task.id)}
          compact={compact}
          projectName={projectName}
        />
      ) : (
        <AgendaList
          today={today}
          overdue={overdue}
          days={upcomingDays}
          deadlines={deadlines}
          projectName={projectName}
          onOpenTask={(task) => setSelectedTaskId(task.id)}
          onSelectDay={setSelectedDay}
        />
      )}

      <AnimatePresence>
        {selectedDay && (
          <DayDrawer
            key="day-drawer"
            day={selectedDay}
            tasks={tasksByDay.get(selectedDay) ?? []}
            projectName={projectName}
            onClose={() => setSelectedDay(null)}
            onOpenTask={(task) => {
              setSelectedDay(null);
              setSelectedTaskId(task.id);
            }}
            onAddTask={() => {
              openCreate(selectedDay);
              setSelectedDay(null);
            }}
          />
        )}
      </AnimatePresence>

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

      <AnimatePresence>
        {showCreate && (
          <CustomTask
            key="create-task"
            onClose={() => setShowCreate(false)}
            initial={{ dueDate: defaultTimeFor(createDay ?? today) }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
