import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import EmptyState from "../components/ui/EmptyState";

export default function CalendarPage() {
  return (
    <div className="mx-auto flex flex-col gap-5 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-bold uppercase tracking-wide text-(--text-primary) sm:text-2xl">
          Calendar
        </h1>
        <p className="mt-1.5 font-interface text-(--text-muted)">
          See every deadline at a glance
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-(--border-color)">
        <EmptyState
          icon={faCalendarDays}
          title="Nothing scheduled yet."
          text="Tasks with a due date show up here."
        />
      </div>
    </div>
  );
}
