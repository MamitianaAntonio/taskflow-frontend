import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faRotateRight,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import useSessionBootStore from "../../stores/sessionBootStore";
import { ROUTES } from "../../constants/routes";

export default function WorkspaceBootScreen() {
  const navigate = useNavigate();
  const phase = useSessionBootStore((state) => state.phase);
  const action = useSessionBootStore((state) => state.action);
  const detail = useSessionBootStore((state) => state.detail);
  const error = useSessionBootStore((state) => state.error);
  const retry = useSessionBootStore((state) => state.retry);
  const reset = useSessionBootStore((state) => state.reset);

  const isError = phase === "error";

  const title = isError
    ? "We couldn't reach the server"
    : phase === "waking-server"
      ? "Waking up the server…"
      : phase === "preparing"
        ? "Preparing your workspace…"
        : `${action}…`;

  const subtitle = isError
    ? (error ?? "Something interrupted the connection.")
    : phase === "waking-server"
      ? "The first sign-in can take a few seconds."
      : phase === "preparing"
        ? "Loading your tasks and projects."
        : detail;

  const footnote =
    phase === "waking-server"
      ? "This only happens when the server is waking up."
      : phase === "preparing"
        ? "Almost ready."
        : "This will only take a moment.";

  const backToLogin = () => {
    reset();
    navigate(ROUTES.login);
  };

  return (
    <AnimatePresence>
      {phase !== "idle" && (
        <motion.div
          key="workspace-boot"
          role={isError ? "alert" : "status"}
          aria-live={isError ? "assertive" : "polite"}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            // A warm server answers in a few hundred milliseconds. Delay the
            // fade-in so a fast sign-in does not flash a full screen.
            transition: { delay: 0.22, duration: 0.25, ease: "easeOut" },
          }}
          exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-(--bg-primary) px-6"
        >
          <div className="flex w-full max-w-sm flex-col items-center text-center">
            <div className="mb-8 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-control bg-(--bg-tertiary) ring-1 ring-(--border-color)">
                <img
                  src="/Logo.png"
                  alt=""
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="text-base font-bold tracking-tight text-(--text-primary)">
                Task<span className="text-(--accent-color)">Flow</span>
              </span>
            </div>

            {isError ? (
              <span className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-(--color-error-soft) text-(--color-error)">
                <FontAwesomeIcon icon={faTriangleExclamation} />
              </span>
            ) : (
              <span className="relative mb-6 flex h-11 w-11 items-center justify-center">
                <span className="absolute inset-0 rounded-full border border-(--border-color)" />
                <span className="h-11 w-11 animate-spin rounded-full border-2 border-transparent border-t-(--accent-color)" />
              </span>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={isError ? "error" : `${phase}-${title}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex flex-col items-center gap-2"
              >
                <h1 className="text-xl font-semibold tracking-tight text-(--text-primary)">
                  {title}
                </h1>
                <p className="max-w-xs text-sm leading-relaxed text-(--text-secondary)">
                  {subtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            {isError ? (
              <div className="mt-8 flex flex-col items-center gap-3">
                {retry && (
                  <button
                    type="button"
                    onClick={retry}
                    className="inline-flex items-center gap-2 rounded-lg bg-(--accent-color) px-4 py-2.5 text-sm
                     font-semibold text-(--text-white) transition-colors hover:bg-(--accent-strong) focus-visible:outline-2
                      focus-visible:outline-offset-2 focus-visible:outline-(--accent-color)"
                  >
                    <FontAwesomeIcon icon={faRotateRight} size="sm" />
                    Try again
                  </button>
                )}
                <button
                  type="button"
                  onClick={backToLogin}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-(--text-muted) transition-colors
                   hover:text-(--text-primary) focus-visible:outline-2 focus-visible:outline-offset-2
                    focus-visible:outline-(--accent-color)"
                >
                  <FontAwesomeIcon icon={faArrowLeft} size="xs" />
                  Back to sign in
                </button>
              </div>
            ) : (
              <>
                <span className="relative mt-8 block h-px w-44 overflow-hidden bg-(--border-color)">
                  <span className="absolute inset-y-0 w-1/3 animate-[boot-sweep_1.4s_ease-in-out_infinite] bg-(--accent-color)" />
                </span>
                <p className="mt-6 font-interface text-[11px] tracking-wide text-(--text-muted)">
                  {footnote}
                </p>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
