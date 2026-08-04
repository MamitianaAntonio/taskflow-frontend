import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faFolderBlank,
  faCircle,
  faCircleCheck,
  faCircleHalfStroke,
  faInbox,
} from "@fortawesome/free-solid-svg-icons";
import { useProjectStore } from "../../stores/projectStore";
import useTodoStore from "../../stores/todoStore";
import Button from "../ui/Button";

const statusIcon = {
  todo: faCircle,
  doing: faCircleHalfStroke,
  done: faCircleCheck,
};

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentProject, loading, fetchById } = useProjectStore();
  const todos = useTodoStore((state) => state.todos);
  const fetchTodos = useTodoStore((state) => state.fetchTodos);

  useEffect(() => {
    if (projectId) fetchById(Number(projectId));
  }, [projectId, fetchById]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

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

  const projectTodos = todos.filter((t) => t.projectId === Number(projectId));

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-5 mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-xl sm:text-2xl font-semibold uppercase
            bg-linear-to-r from-(--gradient-from) to-(--gradient-to) bg-clip-text text-transparent"
          >
            {currentProject.name}
          </h1>
        </div>
        <Button
          variant="outline"
          size="small"
          icon={<FontAwesomeIcon icon={faArrowLeft} />}
          text="Back"
          onClick={() => navigate("/dashboard/projects")}
        />
      </div>

      <div className="rounded-xl border border-(--border-color) bg-(--bg-secondary) p-4 flex flex-col gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faFolderBlank}
            className="text-sm text-(--accent-color)"
          />
          <span className="text-sm font-semibold text-(--text-primary)">
            Description
          </span>
        </div>
        {currentProject.description ? (
          <p className="text-xs text-(--text-muted)">
            {currentProject.description}
          </p>
        ) : (
          <p className="text-xs text-(--text-muted) italic">No description</p>
        )}
        <div className="border-t border-(--border-color) pt-3 flex gap-6 text-[11px] text-(--text-muted) font-interface">
          <span>
            Created: {new Date(currentProject.createdAt).toLocaleDateString()}
          </span>
          <span>
            Updated: {new Date(currentProject.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <p className="text-xs font-semibold text-(--text-primary) opacity-50 uppercase tracking-widest font-interface">
        TASKS ({projectTodos.length})
      </p>

      {projectTodos.length === 0 ? (
        <div className="flex flex-col gap-2 items-center text-(--text-muted) py-10 font-interface rounded-xl border
         border-dashed border-(--border-color)">
          <FontAwesomeIcon size="2x" icon={faInbox} className="text-(--accent-color) opacity-50" />
          <span className="text-md text-(--text-secondary)">No tasks in this project yet.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {projectTodos.map((todo) => (
            <div
              key={todo.id}
              className={`rounded-xl border border-(--border-color) bg-(--bg-secondary) px-4 py-3 flex items-center gap-3 shadow-sm relative
                 overflow-hidden before:absolute before:inset-y-0 before:left-0 before:w-0.75 before:rounded-l-xl ${
                todo.status === "done"
                  ? "before:bg-(--color-success)"
                  : todo.status === "doing"
                    ? "before:bg-(--color-warning)"
                    : "before:bg-(--text-muted)"
              }`}
            >
              <FontAwesomeIcon
                icon={statusIcon[todo.status] || faCircle}
                className={`text-xs ${todo.status === "done"
                  ? "text-(--color-success)"
                  : todo.status === "doing"
                    ? "text-(--color-warning)"
                    : "text-(--text-muted)"
                  }`}
              />
              <span
                className={`text-sm flex-1 ${todo.status === "done"
                  ? "line-through text-(--text-muted)"
                  : "text-(--text-primary)"
                  }`}
              >
                {todo.title}
              </span>
              {todo.priority && (
                <span className={`text-[10px] uppercase font-interface px-1.5 py-0.5 rounded ${
                  todo.status === "done"
                    ? "text-(--color-success) bg-(--color-success)/10"
                    : todo.status === "doing"
                      ? "text-(--color-warning) bg-(--color-warning)/10"
                      : "text-(--text-muted) bg-(--border-color)/30"
                }`}>
                  {todo.priority || todo.status}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
