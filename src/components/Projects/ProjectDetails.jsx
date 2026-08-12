import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faFolderBlank,
  faCircle,
  faCircleHalfStroke,
  faClipboardList,
  faPlus,
  faInbox,
  faCircleInfo,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence } from "framer-motion";
import { useProjectStore } from "../../stores/projectStore";
import useTodoStore from "../../stores/todoStore";
import Button from "../ui/Button";
import KanbanBoard from "./KanbanBoard";
import TaskboardStats from "../TaskBoard/TaskboardStats";
import CustomTask from "../ui/CustomTask";
import TaskDetail from "../TaskBoard/TaskDetail";

function mapTodoForBoard(todo) {
  return {
    id: todo.id,
    title: todo.title,
    status: todo.status || "todo",
    dueDate: todo.dueDate,
    priority: todo.priority || "medium",
    updatedAt: todo.updatedAt,
  };
}

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentProject, loading, fetchById } = useProjectStore();
  const todos = useTodoStore((state) => state.todos);
  const fetchTodos = useTodoStore((state) => state.fetchTodos);
  const updateTodo = useTodoStore((state) => state.updateTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const deleteProject = useProjectStore((state) => state.remove);

  const [showCreate, setShowCreate] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    if (projectId) fetchById(Number(projectId));
  }, [projectId, fetchById]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const projectTodos = useMemo(
    () =>
      todos
        .filter((t) => t.projectId === Number(projectId))
        .map(mapTodoForBoard)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    [todos, projectId],
  );

  const stats = useMemo(() => {
    const todoCount = projectTodos.filter((t) => t.status === "todo").length;
    const doingCount = projectTodos.filter((t) => t.status === "doing").length;
    return { todoCount, doingCount, total: projectTodos.length };
  }, [projectTodos]);

  const handleStatusChange = (taskId, newStatus) => {
    updateTodo(taskId, { status: newStatus });
  };

  const handleDelete = (taskId) => {
    deleteTodo(taskId);
    setSelectedTask((prev) => (prev?.id === taskId ? null : prev));
  };

  const handleTaskUpdate = async (taskId, changes) => {
    await updateTodo(taskId, changes);
    setSelectedTask((prev) => {
      if (!prev || prev.id !== taskId) return prev;
      const mapped = { ...changes };
      if (mapped.title !== undefined) {
        mapped.label = mapped.title;
        delete mapped.title;
      }
      return { ...prev, ...mapped };
    });
  };

  const handleTaskClick = (task) => {
    const original = todos.find((t) => t.id === task.id);
    if (original) {
      setSelectedTask({
        id: original.id,
        label: original.title,
        status: original.status || "todo",
        dueDate: original.dueDate,
        priority: original.priority || "medium",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex flex-col gap-5 mx-auto">
        <p className="text-xs text-(--text-muted) text-center py-10 font-interface">
          Loading project...
        </p>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="p-4 sm:p-6 flex flex-col gap-5 mx-auto">
        <Button
          variant="outline"
          size="small"
          text="Back to projects"
          onClick={() => navigate("/dashboard/projects")}
        />
        <div className="py-20 flex flex-col items-center gap-2 text-(--text-secondary)">
          <FontAwesomeIcon
            icon={faFolderBlank}
            className="text-4xl opacity-30"
          />
          <p className="text-sm font-medium text-(--text-primary)">
            Project not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1
            className="text-xl sm:text-2xl font-semibold uppercase truncate
            bg-linear-to-r from-(--gradient-from) to-(--gradient-to) bg-clip-text text-transparent"
          >
            {currentProject.name}
          </h1>
          {currentProject.description && (
            <p className="text-xs text-(--text-muted) mt-0.5 line-clamp-1">
              {currentProject.description}
            </p>
          )}
        </div>

        <Button
          variant="outline"
          size="small"
          onClick={() => navigate("/dashboard/projects")}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          Back
        </Button>
      </div>

      {/* Stats */}
      <TaskboardStats
        stats={[
          {
            label: "Total",
            value: stats.total,
            color: "text-(--text-primary)",
            icon: faClipboardList,
            bg: "bg-(--text-muted)/10",
          },
          {
            label: "To do",
            value: stats.todoCount,
            color: "text-(--color-warning)",
            icon: faCircle,
            bg: "bg-(--color-warning)/10",
          },
          {
            label: "In progress",
            value: stats.doingCount,
            color: "text-(--accent-color)",
            icon: faCircleHalfStroke,
            bg: "bg-(--accent-color)/10",
          },
        ]}
      />

      {/* Actions + Helper */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[14px] text-(--text-muted) font-interface">
          <FontAwesomeIcon icon={faCircleInfo} size="xl" />
          <span>Drag tasks between columns to change their status</span>
        </div>

        <Button
          variant="primary"
          size="medium"
          onClick={() => setShowCreate(true)}
        >
          <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
          New task
        </Button>
      </div>

      {/* Kanban Board */}
      {projectTodos.length === 0 ? (
        <div
          className="flex flex-col gap-2 items-center text-(--text-muted) py-16 rounded-xl border
         border-dashed border-(--border-color)"
        >
          <FontAwesomeIcon
            size="2x"
            icon={faInbox}
            className="text-(--text-muted) opacity-50"
          />
          <p className="text-sm font-medium text-(--text-primary)">
            No tasks in this project yet.
          </p>
          <p className="text-xs text-(--text-muted)">
            Create your first task to start tracking progress.
          </p>
          <Button
            variant="outline"
            size="small"
            onClick={() => setShowCreate(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
            Add first task
          </Button>
        </div>
      ) : (
        <KanbanBoard
          tasks={projectTodos}
          onTaskClick={handleTaskClick}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}

      {/* Create Task */}
      <AnimatePresence>
        {showCreate && (
          <CustomTask
            key="create-task"
            onClose={() => setShowCreate(false)}
            projectId={Number(projectId)}
          />
        )}
      </AnimatePresence>

      {/* Task Detail */}
      <AnimatePresence>
        {selectedTask && (
          <TaskDetail
            key="task-detail"
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={handleTaskUpdate}
          />
        )}
      </AnimatePresence>

      {/* warning fields */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div className="flex flex-row items-center gap-2">
            <FontAwesomeIcon
              icon={faWarning}
              size="1x"
              className="text-(--color-error)"
            />
            <h3 className="font-bold text-(--color-error) text-md font-sans">
              WARNING
            </h3>
          </div>
          <p className="text-(--text-muted) font-sans">
            Do you want to delete your project ?
          </p>
        </div>
        <Button
          variant="outline"
          size="small"
          className="hover:border-(--color-error) hover:text-(--color-error)"
          onClick={() => {
            deleteProject(Number(projectId));
            navigate("/dashboard/projects");
          }}
        >
          Delete project
        </Button>
      </div>
    </div>
  );
}
