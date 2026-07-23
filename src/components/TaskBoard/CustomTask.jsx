import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TaskForm from "./TaskForm";
import useTodoStore from "../../stores/todoStore";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

export default function CustomTask({ onClose }) {
  const addTodo = useTodoStore((state) => state.addTodo);
  const [creating, setCreating] = useState(false);
  const isMobile = useIsMobile();

  const handleCreate = async (payload) => {
    setCreating(true);
    try {
      await addTodo(
        payload.title,
        payload.dueDate,
        payload.priority,
        payload.status,
      );
      onClose?.();
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <motion.div
        key="backdrop"
        className="absolute inset-0 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{ backgroundColor: "rgba(0,0,0,0.09)" }}
        onClick={onClose}
      />

      {isMobile ? (
        <motion.div
          key="bottom-sheet"
          className="fixed bottom-0 left-0 right-0 z-50 bg-(--bg-secondary) rounded-t-[28px] shadow-xl max-h-[92vh] overflow-y-auto"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1.5 rounded-full bg-(--border-color)" />
          </div>

          <div className="flex justify-between items-center px-4 pt-2 pb-2 border-b border-(--border-color)">
            <h3 className="font-medium font-mono text-base text-(--text-primary)">
              Custom task
            </h3>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-lg active:bg-(--bg-primary) transition-colors"
              aria-label="Close"
            >
              <FontAwesomeIcon
                icon={faClose}
                size="md"
                className="text-(--text-secondary)"
              />
            </button>
          </div>

          <TaskForm
            onSubmit={handleCreate}
            onCancel={onClose}
            loading={creating}
          />
        </motion.div>
      ) : (
        <motion.div
          key="modal"
          className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-lg
                     bg-(--bg-secondary) rounded-xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: -20, x: "-50%", translateY: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%", translateY: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%", translateY: "-50%" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="flex justify-between items-center px-4 pt-2 pb-2 border-b border-(--border-color)">
            <h3 className="font-medium font-mono text-base text-(--text-primary)">
              Custom task
            </h3>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-md
                text-(--text-secondary) hover:text-(--accent-color) hover:bg-(--bg-primary)
                transition-colors"
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faClose} size="md" />
            </button>
          </div>

          <TaskForm
            onSubmit={handleCreate}
            onCancel={onClose}
            loading={creating}
          />
        </motion.div>
      )}
    </>
  );
}
