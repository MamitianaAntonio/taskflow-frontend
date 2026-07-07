import { faX } from "@fortawesome/free-solid-svg-icons";
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
      await addTodo(payload.title, payload.dueDate, payload.priority, payload.status);
      onClose?.();
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <motion.div
        key="backdrop"
        className="fixed inset-0 bg-(--overlay) z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />

      {isMobile ? (
        <motion.div
          key="bottom-sheet"
          className="fixed bottom-0 left-0 right-0 z-50 bg-(--bg-secondary) rounded-t-[28px] shadow-2xl max-h-[90vh] overflow-y-auto"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
        >
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-(--border-color)" />
          </div>

          <div className="flex justify-between items-center px-6 pt-2 pb-4 border-b border-(--border-color)">
            <h3 className="font-semibold text-base text-(--text-primary)">
              Custom task
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
          <div className="flex justify-between items-center px-6 pt-5 pb-4 border-b border-(--border-color)">
            <h3 className="font-semibold text-base text-(--text-primary)">
              Custom task
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
