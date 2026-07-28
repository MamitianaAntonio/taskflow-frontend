import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function TaskSection({ icon, label, color, tasks }) {
  const count = tasks.length;
  const urgent = tasks.some((t) => t.overdue);

  return (
    <div className="bg-(--bg-secondary) shadow-sm border border-(--border-color) rounded-lg p-3 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-(--bg-primary)">
        <FontAwesomeIcon icon={icon} className={`text-sm ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-(--text-primary) opacity-60 font-interface">
            {label}
          </p>
          {urgent && (
            <span className="w-1.5 h-1.5 rounded-full bg-(--color-error) animate-pulse" />
          )}
        </div>
        <p className={`text-lg font-bold font-mono ${color}`}>{count}</p>
      </div>
      {count > 0 && (
        <FontAwesomeIcon
          icon={faArrowRight}
          className={`text-xs ${color} opacity-50`}
        />
      )}
    </div>
  );
}
