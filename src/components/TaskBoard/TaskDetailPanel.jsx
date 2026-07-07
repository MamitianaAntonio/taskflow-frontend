import { faFloppyDisk, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  task, onClose, onSave,
  localTitle, setLocalTitle,
  localStatus, setLocalStatus,
  localPriority, setLocalPriority,
  localDueDate, setLocalDueDate,
  dueDateStr, saving, dirty,
}) {
  const isMobile = useIsMobile();

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-(--overlay) z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />

      <AnimatePresence>
        {isMobile ? (
          /* Mobile: bottom sheet */
          <motion.div
            key="detail-mobile"
            className="fixed bottom-0 left-0 right-0 z-50 bg-(--bg-primary) rounded-t-[28px] shadow-2xl max-h-[90vh] overflow-y-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-(--border-color)" />
            </div>

            <div className="pb-6">
              <Header task={task} onClose={onClose} />
              <div className="px-6 mt-5 space-y-5">
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
              <Actions onClose={onClose} onSave={onSave} saving={saving} dirty={dirty} />
            </div>
          </motion.div>
        ) : (
          /* Desktop: centered modal */
          <motion.div
            key="detail-desktop"
            className="fixed top-1/2 left-1/2 z-50 w-[min(92vw,36rem)] max-h-[92vh] overflow-y-auto
                       bg-(--bg-primary) border border-(--border-color) rounded-xl shadow-[0_22px_60px_rgba(0,0,0,0.14)]"
            initial={{ opacity: 0, y: -20, x: "-50%", translateY: "-50%", scale: 0.96 }}
            animate={{ opacity: 1, y: 0, x: "-50%", translateY: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: 20, x: "-50%", translateY: "-50%", scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div>
              <Header task={task} onClose={onClose} />
              <div className="p-6 mt-5 space-y-5">
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
              <Actions onClose={onClose} onSave={onSave} saving={saving} dirty={dirty} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Header({ task, onClose }) {
  return (
    <div className="flex justify-between items-center px-6 pt-5 pb-4 border-b border-(--border-color)">
      <div>
        <p className="text-[10px] uppercase tracking-[0.35em] text-(--accent-color) font-semibold">
          Task details
        </p>
        <h2 className="mt-1 text-lg font-semibold text-(--text-primary)">{task.label}</h2>
      </div>
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
  );
}

function Actions({ onClose, onSave, saving, dirty }) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-5 mt-5 border-t border-(--border-color)">
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
  );
}
