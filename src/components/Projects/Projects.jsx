import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "../../stores/projectStore";
import ProjectCreation from "./ProjectCreation";
import ProjectSearch from "./ProjectSearch";
import ProjectGrid from "./ProjectGrid";
import { LoadingState, EmptyState, NoResults } from "./ProjectStates";

function ProjectHeader() {
  return (
    <div>
      <h1
        className="text-xl sm:text-2xl font-semibold uppercase
            bg-linear-to-r from-(--gradient-from) to-(--gradient-to) bg-clip-text text-transparent"
      >
        Projects
      </h1>
      <p className="text-md text-(--text-muted) mt-1.5 font-interface">
        Organize your tasks into projects
      </p>
    </div>
  );
}

export default function Projects() {
  const { projects, loading, fetchAll, create } = useProjectStore();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleCreate = async (e) => {
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

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-5 mx-auto">
      <ProjectHeader />

      <ProjectCreation
        name={name}
        setName={setName}
        handleCreate={handleCreate}
        description={description}
        setDescription={setDescription}
      />

      <ProjectSearch search={search} setSearch={setSearch} />
      <p className="text-xs font-semibold text-(--text-primary) opacity-50 uppercase tracking-widest font-interface">
        ALL PROJECTS
      </p>

      {loading && <LoadingState />}

      {!loading && projects.length === 0 && <EmptyState />}

      {!loading && projects.length > 0 && filtered.length === 0 && search && (
        <NoResults search={search} />
      )}

      {!loading && projects.length > 0 && filtered.length === 0 && !search && (
        <p className="text-xs text-(--text-muted) font-interface -mt-3">
          Click on a project to view its board and manage tasks.
        </p>
      )}

      {!loading && projects.length > 0 && filtered.length > 0 && (
        <ProjectGrid
          projects={filtered}
          onSelect={(id) => navigate(`/dashboard/projects/${id}`)}
        />
      )}
    </div>
  );
}
