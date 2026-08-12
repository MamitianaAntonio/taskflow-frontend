export default function SettingsTabs({ tabs, active, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border font-interface transition-all duration-200 ${
            active === t
              ? "bg-(--text-primary) text-(--bg-primary) border-(--text-primary)"
              : "border-(--border-color) text-(--text-muted) hover:border-(--accent-color) hover:text-(--accent-color)"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}