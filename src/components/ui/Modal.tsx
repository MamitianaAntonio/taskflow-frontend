import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ReactNode, UIEvent } from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useIsMobile } from "../../hooks/useIsMobile";
import CloseButton from "./CloseButton";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: IconDefinition;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Modal({
  open,
  onClose,
  title,
  icon,
  subtitle,
  children,
  footer,
}: ModalProps) {
  const isMobile = useIsMobile(640);
  const [scrollState, setScrollState] = useState({ atTop: true, atBottom: false });

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    setScrollState({
      atTop: el.scrollTop <= 4,
      atBottom: el.scrollHeight - el.scrollTop - el.clientHeight <= 4,
    });
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const overlay = (
    <motion.div
      className="fixed inset-0 z-40 bg-(--overlay)"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    />
  );

  const header = (
    <div
      className={`flex items-center gap-3 px-5 pt-4 pb-3 transition-shadow ${
        scrollState.atTop ? "" : "shadow-sm"
      }`}
    >
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          className="shrink-0 text-base text-(--accent-color)"
          aria-hidden
        />
      )}
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-sans text-sm font-bold text-(--text-primary)">{title}</h3>
        {subtitle && <div className="truncate text-xs text-(--text-muted)">{subtitle}</div>}
      </div>
      <CloseButton onClose={onClose} />
    </div>
  );

  const body = isMobile ? (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[92vh] flex-col overflow-hidden rounded-t-2xl bg-(--bg-secondary) shadow-xl"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex justify-center pt-3 pb-1">
        <div className="h-1.5 w-10 rounded-full bg-(--border-color)" />
      </div>
      {header}
      <div className="overflow-y-auto" onScroll={handleScroll}>
        {children}
      </div>
      {footer && (
        <div
          className={`border-t p-4 transition-colors ${
            scrollState.atBottom ? "border-(--border-color)" : "border-transparent"
          }`}
        >
          {footer}
        </div>
      )}
    </motion.div>
  ) : (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-(--border-color) bg-(--bg-secondary) shadow-2xl"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {header}
        <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
          {children}
        </div>
        {footer && (
          <div
            className={`sticky bottom-0 bg-(--bg-secondary) p-4 transition-colors ${
              scrollState.atBottom ? "border-t border-(--border-color)" : "border-t border-transparent"
            }`}
          >
            {footer}
          </div>
        )}
      </motion.div>
    </motion.div>
  );

  if (isMobile)
    return (
      <>
        {overlay}
        {body}
      </>
    );
  return createPortal(
    <>
      {overlay}
      {body}
    </>,
    document.body
  );
}