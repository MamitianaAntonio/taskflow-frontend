import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faFolder,
  faSearch,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import useTodoStore from "../stores/todoStore";
import { useProjectStore } from "../stores/projectStore";
import { statusConfig } from "../constants/taskConfig";
import { ROUTES } from "../constants/routes";
import type { TodoStatus } from "../types/todo";

const MIN_QUERY = 2;
const MAX_PROJECTS = 4;
const MAX_TASKS = 6;

const statusBg: Record<TodoStatus, string> = {
  todo: "bg-(--color-warning-soft)",
  doing: "bg-(--accent-bg)",
  done: "bg-(--color-success-soft)",
};

interface SearchResult {
  id: string;
  icon: IconDefinition;
  iconClasses: string;
  title: string;
  meta: string;
  run: () => void;
}

interface GlobalSearchProps {
  autoFocus?: boolean;
  className?: string;
  onNavigate?: () => void;
}

export default function GlobalSearch({
  autoFocus,
  className = "",
  onNavigate,
}: GlobalSearchProps) {
  const navigate = useNavigate();
  const todos = useTodoStore((state) => state.todos);
  const fetchTodos = useTodoStore((state) => state.fetchTodos);
  const todosLoading = useTodoStore((state) => state.isLoading);
  const projects = useProjectStore((state) => state.projects);
  const fetchProjects = useProjectStore((state) => state.fetchAll);
  const projectsLoading = useProjectStore((state) => state.isLoading);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim();
  const expanded = open && trimmed.length >= MIN_QUERY;

  const go = useCallback(
    (path: string) => {
      navigate(path);
      setQuery("");
      setOpen(false);
      setActive(0);
      onNavigate?.();
    },
    [navigate, onNavigate],
  );

  useEffect(() => {
    if (!expanded) return;
    if (todos.length === 0) fetchTodos().catch(() => {});
    if (projects.length === 0) fetchProjects().catch(() => {});
  }, [expanded, todos, projects, fetchTodos, fetchProjects]);

  const results = useMemo<SearchResult[]>(() => {
    if (trimmed.length < MIN_QUERY) return [];
    const q = trimmed.toLowerCase();

    const projectResults: SearchResult[] = projects
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      )
      .slice(0, MAX_PROJECTS)
      .map((p) => ({
        id: `project-${p.id}`,
        icon: faFolder,
        iconClasses: "bg-(--accent-soft) text-(--accent-strong)",
        title: p.name,
        meta: `${todos.filter((t) => t.projectId === p.id).length} tasks`,
        run: () => go(ROUTES.projectDetails(p.id)),
      }));

    const taskResults: SearchResult[] = todos
      .filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q),
      )
      .slice(0, MAX_TASKS)
      .map((t) => {
        const status = t.status ?? "todo";
        const cfg = statusConfig[status];
        const project = t.projectId
          ? projects.find((p) => p.id === t.projectId)
          : undefined;
        return {
          id: `task-${t.id}`,
          icon: cfg.icon,
          iconClasses: `${statusBg[status]} ${cfg.color}`,
          title: t.title,
          meta: project ? `${project.name} · ${cfg.label}` : cfg.label,
          run: () =>
            go(
              t.projectId
                ? ROUTES.projectDetails(t.projectId)
                : `${ROUTES.tasks}?task=${t.id}`,
            ),
        };
      });

    return [...projectResults, ...taskResults].slice(
      0,
      MAX_PROJECTS + MAX_TASKS,
    );
  }, [trimmed, todos, projects, go]);

  const activeIndex =
    results.length > 0 ? Math.min(active, results.length - 1) : 0;

  // Close the panel when clicking outside.
  useEffect(() => {
    const handleDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleDown);
    return () => document.removeEventListener("mousedown", handleDown);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!expanded || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[activeIndex]?.run();
    }
  };

  const loading = todosLoading || projectsLoading;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="group relative w-full">
        <span
          className="pointer-events-none absolute left-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full
        bg-(--accent-soft) text-(--accent-strong) transition-colors group-focus-within:text-(--accent-color)"
        >
          <FontAwesomeIcon icon={faSearch} size="xs" />
        </span>
        <input
          type="text"
          value={query}
          autoFocus={autoFocus}
          placeholder="Search tasks, projects…"
          aria-label="Search tasks and projects"
          aria-expanded={expanded}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-xl border border-(--border-color) bg-(--bg-primary) py-2.5 pl-10 pr-9 font-interface text-sm text-(--text-primary)
          shadow-sm outline-none transition-all placeholder:text-(--text-muted) focus:border-(--accent-color) focus:ring-2 focus:ring-(--accent-soft)"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full
            text-(--text-muted) transition-colors hover:bg-(--bg-hover) hover:text-(--text-primary)"
          >
            <FontAwesomeIcon icon={faXmark} size="xs" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-x-0 top-full z-50 mt-2 origin-top overflow-hidden rounded-2xl border border-(--border-color) bg-(--bg-primary) shadow-sm"
          >
            <div className="flex items-center justify-between gap-2 border-b border-(--border-color) bg-(--bg-secondary) px-4 py-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-(--text-primary)">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-(--accent-soft) text-(--accent-strong)">
                  <FontAwesomeIcon icon={faSearch} size="xs" />
                </span>
                Results
                <span className="rounded-full bg-(--accent-color) px-1.5 py-0.5 font-interface text-[10px] font-bold text-(--text-white) tabular-nums">
                  {results.length}
                </span>
              </p>
              <span className="flex items-center gap-1 font-interface text-[10px] text-(--text-muted)">
                <kbd className="rounded border border-(--border-color) bg-(--bg-tertiary) px-1 py-0.5">
                  ↑↓
                </kbd>
                <kbd className="rounded border border-(--border-color) bg-(--bg-tertiary) px-1 py-0.5">
                  Enter
                </kbd>
              </span>
            </div>

            {results.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-sm font-semibold text-(--text-primary)">
                  {loading ? "Searching…" : `No results for “${trimmed}”`}
                </p>
                {!loading && (
                  <p className="mt-1 font-interface text-xs text-(--text-muted)">
                    Try a task title or a project name.
                  </p>
                )}
              </div>
            ) : (
              <ul className="max-h-80 overflow-y-auto p-1.5">
                {results.map((result, index) => (
                  <li key={result.id}>
                    <button
                      type="button"
                      onClick={result.run}
                      onMouseEnter={() => setActive(index)}
                      className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors ${
                        index === activeIndex ? "bg-(--bg-hover)" : ""
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${result.iconClasses}`}
                      >
                        <FontAwesomeIcon icon={result.icon} size="xs" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-(--text-primary)">
                          {result.title}
                        </span>
                        <span className="block truncate font-interface text-xs text-(--text-muted)">
                          {result.meta}
                        </span>
                      </span>
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        size="xs"
                        className={`shrink-0 transition-colors ${
                          index === activeIndex
                            ? "text-(--accent-color)"
                            : "text-(--text-muted)"
                        }`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
