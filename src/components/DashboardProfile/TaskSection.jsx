import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getCountPhrase } from "../../constants/taskUtilities";

export default function TaskSection({ icon, label, color, tasks }) {
  const borderColor = color.replace("text-", "border-l-");

  return (
    <div
      className={`bg-(--bg-tertiary) border border-(--border-color) rounded-lg p-4 flex flex-col gap-2 border-l-4 ${color.replace("text-", "border-l-")}`}
      style={{ boxShadow: "var(--shadow-pink)" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-6 h-6 rounded-md flex items-center justify-center ${color.replace("text-", "bg-")}/15`}>
          <FontAwesomeIcon icon={icon} className={`text-xs ${color}`} />
        </div>
        <p className="text-xs font-semibold font-mono uppercase tracking-widest text-(--text-primary)">
          {label}
        </p>
      </div>

      <p className="text-md font-mono text-(--text-secondary) py-2">
        {getCountPhrase(label, tasks.length)}
      </p>
    </div>
  );
}
