import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BadgeGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex items-center gap-1.5 px-3 py-2 min-h-[36px] text-xs font-semibold rounded-lg border font-interface transition-all duration-200
            active:scale-95 sm:active:scale-100
            ${value === opt.value
              ? `${opt.classes} scale-105 shadow-sm`
              : "bg-(--bg-primary) border-(--border-color) text-(--text-secondary) hover:border-(--accent-color) hover:text-(--accent-color) hover:scale-105"
            }`}
        >
          {opt.icon && (
            <FontAwesomeIcon icon={opt.icon} className="text-[10px]" />
          )}
          {opt.label}
        </button>
      ))}
    </div>
  );
}
