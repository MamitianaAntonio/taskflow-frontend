import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CheckBoxProps {
  checked: boolean;
  disabled?: boolean;
  onToggle: () => void;
  ariaLabel?: string;
}

/**
 * Small, handcrafted-looking checkbox used by subtasks and checklist items.
 * Neutral surface at rest, fills with the success tone when checked.
 */
export default function CheckBox({
  checked,
  disabled,
  onToggle,
  ariaLabel,
}: CheckBoxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onToggle}
      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border transition-colors disabled:opacity-50 ${
        checked
          ? "border-(--color-success) bg-(--color-success-soft) text-(--color-success)"
          : "border-(--border-color) bg-(--bg-primary) text-transparent hover:border-(--accent-color)"
      }`}
    >
      <FontAwesomeIcon icon={faCheck} className="text-[9px]" />
    </button>
  );
}
