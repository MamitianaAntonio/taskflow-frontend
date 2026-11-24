import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Circle,
  CircleCheck,
  CircleDashed,
  ClipboardList,
  FolderKanban,
  Pencil,
  Plus,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useProjectStore } from "../stores/projectStore";
import useTodoStore from "../stores/todoStore";
import Button from "../components/ui/Button";
import KanbanBoard from "../components/Projects/KanbanBoard";
import ProjectEditPanel from "../components/Projects/ProjectEditPanel";
import TaskboardStats from "../components/TaskBoard/TaskboardStats";
import CustomTask from "../components/TaskBoard/CustomTask";
import TaskDetail from "../components/TaskBoard/TaskDetail";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import PageHeader from "../components/ui/PageHeader";
import Spinner from "../components/ui/Spinner";
import { formatDate, isOverdue } from "../utils/date";
import { toBoardTask } from "../utils/task";
import { ROUTES } from "../constants/routes";
import type {
  BoardTask,
  KanbanTask,
  Todo,
  TodoStatus,
  UpdateTodoPayload,
} from "../types/todo";

function mapTodoForBoard(todo: Todo): KanbanTask {
  return {
    id: todo.id,
    title: todo.title,
    description: todo.description,
    status: todo.status,
    dueDate: todo.dueDate,
    priority: todo.priority,
    updatedAt: todo.updatedAt,
    subtasks: todo.subtasks ?? [],
    repeat: todo.repeat ?? "none",
  };
}

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const {
    currentProject,
    isLoading,
    fetchById,
    update: updateProject,
    remove: deleteProject,
  } = useProjectStore();
  const todos = useTodoStore((state) => state.todos);
  const fetchTodos = useTodoStore((state) => state.fetchTodos);
  const updateTodo = useTodoStore((state) => state.updateTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const addSubtask = useTodoStore((state) => state.addSubtask);
  const updateSubtask = useTodoStore((state) => state.updateSubtask);
  const deleteSubtask = useTodoStore((state) => state.deleteSubtask);

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) fetchById(projectId);
  }, [projectId, fetchById]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const id = projectId;

  // The opened task is derived from the store so subtask mutations are
  // reflected immediately without a local snapshot to keep in sync.
  const selectedTask = useMemo<BoardTask | null>(() => {
    if (!selectedTaskId) return null;
    const todo = (Array.isArray(todos) ? todos : []).find(
      (t) => t.id === selectedTaskId,
    );
    return todo ? toBoardTask(todo) : null;
  }, [selectedTaskId, todos]);

  const projectTodos = useMemo<KanbanTask[]>(
    () =>
      todos
        .filter((t) => t.projectId === id)
        .map(mapTodoForBoard)
        .sort(
          (a, b) =>
            Date.parse(a.updatedAt ?? "") - Date.parse(b.updatedAt ?? ""),
        ),
    [todos, id],
  );

  const stats = useMemo(() => {
    const todoCount = projectTodos.filter((t) => t.status === "todo").length;
    const doingCount = projectTodos.filter((t) => t.status === "doing").length;
    const doneCount = projectTodos.filter((t) => t.status === "done").length;
    return { todoCount, doingCount, doneCount, total: projectTodos.length };
  }, [projectTodos]);

  const handleStatusChange = (taskId: string, status: TodoStatus) => {
    updateTodo(taskId, { status });
  };

  const handleDelete = (taskId: string) => {
    deleteTodo(taskId);
    setSelectedTaskId((prev) => (prev === taskId ? null : prev));
  };

  const handleTaskUpdate = async (
    taskId: string,
    changes: UpdateTodoPayload,
  ) => {
    await updateTodo(taskId, changes);
  };

  const handleTaskClick = (task: KanbanTask) => {
    setSelectedTaskId(task.id);
  };

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-4 p-3 sm:p-4">
        <Spinner className="py-10" />
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="flex w-full flex-col gap-4 p-3 sm:p-4">
        <Button
          variant="outline"
          size="small"
          icon={<ArrowLeft aria-hidden="true" size={14} strokeWidth={1.8} />}
          onClick={() => navigate(ROUTES.projects)}
        >
          Back to projects
        </Button>
        <ErrorState
          title="Project not found"
          message="It may have been deleted, or the link is invalid."
        />
      </div>
    );
  }

  const overdue = currentProject.dueDate
    ? isOverdue(currentProject.dueDate)
    : false;

  return (
    <div className="flex w-full flex-col gap-4 p-3 sm:gap-5 sm:p-4">
      <PageHeader
        title={currentProject.name}
        icon={
          <FolderKanban aria-hidden="true" size={18} strokeWidth={1.8} />
        }
        description={
          currentProject.description?.trim() ||
          "Keep the board moving, one task at a time."
        }
        meta={[
          {
            label: `${stats.total} task${stats.total === 1 ? "" : "s"}`,
            tone: "accent",
          },
          {
            label: `${stats.doneCount} done`,
            tone: stats.doneCount > 0 ? "success" : "neutral",
          },
          ...(currentProject.dueDate
            ? [
                {
                  label: `${overdue ? "Overdue" : "Due"} ${formatDate(currentProject.dueDate)}`,
                  tone: overdue ? ("error" as const) : ("neutral" as const),
                },
              ]
            : []),
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="text"
              size="small"
              onClick={() => navigate(ROUTES.projects)}
              icon={
                <ArrowLeft aria-hidden="true" size={14} strokeWidth={1.8} />
              }
            >
              Back
            </Button>
            <Button
              variant="outline"
              size="small"
              onClick={() => setShowEdit(true)}
              icon={<Pencil aria-hidden="true" size={14} strokeWidth={1.8} />}
            >
              Edit
            </Button>
          </div>
        }
      />

      <TaskboardStats
        stats={[
          {
            label: "Total",
            value: stats.total,
            icon: ClipboardList,
            bg: "bg-(--accent-soft)",
            color: "text-(--accent-strong)",
          },
          {
            label: "To do",
            value: stats.todoCount,
            icon: Circle,
            bg: "bg-(--color-warning-soft)",
            color: "text-(--color-warning)",
          },
          {
            label: "In progress",
            value: stats.doingCount,
            icon: CircleDashed,
            bg: "bg-(--accent-bg)",
            color: "text-(--accent-strong)",
          },
          {
            label: "Done",
            value: stats.doneCount,
            icon: CircleCheck,
            bg: "bg-(--color-success-soft)",
            color: "text-(--color-success)",
          },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-(--accent-color)"
          />
          <h2 className="font-interface text-xs font-semibold uppercase tracking-[0.12em] text-(--text-secondary)">
            Board
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <p className="hidden items-center gap-2 font-interface text-[11px] text-(--text-muted) md:inline-flex">
            Drag tasks between columns to change their status
          </p>
          <Button
            variant="primary"
            size="small"
            onClick={() => setShowCreate(true)}
            icon={<Plus aria-hidden="true" size={14} strokeWidth={2} />}
          >
            New task
          </Button>
        </div>
      </div>

      {projectTodos.length === 0 ? (
        <div className="rounded-control border border-dashed border-(--border-color) bg-(--bg-secondary)/40 py-12">
          <EmptyState
            title="No tasks in this project yet."
            text="Create your first task to start tracking progress."
            action={
              <Button
                variant="outline"
                size="small"
                onClick={() => setShowCreate(true)}
                icon={<Plus aria-hidden="true" size={14} strokeWidth={2} />}
              >
                Add first task
              </Button>
            }
          />
        </div>
      ) : (
        <KanbanBoard
          tasks={projectTodos}
          onTaskClick={handleTaskClick}
          onStatusChange={handleStatusChange}
          onDeleteTask={handleDelete}
        />
      )}

      <AnimatePresence>
        {showCreate && (
          <CustomTask
            key="create-task"
            onClose={() => setShowCreate(false)}
            projectId={id}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTask && (
          <TaskDetail
            key="task-detail"
            task={selectedTask}
            onClose={() => setSelectedTaskId(null)}
            onUpdate={handleTaskUpdate}
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
        {showEdit && (
          <ProjectEditPanel
            key="edit-project"
            project={currentProject}
            onClose={() => setShowEdit(false)}
            onSave={async (changes) => {
              await updateProject(currentProject.id, changes);
            }}
            onDelete={async () => {
              if (!id) return;
              await deleteProject(id);
              navigate(ROUTES.projects);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
