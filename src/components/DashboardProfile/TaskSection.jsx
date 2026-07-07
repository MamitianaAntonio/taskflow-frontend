import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function TaskSection({ icon, label, color, tasks }) {
  const count = tasks.length;

  const cssVar = color.match(/var\((.+?)\)/)?.[1];

  return (
    <div
      className="border border-(--border-color) rounded-lg p-3 flex items-center gap-3"
      style={{ background: `linear-gradient(135deg, var(--bg-secondary) 60%, color-mix(in srgb, var(${cssVar}) 8%, transparent))` }}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-(--bg-primary)">
        <FontAwesomeIcon icon={icon} className={`text-sm ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-(--text-primary) opacity-60 font-interface">
          {label}
        </p>
        <p className={`text-lg font-bold font-mono ${color}`}>
          {count}
        </p>
      </div>
      {count > 0 && (
        <FontAwesomeIcon icon={faArrowRight} className={`text-xs ${color} opacity-50`} />
      )}
    </div>
  );
}
