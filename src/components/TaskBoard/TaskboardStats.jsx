import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const cardBg = {
  "Total": "bg-(--text-muted)/5",
  "To do": "bg-(--color-warning)/5",
  "In progress": "bg-(--accent-color)/5",
};

export default function TaskboardStats({ stats }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map(({ label, value, color, icon, bg }) => (
        <div
          key={label}
          className={`rounded-lg border border-(--border-color) p-4 ${cardBg[label] || "bg-(--bg-primary)"}`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase tracking-[0.35em] text-(--text-muted) font-semibold font-interface">
              {label}
            </span>
            <div className={`w-6 h-6 rounded-md flex items-center justify-center ${bg}`}>
              <FontAwesomeIcon icon={icon} className={`text-xs ${color}`} />
            </div>
          </div>
          <p className={`text-2xl font-semibold ${color}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}
