interface SettingsTabsProps {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}

export default function SettingsTabs({ tabs, active, onChange }: SettingsTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`font-interface rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
            active === t
              ? "border-(--accent-color) bg-(--accent-soft) text-(--accent-strong)"
              : "border-(--border-color) text-(--text-muted) hover:border-(--accent-color) hover:text-(--accent-color)"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}