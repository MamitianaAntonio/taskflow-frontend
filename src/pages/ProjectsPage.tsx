import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "../stores/projectStore";
import useTodoStore from "../stores/todoStore";
import ProjectCreation from "../components/Projects/ProjectCreation";
import ProjectSearch from "../components/Projects/ProjectSearch";
import ProjectGrid from "../components/Projects/ProjectGrid";
import { EmptyState, LoadingState, NoResults } from "../components/Projects/ProjectStates";
import { ROUTES } from "../constants/routes";

export default function ProjectsPage() {
  const { projects, isLoading, fetchAll, create } = useProjectStore();
  const todos = useTodoStore((state) => state.todos);
  const fetchTodos = useTodoStore((state) => state.fetchTodos);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await create({
      name: name.trim(),
      description: description.trim() || undefined,
    });
    setName("");
    setDescription("");
  };

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const progress = useMemo(() => {
    const map: Record<number, { total: number; done: number }> = {};
    for (const p of projects) {
      const projectTodos = todos.filter((t) => t.projectId === p.id);
      map[p.id] = {
        total: projectTodos.length,
        done: projectTodos.filter((t) => t.status === "done").length,
      };
    }
    return map;
  }, [projects, todos]);

  return (
    <div className="mx-auto flex flex-col gap-5 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-bold uppercase tracking-wide text-(--text-primary) sm:text-2xl">
          Projects
        </h1>
        <p className="mt-1.5 font-interface text-(--text-muted)">
          Organize your tasks into projects
        </p>
      </div>

      <ProjectCreation
        name={name}
        setName={setName}
        handleCreate={handleCreate}
        description={description}
        setDescription={setDescription}
      />

      <ProjectSearch search={search} setSearch={setSearch} />
      <p className="font-interface text-xs font-semibold uppercase tracking-widest text-(--text-primary) opacity-50">
        All projects
      </p>

      {isLoading && <LoadingState />}

      {!isLoading && projects.length === 0 && <EmptyState />}

      {!isLoading && projects.length > 0 && filtered.length === 0 && search && (
        <NoResults search={search} />
      )}

      {!isLoading && projects.length > 0 && filtered.length === 0 && !search && (
        <p className="-mt-3 font-interface text-xs text-(--text-muted)">
          Click on a project to view its board and manage tasks.
        </p>
      )}

      {!isLoading && projects.length > 0 && filtered.length > 0 && (
        <ProjectGrid
          projects={filtered}
          progress={progress}
          onSelect={(id) => navigate(ROUTES.projectDetails(id))}
        />
      )}
    </div>
  );
}