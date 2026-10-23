import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faFolder,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import useTodoStore from "../stores/todoStore";
import { useProjectStore } from "../stores/projectStore";
import { statusConfig } from "../constants/taskConfig";
import { ROUTES } from "../constants/routes";

const MIN_QUERY = 2;
const MAX_PROJECTS = 4;
const MAX_TASKS = 6;
const RESULTS_ID = "global-search-results";

const isMac =
  typeof navigator !== "undefined" &&
  /mac|iphone|ipad|ipod/i.test(navigator.userAgent);
const shortcutLabel = isMac ? "⌘ K" : "Ctrl K";

interface SearchResult {
  id: string;
  icon: IconDefinition;
  iconClasses: string;
  title: string;
  meta: string;
  run: () => void;
}

interface ResultSection {
  label: string;
  items: (SearchResult & { index: number })[];
}

interface GlobalSearchProps {
  autoFocus?: boolean;
  className?: string;
  onNavigate?: () => void;
  /** Binds ⌘K / Ctrl K to this field. Enable it on one instance only. */
  shortcut?: boolean;
}

const rowClass =
  "group/row flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors";

/** Highlights the matched part of a title without shouting. */
function Highlight({ text, query }: { text: string; query: string }) {
  const at = text.toLowerCase().indexOf(query);
  if (!query || at === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="text-(--accent-strong)">
        {text.slice(at, at + query.length)}
      </span>
      {text.slice(at + query.length)}
    </>
  );
}

export default function GlobalSearch({
  autoFocus,
  className = "",
  onNavigate,
  shortcut = false,
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
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!shortcut) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shortcut]);

  const { sections, results } = useMemo<{
    sections: ResultSection[];
    results: SearchResult[];
  }>(() => {
    if (trimmed.length < MIN_QUERY) {
      return { sections: [], results: [] };
    }
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
        iconClasses: "text-(--text-muted)",
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
          iconClasses: cfg.color,
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

    const flat: SearchResult[] = [];
    const grouped = [
      { label: "Projects", items: projectResults },
      { label: "Tasks", items: taskResults },
    ]
      .filter((section) => section.items.length > 0)
      .map((section) => ({
        label: section.label,
        items: section.items.map((item) => {
          const index = flat.length;
          flat.push(item);
          return { ...item, index };
        }),
      }));

    return { sections: grouped, results: flat };
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

  // Keep the keyboard selection inside the visible part of the list.
  useEffect(() => {
    if (!expanded) return;
    document
      .getElementById(`search-option-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, expanded]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
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
  const optionId = (index: number) => `search-option-${index}`;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div
        className="group relative rounded-full border border-transparent bg-(--bg-tertiary)
        transition-colors hover:bg-(--bg-hover) focus-within:border-(--accent-color)
        focus-within:bg-(--bg-primary) focus-within:ring-2 focus-within:ring-(--accent-soft)"
      >
        <span
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-muted)
          transition-colors group-focus-within:text-(--accent-color)"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} size="xs" aria-hidden />
        </span>

        <input
          ref={inputRef}
          type="text"
          value={query}
          autoFocus={autoFocus}
          placeholder="Search tasks, projects…"
          role="combobox"
          aria-label="Search tasks and projects"
          aria-expanded={expanded}
          aria-controls={RESULTS_ID}
          aria-autocomplete="list"
          aria-activedescendant={
            expanded && results.length > 0 ? optionId(activeIndex) : undefined
          }
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="h-10 w-full rounded-full bg-transparent pl-9.5 pr-10 font-interface text-sm text-(--text-primary)
          outline-none placeholder:text-(--text-muted)"
        />

        {query ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full
            text-(--text-muted) transition-colors hover:bg-(--bg-hover) hover:text-(--text-primary)"
          >
            <FontAwesomeIcon icon={faXmark} size="xs" />
          </button>
        ) : (
          shortcut && (
            <kbd
              className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center rounded-md
              border border-(--border-color) bg-(--bg-secondary) px-1.5 py-0.5 font-interface text-[10px]
              font-medium text-(--text-muted) transition-opacity group-focus-within:opacity-0 sm:flex"
            >
              {shortcutLabel}
            </kbd>
          )
        )}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="absolute left-1/2 top-full z-50 mt-5 w-full -translate-x-1/2 overflow-hidden rounded-2xl
            border border-(--border-color) bg-(--bg-primary) shadow-xl md:w-[26rem]"
          >
            {results.length === 0 ? (
              <div className="px-4 py-8 text-center">
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
              <ul
                id={RESULTS_ID}
                role="listbox"
                aria-label="Search results"
                className="max-h-80 overflow-y-auto p-1.5"
              >
                {sections.map((section) => (
                  <Fragment key={section.label}>
                    <li
                      role="presentation"
                      className="px-2.5 pb-1 pt-2 font-interface text-[10px] font-semibold uppercase tracking-widest text-(--text-muted)"
                    >
                      {section.label}
                    </li>
                    {section.items.map((result) => {
                      const isActive = result.index === activeIndex;
                      return (
                        <li key={result.id} role="presentation">
                          <button
                            type="button"
                            id={optionId(result.index)}
                            role="option"
                            aria-selected={isActive}
                            onClick={result.run}
                            onMouseEnter={() => setActive(result.index)}
                            className={`${rowClass} ${
                              isActive ? "bg-(--bg-hover)" : ""
                            }`}
                          >
                            <FontAwesomeIcon
                              icon={result.icon}
                              size="xs"
                              aria-hidden
                              className={`w-3.5 shrink-0 ${result.iconClasses}`}
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm text-(--text-primary)">
                                <Highlight text={result.title} query={trimmed.toLowerCase()} />
                              </span>
                              <span className="block truncate font-interface text-xs text-(--text-muted)">
                                {result.meta}
                              </span>
                            </span>
                            <FontAwesomeIcon
                              icon={faChevronRight}
                              size="2xs"
                              aria-hidden
                              className={`shrink-0 text-(--accent-color) transition-opacity ${
                                isActive ? "opacity-100" : "opacity-0"
                              }`}
                            />
                          </button>
                        </li>
                      );
                    })}
                  </Fragment>
                ))}
              </ul>
            )}

            <div className="hidden items-center justify-between border-t border-(--border-color) px-3 py-2 font-interface text-[10px] text-(--text-muted) sm:flex">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-(--border-color) bg-(--bg-tertiary) px-1 py-0.5">
                  ↑↓
                </kbd>
                Navigate
              </span>
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-(--border-color) bg-(--bg-tertiary) px-1 py-0.5">
                    ↵
                  </kbd>
                  Open
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-(--border-color) bg-(--bg-tertiary) px-1 py-0.5">
                    esc
                  </kbd>
                  Close
                </span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
