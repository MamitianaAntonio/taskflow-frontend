import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TaskboadStats({ stats }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map(({ label, value, color, icon, bg }) => (
        <div
          key={label}
          className="rounded-lg border border-(--border-color) bg-(--bg-secondary) p-4"
          style={{ boxShadow: 'var(--shadow-pink)' }}
        >
          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center mb-3 ${bg}`}
          >
            <FontAwesomeIcon icon={icon} className={`text-sm ${color}`} />
          </div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-(--text-tertiary)">
            {label}
          </p>
          <p className={`mt-2 text-3xl font-semibold ${color}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}
