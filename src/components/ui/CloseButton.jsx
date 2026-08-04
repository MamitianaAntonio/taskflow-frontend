import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CloseButton({
  onClose,
  icon = faCircle,
  size = "sm",
  className = "",
}) {
  return (
    <button
      onClick={onClose}
      className={`w-7 h-7 flex items-center justify-center rounded-md cursor-pointer
        text-(--text-muted)/30 hover:text-(--color-error) hover:bg-(--bg-primary)
         transition-colors ${className}`}
      aria-label="Close"
    >
      <FontAwesomeIcon icon={icon} size={size} />
    </button>
  );
}
