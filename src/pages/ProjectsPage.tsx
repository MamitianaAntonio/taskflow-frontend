import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "../stores/projectStore";
import useTodoStore from "../stores/todoStore";
import ProjectCreation from "../components/Projects/ProjectCreation";
import ProjectSearch from "../components/Projects/ProjectSearch";
import ProjectGrid from "../components/Projects/ProjectGrid";
import { EmptyState, LoadingState, NoResults } from "../components/Projects/ProjectStates";
import Button from "../components/ui/Button";
import ErrorState from "../components/ui/ErrorState";
import PageHeader from "../components/ui/PageHeader";
import { ROUTES } from "../constants/routes";
import { isOverdue } from "../utils/date";
import { loadProjectsIfNeeded, loadTodosIfNeeded } from "../utils/bootstrap";

export default function ProjectsPage() {
  const { projects, isLoading, error, fetchAll, create } = useProjectStore();
  const todos = useTodoStore((state) => state.todos);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProjectsIfNeeded();
    loadTodosIfNeeded();
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await create({
      name: name.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate ? new Date(`${dueDate}T00:00:00`).toISOString() : undefined,
    });
    setName("");
    setDescription("");
    setDueDate("");
  };

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const progress = useMemo(() => {
    const map: Record<string, { total: number; done: number }> = {};
    for (const p of projects) {
      const projectTodos = todos.filter((t) => t.projectId === p.id);
      map[p.id] = {
        total: projectTodos.length,
        done: projectTodos.filter((t) => t.status === "done").length,
      };
    }
    return map;
  }, [projects, todos]);

  const headerStats = useMemo(() => {
    const projectIds = new Set(projects.map((project) => project.id));
    const projectTodos = todos.filter(
      (todo) => todo.projectId && projectIds.has(todo.projectId),
    );
    const open = projectTodos.filter((todo) => todo.status !== "done");

    return {
      open: open.length,
      overdue: open.filter((todo) => isOverdue(todo.dueDate)).length,
    };
  }, [projects, todos]);

  return (
    <div className="flex w-full flex-col gap-4 p-3 sm:gap-5 sm:p-4">
      <PageHeader
        title="Your"
        highlight="projects"
        description="Group your work. Watch it move."
        meta={[
          {
            label: `${projects.length} project${projects.length !== 1 ? "s" : ""}`,
            tone: "accent",
          },
          {
            label:
              headerStats.open > 0
                ? `${headerStats.open} open task${headerStats.open !== 1 ? "s" : ""}`
                : "No open tasks",
            tone: headerStats.open > 0 ? "warning" : "success",
          },
          ...(headerStats.overdue > 0
            ? [
                {
                  label: `${headerStats.overdue} overdue`,
                  tone: "error" as const,
                },
              ]
            : []),
        ]}
      />

      <ProjectCreation
        name={name}
        setName={setName}
        handleCreate={handleCreate}
        description={description}
        setDescription={setDescription}
        dueDate={dueDate}
        setDueDate={setDueDate}
      />

      <ProjectSearch search={search} setSearch={setSearch} />
      <p className="font-interface text-xs font-semibold uppercase tracking-widest text-(--text-primary) opacity-50">
        All projects
      </p>

      {error && (
        <ErrorState
          message="Your projects could not be loaded."
          action={
            <Button
              variant="outline"
              size="small"
              onClick={() => fetchAll().catch(() => {})}
            >
              Retry
            </Button>
          }
        />
      )}

      {!error && isLoading && <LoadingState />}

      {!error && !isLoading && projects.length === 0 && <EmptyState />}

      {!error && !isLoading && projects.length > 0 && filtered.length === 0 && search && (
        <NoResults search={search} />
      )}

      {!error && !isLoading && projects.length > 0 && filtered.length === 0 && !search && (
        <p className="-mt-3 font-interface text-xs text-(--text-muted)">
          Click on a project to view its board and manage tasks.
        </p>
      )}

      {!error && !isLoading && projects.length > 0 && filtered.length > 0 && (
        <ProjectGrid
          projects={filtered}
          progress={progress}
          onSelect={(id) => navigate(ROUTES.projectDetails(id))}
        />
      )}
    </div>
  );
}