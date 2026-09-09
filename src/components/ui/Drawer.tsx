import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import type { ReactNode } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import CloseButton from "./CloseButton";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Drawer({ open, onClose, title, children, footer }: DrawerProps) {
  const isMobile = useIsMobile(640);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const mainTop = useMemo(() => {
    if (typeof document === "undefined") return 0;
    const main = document.querySelector("main");
    return main?.getBoundingClientRect().top ?? 0;
  }, []);

  const mainLeft = useMemo(() => {
    if (typeof document === "undefined") return 0;
    const main = document.querySelector("main");
    return main?.getBoundingClientRect().left ?? 0;
  }, []);

  const overlay = isMobile ? (
    <motion.div
      className="fixed inset-0 z-40 bg-(--overlay)"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    />
  ) : (
    <motion.div
      className="fixed right-0 bottom-0 z-40 bg-(--overlay)"
      style={{ top: mainTop, left: mainLeft }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    />
  );

  const content = (
    <>
      {overlay}

      {isMobile ? (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50 max-h-[92vh] overflow-y-auto bg-(--bg-secondary) shadow-xl"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1.5 w-10 rounded-full bg-(--border-color)" />
          </div>

          <div className="flex items-center justify-between border-b border-(--border-color) px-4 pt-2 pb-2">
            <h3 className="text-sm font-semibold text-(--text-primary)">{title}</h3>
            <button
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-(--text-secondary) transition-colors active:bg-(--bg-primary)"
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faCircle} size="sm" />
            </button>
          </div>

          {children}

          {footer && (
            <div className="border-t border-(--border-color) p-4">{footer}</div>
          )}
        </motion.div>
      ) : (
        <motion.div
          className="fixed right-0 bottom-0 top-0 z-50 w-full max-w-lg overflow-y-auto border-l border-(--border-color) bg-(--bg-secondary) shadow-xl"
          style={{ top: mainTop }}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-(--border-color) bg-(--bg-secondary) px-4 pt-3 pb-2">
            <h3 className="text-sm font-semibold text-(--text-primary)">{title}</h3>
            <CloseButton onClose={onClose} />
          </div>

          {children}

          {footer && (
            <div className="sticky bottom-0 border-t border-(--border-color) bg-(--bg-secondary) p-4">
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