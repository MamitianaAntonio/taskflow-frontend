import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getCountPhrase } from "../../constants/taskUtilities";

export default function TaskSection({ icon, label, color, tasks }) {
  return (
    <div
      className="bg-(--bg-secondary) border border-(--border-color) rounded-lg p-4 flex flex-col gap-2"
      style={{ boxShadow: "var(--shadow-pink)" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <FontAwesomeIcon icon={icon} className={`text-sm ${color}`} />
        <p className="text-xs font-semibold font-mono uppercase tracking-widest text-(--text-primary) opacity-60">
          {label}
        </p>
      </div>

      <p className="text-md font-mono text-(--text-secondary) py-2">
        {getCountPhrase(label, tasks.length)}
      </p>
    </div>
  );
}
