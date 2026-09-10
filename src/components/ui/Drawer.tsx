import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ReactNode, UIEvent } from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useIsMobile } from "../../hooks/useIsMobile";
import CloseButton from "./CloseButton";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: IconDefinition;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Drawer({
  open,
  onClose,
  title,
  icon,
  subtitle,
  children,
  footer,
}: DrawerProps) {
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
          onScroll={handleScroll}
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1.5 w-10 rounded-full bg-(--border-color)" />
          </div>

          <div className={`sticky top-0 z-10 flex items-center gap-3 bg-(--bg-secondary)/90 px-4 pt-2.5 pb-3 backdrop-blur-md transition-shadow ${scrollState.atTop ? "" : "shadow-sm"}`}>
            {icon && (
              <FontAwesomeIcon
                icon={icon}
                className="shrink-0 text-base text-(--accent-color)"
                aria-hidden
              />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-sans text-sm font-bold text-(--text-primary)">
                {title}
              </h3>
              {subtitle && (
                <div className="truncate text-xs text-(--text-muted)">{subtitle}</div>
              )}
            </div>
            <CloseButton onClose={onClose} />
          </div>

          {children}

          {footer && (
            <div className={`border-t p-4 transition-colors ${scrollState.atBottom ? "border-(--border-color)" : "border-transparent"}`}>
              {footer}
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          className="fixed z-50 flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-(--border-color) bg-(--bg-secondary) shadow-2xl"
          style={{ top: mainTop + 16, bottom: 16, right: 16 }}
          initial={{ opacity: 0, x: 32, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 32, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3 bg-(--bg-secondary)/90 px-4 pt-3 pb-3 backdrop-blur-md">
            {icon && (
              <FontAwesomeIcon
                icon={icon}
                className="shrink-0 text-base text-(--accent-color)"
                aria-hidden
              />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-sans text-sm font-bold text-(--text-primary)">
                {title}
              </h3>
              {subtitle && (
                <div className="truncate text-xs text-(--text-muted)">{subtitle}</div>
              )}
            </div>
            <CloseButton onClose={onClose} />
          </div>

          <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
            {children}
          </div>

          {footer && (
            <div className={`bg-(--bg-secondary) p-4 transition-colors ${scrollState.atBottom ? "border-t border-(--border-color)" : "border-t border-transparent"}`}>
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
