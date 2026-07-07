import { faFloppyDisk, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import TaskDetailFields from "./TaskDetailFields";
import Button from "../ui/Button";

function useClosingAnimation(onClose, duration = 200) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, duration);
  };

  return { closing, handleClose };
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

export default function TaskDetailPanel({
  task, onClose, onSave,
  localTitle, setLocalTitle,
  localStatus, setLocalStatus,
  localPriority, setLocalPriority,
  localDueDate, setLocalDueDate,
  dueDateStr, saving, dirty, hasChanges,
}) {
  const { closing, handleClose } = useClosingAnimation(onClose, 220);
  const isMobile = useIsMobile();

  const containerClass = isMobile
    ? "fixed bottom-0 left-0 right-0 z-50 rounded-t-[28px]"
    : "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-lg";

  const animationClass = closing
    ? "opacity-0 translate-y-8 scale-[0.98]"
    : "opacity-100 translate-y-0 scale-100";

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-200 ${
          closing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      />

      <div
        className={`border border-(--border-color) bg-(--bg-primary) shadow-[0_22px_60px_rgba(0,0,0,0.14)] p-6 w-[min(92vw,36rem)] max-h-[92vh] overflow-y-auto transition-all duration-200 ${containerClass} ${animationClass}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-(--accent-color)">Détails de la tâche</p>
            <h2 className="mt-2 text-xl font-semibold text-(--text-primary)">{task.label}</h2>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-2 text-(--text-tertiary) transition hover:bg-(--bg-secondary) hover:text-(--accent-color)"
            aria-label="Fermer"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          <TaskDetailFields
            localTitle={localTitle}
            setLocalTitle={setLocalTitle}
            localStatus={localStatus}
            setLocalStatus={setLocalStatus}
            localPriority={localPriority}
            setLocalPriority={setLocalPriority}
            localDueDate={localDueDate}
            setLocalDueDate={setLocalDueDate}
            dueDateStr={dueDateStr}
            saving={saving}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-5 mt-5 border-t border-(--border-color)">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleClose}
            icon={<FontAwesomeIcon icon={faXmark} />}
            text="Cancel"
            disabled={saving}
          />
          <Button
            variant="primary"
            className="w-full sm:w-auto"
            onClick={onSave}
            loading={saving}
            disabled={!dirty && !hasChanges}
            icon={<FontAwesomeIcon icon={faFloppyDisk} />}
            text="Save changes"
          />
        </div>
      </div>
    </>
  );
}
