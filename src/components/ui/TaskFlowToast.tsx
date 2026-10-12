import toast, { type Toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface TaskFlowToastProps {
  t: Toast;
  type: "success" | "error";
  message: string;
  duration: number;
}

function StrokeIcon({ type }: { type: TaskFlowToastProps["type"] }) {
  const d =
    type === "success" ? "M5 12.5l4.5 4.5L19 7.5" : "M6 6l12 12M18 6L6 18";
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

/*
 * Custom handcrafted toast: pill shape, display font, thin stroke icons and a
 * subtle progress hairline. Theme-aware via design tokens (light/dark).
 */
export default function TaskFlowToast({
  t,
  type,
  message,
  duration,
}: TaskFlowToastProps) {
  const isSuccess = type === "success";

  return (
    <div
      role="status"
      title="Dismiss"
      onClick={() => toast.dismiss(t.id)}
      className="group relative flex w-80 max-w-[calc(100vw-2rem)] cursor-pointer items-center gap-3
        overflow-hidden rounded-full border border-(--border-color) bg-(--bg-secondary)/90
        py-2.5 pl-2.5 pr-4 backdrop-blur-md transition-colors hover:bg-(--bg-secondary)"
      style={{ boxShadow: "0 12px 32px -12px var(--shadow)" }}
    >
      <span
        className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
          isSuccess
            ? "bg-(--color-success-soft) text-(--color-success)"
            : "bg-(--color-error-soft) text-(--color-error)"
        }`}
      >
        <StrokeIcon type={type} />
      </span>

      <p className="min-w-0 flex-1 font-display text-sm font-medium leading-snug text-(--text-primary)">
        {message}
      </p>

      <FontAwesomeIcon
        icon={faXmark}
        className="size-3 shrink-0 text-(--text-muted) opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        aria-hidden="true"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 bottom-0.5 h-px origin-left rounded-full bg-(--text-muted)/30"
        style={{ animation: `taskflow-toast-progress ${duration}ms linear forwards` }}
      />
    </div>
  );
}