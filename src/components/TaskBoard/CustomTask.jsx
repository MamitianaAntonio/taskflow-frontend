import { faArrowRight, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TaskForm from "./TaskForm";
import useTodoStore from "../../stores/todoStore";

export default function CustomTask() {
  const addTodo = useTodoStore((state) => state.addTodo);
  const [openPopup, setOpenPopup] = useState(false);

  const close = () => setOpenPopup(false);

  return (
    <div className="w-full rounded-lg border border-(--border-color) bg-(--color-success)/90 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-(--text-white) mb-3">
        Add Custom task
      </p>
      <div className="flex items-center justify-between">
        <p className="font-medium text-(--text-white) text-md">
          Ready to plan more complex task
        </p>
        <FontAwesomeIcon
          icon={faArrowRight}
          size="2x"
          className="text-(--text-white) hover:scale-140 animate-bounce transition-all cursor-pointer"
          onClick={() => setOpenPopup(true)}
        />
      </div>

      <AnimatePresence>
        {openPopup && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 bg-(--overlay) z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
            />

            {/* Modal */}
            <motion.div
              key="modal"
              className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-lg
                         bg-(--bg-secondary) rounded-xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: -20, x: "-50%", translateY: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%", translateY: "-50%" }}
              exit={{ opacity: 0, y: 20, x: "-50%", translateY: "-50%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 pt-5 pb-4 border-b border-(--border-color)">
                <h3 className="font-semibold text-base text-(--text-primary)">
                  Custom task
                </h3>
                <button
                  onClick={close}
                  className="w-7 h-7 flex items-center justify-center rounded-md
                    text-(--text-secondary) hover:text-(--accent-color) hover:bg-(--bg-primary)
                    transition-colors"
                  aria-label="Close"
                >
                  <FontAwesomeIcon icon={faX} size="md" />
                </button>
              </div>

              <TaskForm
                onSubmit={(payload) => {
                  addTodo(payload.title, payload.dueDate, payload.priority, payload.status);
                  close();
                }}
                onCancel={close}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
