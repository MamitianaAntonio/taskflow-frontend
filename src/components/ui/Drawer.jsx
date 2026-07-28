import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

export default function Drawer({ open, onClose, title, children, footer }) {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const mainTop = useMemo(() => {
    if (typeof document === "undefined") return 0;
    const main = document.querySelector("main");
    if (!main) return 0;
    return main.getBoundingClientRect().top;
  }, []);

  const content = (
    <>
      <motion.div
        className="fixed inset-0 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{ backgroundColor: "rgba(0,0,0,0.09)" }}
        onClick={onClose}
      />

      {isMobile ? (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50 bg-(--bg-secondary) shadow-xl max-h-[92vh] overflow-y-auto"
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
            <h3 className="font-semibold text-sm text-(--text-primary)">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg active:bg-(--bg-primary) transition-colors shrink-0"
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faClose} size="md" className="text-(--text-secondary)" />
            </button>
          </div>

          {children}

          {footer && (
            <div className="p-4 border-t border-(--border-color)">
              {footer}
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          className="fixed z-50 w-full max-w-lg bg-(--bg-secondary) shadow-xl overflow-y-auto border-l border-(--border-color)"
          style={{ top: mainTop, right: 0, bottom: 0 }}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="flex justify-between items-center px-4 pt-3 pb-2 border-b border-(--border-color) sticky top-0 bg-(--bg-secondary) z-10">
            <h3 className="font-semibold text-sm text-(--text-primary)">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-md
                text-(--text-muted) hover:text-(--accent-color) hover:bg-(--bg-primary) transition-colors"
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faClose} size="sm" />
            </button>
          </div>

          {children}

          {footer && (
            <div className="p-4 border-t border-(--border-color) sticky bottom-0 bg-(--bg-secondary)">
              {footer}
            </div>
          )}
        </motion.div>
      )}
    </>
  );

  if (isMobile) return content;
  return createPortal(content, document.body);
}
