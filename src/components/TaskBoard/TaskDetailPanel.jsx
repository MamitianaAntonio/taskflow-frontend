import { faFloppyDisk, faX, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TaskDetailFields from "./TaskDetailFields";
import Button from "../ui/Button";

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
  task,
  onClose,
  onSave,
  localTitle,
  setLocalTitle,
  localStatus,
  setLocalStatus,
  localPriority,
  setLocalPriority,
  localDueDate,
  setLocalDueDate,
  dueDateStr,
  saving,
  dirty,
}) {
  const isMobile = useIsMobile();

  return (
    <>
      <motion.div
        key="backdrop"
        className="absolute inset-0 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{ backgroundColor: "rgba(0,0,0,0.06)" }}
        onClick={onClose}
      />

      {isMobile ? (
        <motion.div
          key="detail-mobile"
          className="fixed bottom-0 left-0 right-0 z-50 bg-(--bg-secondary) rounded-t-md border-t-2 border-t-(--border-color)
          shadow-2xl max-h-[92vh] overflow-y-auto"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1.5 rounded-full bg-(--border-color)" />
          </div>

          <div className="flex justify-between items-center px-5 pt-2 pb-4 border-b border-(--border-color)">
            <h3 className="font-semibold text-base text-(--text-primary) truncate pr-2">
              {task.label}
            </h3>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-lg active:bg-(--bg-primary) transition-colors shrink-0"
              aria-label="Close"
            >
              <FontAwesomeIcon
                icon={faX}
                size="md"
                className="text-(--text-secondary)"
              />
            </button>
          </div>

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

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 p-4 mt-2 border-t border-(--border-color)">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={onClose}
              icon={<FontAwesomeIcon icon={faXmark} />}
              text="Cancel"
              disabled={saving}
            />
            <Button
              variant="primary"
              className="w-full sm:w-auto"
              onClick={onSave}
              loading={saving}
              disabled={!dirty}
              icon={<FontAwesomeIcon icon={faFloppyDisk} />}
              text="Save changes"
            />
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="detail-desktop"
          className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-lg
                     bg-(--bg-secondary) rounded-xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: -20, x: "-50%", translateY: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%", translateY: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%", translateY: "-50%" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="flex justify-between items-center px-6 pt-5 pb-4 border-b border-(--border-color)">
            <h3 className="font-semibold text-base text-(--text-primary)">
              {task.label}
            </h3>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-md
                text-(--text-secondary) hover:text-(--accent-color) hover:bg-(--bg-primary)
                transition-colors"
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faX} size="md" />
            </button>
          </div>

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

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 p-4 mt-2 border-t border-(--border-color)">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={onClose}
              icon={<FontAwesomeIcon icon={faXmark} />}
              text="Cancel"
              disabled={saving}
            />
            <Button
              variant="primary"
              className="w-full sm:w-auto"
              onClick={onSave}
              loading={saving}
              disabled={!dirty}
              icon={<FontAwesomeIcon icon={faFloppyDisk} />}
              text="Save changes"
            />
          </div>
        </motion.div>
      )}
    </>
  );
}
