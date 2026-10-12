import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheckCircle,
  faCircle,
  faCircleHalfStroke,
  faClipboardList,
  faInbox,
  faPlus,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence } from "framer-motion";
import { useProjectStore } from "../stores/projectStore";
import useTodoStore from "../stores/todoStore";
import Button from "../components/ui/Button";
import KanbanBoard from "../components/Projects/KanbanBoard";
import TaskboardStats from "../components/TaskBoard/TaskboardStats";
import CustomTask from "../components/TaskBoard/CustomTask";
import TaskDetail from "../components/TaskBoard/TaskDetail";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import Spinner from "../components/ui/Spinner";
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
    checklist: todo.checklist ?? [],
  };
}

function toBoardTask(todo: Todo): BoardTask {
  return {
    id: todo.id,
    label: todo.title,
    description: todo.description,
    status: todo.status || "todo",
    dueDate: todo.dueDate,
    priority: todo.priority || "medium",
    subtasks: todo.subtasks ?? [],
    checklist: todo.checklist ?? [],
  };
}

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const {
    currentProject,
    isLoading,
    fetchById,
    remove: deleteProject,
  } = useProjectStore();
  const todos = useTodoStore((state) => state.todos);
  const fetchTodos = useTodoStore((state) => state.fetchTodos);
  const updateTodo = useTodoStore((state) => state.updateTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const addSubtask = useTodoStore((state) => state.addSubtask);
  const updateSubtask = useTodoStore((state) => state.updateSubtask);
  const deleteSubtask = useTodoStore((state) => state.deleteSubtask);
  const addChecklistItem = useTodoStore((state) => state.addChecklistItem);
  const updateChecklistItem = useTodoStore(
    (state) => state.updateChecklistItem,
  );
  const deleteChecklistItem = useTodoStore(
    (state) => state.deleteChecklistItem,
  );

  const [showCreate, setShowCreate] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) fetchById(projectId);
  }, [projectId, fetchById]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const id = projectId;

  // The opened task is derived from the store so subtask/checklist mutations
  // are reflected immediately without a local snapshot to keep in sync.
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
      <div className="mx-auto flex flex-col gap-5 p-4 sm:p-6">
        <Spinner className="py-10" />
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="mx-auto flex flex-col gap-5 p-4 sm:p-6">
        <Button
          variant="outline"
          size="small"
          text="Back to projects"
          onClick={() => navigate(ROUTES.projects)}
        />
        <ErrorState
          title="Project not found"
          message="It may have been deleted, or the link is invalid."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex flex-col gap-4 p-4 sm:gap-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold uppercase tracking-wide text-(--text-primary) sm:text-2xl">
            {currentProject.name}
          </h1>
          {currentProject.description && (
            <p className="mt-0.5 line-clamp-1 text-xs text-(--text-muted)">
              {currentProject.description}
            </p>
          )}
        </div>

        <Button
          variant="outline"
          size="small"
          onClick={() => navigate(ROUTES.projects)}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          Back
        </Button>
      </div>

      <TaskboardStats
        stats={[
          {
            label: "Total",
            value: stats.total,
            icon: faClipboardList,
            bg: "bg-(--accent-soft)",
            color: "text-(--accent-color)",
          },
          {
            label: "To do",
            value: stats.todoCount,
            icon: faCircle,
            bg: "bg-(--color-warning-soft)",
            color: "text-(--color-warning)",
          },
          {
            label: "In progress",
            value: stats.doingCount,
            icon: faCircleHalfStroke,
            bg: "bg-(--accent-bg)",
            color: "text-(--accent-strong)",
          },
          {
            label: "Done",
            value: stats.doneCount,
            icon: faCheckCircle,
            bg: "bg-(--color-success-soft)",
            color: "text-(--color-success)",
          },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-interface text-xs font-bold uppercase tracking-widest text-(--text-secondary)">
          Board
        </h2>
        <div className="flex items-center gap-3">
          <p className="hidden items-center gap-2 font-interface text-[11px] text-(--text-muted) md:inline-flex">
            Drag tasks between columns to change their status
          </p>
          <Button
            variant="primary"
            size="small"
            onClick={() => setShowCreate(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
            New task
          </Button>
        </div>
      </div>

      {projectTodos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-(--border-color) py-16">
          <EmptyState
            icon={faInbox}
            title="No tasks in this project yet."
            text="Create your first task to start tracking progress."
            action={
              <Button
                variant="outline"
                size="small"
                onClick={() => setShowCreate(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
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
            onAddChecklistItem={async (text) => {
              await addChecklistItem(selectedTask.id, text);
            }}
            onToggleChecklistItem={async (itemId, done) => {
              await updateChecklistItem(selectedTask.id, itemId, { done });
            }}
            onDeleteChecklistItem={async (itemId) => {
              await deleteChecklistItem(selectedTask.id, itemId);
            }}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl shadow-sm bg-(--bg-secondary) px-4 py-3.5">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className="text-xs text-(--color-error)"
            />
            <h3 className="text-xs font-bold uppercase tracking-wide text-(--color-error)">
              Danger zone
            </h3>
          </div>
          <p className="font-interface text-xs text-(--text-muted)">
            This action permanently deletes the project and its tasks.
          </p>
        </div>
        <Button
          variant="outline"
          size="small"
          className="hover:border-(--color-error) hover:text-(--color-error)"
          onClick={() => {
            if (!id) return;
            if (!window.confirm("Delete this project and its tasks permanently?"))
              return;
            deleteProject(id);
            navigate(ROUTES.projects);
          }}
        >
          Delete project
        </Button>
      </div>
    </div>
  );
}
