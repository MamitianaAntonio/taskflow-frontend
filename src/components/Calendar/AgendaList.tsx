import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import CalendarTaskRow from "./CalendarTaskRow";
import { ROUTES } from "../../constants/routes";
import { dayKey, parseDayKey, type DayKey } from "../../utils/calendar";
import { formatDate } from "../../utils/date";
import type { Project } from "../../types/project";
import type { Todo } from "../../types/todo";

interface AgendaListProps {
  today: DayKey;
  overdue: Todo[];
  days: Array<{ day: DayKey; tasks: Todo[] }>;
  deadlines: Array<{ day: DayKey; project: Project }>;
  projectName: (id: string | null | undefined) => string | null;
  onOpenTask: (task: Todo) => void;
  onSelectDay: (day: DayKey) => void;
}

const HEADING =
  "font-interface text-xs font-bold uppercase tracking-widest text-(--text-secondary)";

/** Chronological view: what is late, what is next, and the project goals. */
export default function AgendaList({
  today,
  overdue,
  days,
  deadlines,
  projectName,
  onOpenTask,
  onSelectDay,
}: AgendaListProps) {
  const navigate = useNavigate();

  const tomorrow = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return dayKey(date);
  }, []);

  const dayLabel = (day: DayKey) =>
    day === today ? "Today" : day === tomorrow ? "Tomorrow" : formatDate(parseDayKey(day));

  if (overdue.length === 0 && days.length === 0 && deadlines.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-(--border-color) py-12 text-center font-interface text-xs text-(--text-muted)">
        Nothing scheduled. Tasks with a due date show up here.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {overdue.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className={HEADING}>
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className="mr-2 text-(--color-error)"
            />
            Overdue
          </h3>
          {overdue.map((task) => (
            <CalendarTaskRow
              key={task.id}
              task={task}
              projectName={projectName}
              onOpen={onOpenTask}
            />
          ))}
        </section>
      )}

      {days.length > 0 && (
        <section className="flex flex-col gap-4">
          <h3 className={HEADING}>Upcoming</h3>
          {days.map(({ day, tasks }) => (
            <div key={day} className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => onSelectDay(day)}
                className="flex w-fit items-center gap-2 rounded-md font-interface text-sm font-semibold text-(--text-primary) transition-colors hover:text-(--accent-color)"
              >
                {dayLabel(day)}
                <span className="text-[11px] font-medium text-(--text-muted)">
                  {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
                </span>
              </button>
              {tasks.map((task) => (
                <CalendarTaskRow
                  key={task.id}
                  task={task}
                  projectName={projectName}
                  onOpen={onOpenTask}
                />
              ))}
            </div>
          ))}
        </section>
      )}

      {deadlines.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className={HEADING}>Project deadlines</h3>
          {deadlines.map(({ day, project }) => (
            <button
              key={project.id}
              type="button"
              onClick={() => navigate(ROUTES.projectDetails(project.id))}
              className="flex w-full items-center gap-2.5 rounded-lg border border-(--border-color) bg-(--bg-secondary) px-3 py-2 text-left transition-colors hover:border-(--accent-muted)"
            >
              <FontAwesomeIcon
                icon={faFolderOpen}
                className="shrink-0 text-xs text-(--text-muted)"
              />
              <span className="min-w-0 flex-1 truncate text-sm text-(--text-primary)">
                {project.name}
              </span>
              <span className="shrink-0 font-interface text-[11px] font-semibold text-(--text-muted)">
                {formatDate(parseDayKey(day))}
              </span>
            </button>
          ))}
        </section>
      )}
    </div>
  );
}
