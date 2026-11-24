import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useReducedMotion,
} from "framer-motion";
import type { ReactNode, UIEvent } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import CloseButton from "./CloseButton";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

function DrawerContent({
  onClose,
  title,
  icon,
  subtitle,
  children,
  footer,
}: Omit<DrawerProps, "open">) {
  const isMobile = useIsMobile(640);
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const [atTop, setAtTop] = useState(true);

  // Mesuré à chaque ouverture (le composant est monté uniquement quand open)
  const [anchor] = useState(() => {
    const rect = document.querySelector("main")?.getBoundingClientRect();
    return { top: rect?.top ?? 0, left: rect?.left ?? 0 };
  });

  // Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Blocage du scroll de la page + gestion du focus
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    setAtTop(event.currentTarget.scrollTop <= 4);
  };

  const fade = { duration: reduceMotion ? 0 : 0.2 };

  const overlay = (
    <motion.div
      aria-hidden="true"
      className={`z-50 bg-(--overlay) backdrop-blur-[2px] ${
        isMobile ? "fixed inset-0" : "fixed right-0 bottom-0"
      }`}
      style={isMobile ? undefined : { top: anchor.top, left: anchor.left }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={fade}
      onClick={onClose}
    />
  );

  const header = (
    <div
      className={`flex shrink-0 items-center gap-2.5 border-b bg-(--bg-secondary) px-4 pt-1 pb-2.5 transition-[border-color,box-shadow] duration-200 sm:px-5 sm:pt-3.5 ${
        atTop ? "border-transparent" : "border-(--border-color) shadow-sm"
      }`}
    >
      {icon && (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-control bg-(--accent-soft) text-(--accent-strong)">
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <h3
          id={titleId}
          className="truncate text-[15px] font-semibold leading-tight tracking-tight text-(--text-primary)"
        >
          {title}
        </h3>
        {subtitle && (
          <div className="mt-0.5 truncate font-interface text-[11px] text-(--text-muted)">
            {subtitle}
          </div>
        )}
      </div>
      <CloseButton onClose={onClose} />
    </div>
  );

  const body = (
    <div
      className="flex-1 overflow-y-auto overscroll-contain"
      onScroll={handleScroll}
    >
      {children}
    </div>
  );

  const footerBar = footer && (
    <div className="shrink-0 border-t border-(--border-color) bg-(--bg-secondary) px-4 py-2.5 sm:px-5 sm:py-3">
      {footer}
    </div>
  );

  return (
    <>
      {overlay}

      {isMobile ? (
        <motion.div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col overflow-hidden rounded-t-2xl border-t border-(--border-color) bg-(--bg-secondary) shadow-xl outline-none"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", damping: 32, stiffness: 320 }
          }
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          drag="y"
          dragControls={dragControls}
          dragListener={false}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.6 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 100 || info.velocity.y > 500) onClose();
          }}
        >
          {/* Poignée : seule zone qui déclenche le drag */}
          <div
            className="flex shrink-0 cursor-grab touch-none justify-center pt-2.5 pb-1.5 active:cursor-grabbing"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <div className="h-1 w-9 rounded-full bg-(--border-color)" />
          </div>

          {header}
          {body}
          {footerBar}
        </motion.div>
      ) : (
        <motion.div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed z-50 flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-(--border-color) bg-(--bg-secondary) shadow-2xl outline-none"
          style={{ top: anchor.top + 12, bottom: 12, right: 12 }}
          initial={{ opacity: 0, x: 32, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 32, scale: 0.98 }}
          transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
        >
          {header}
          {body}
          {footerBar}
        </motion.div>
      )}
    </>
  );
}

export default function Drawer({ open, ...rest }: DrawerProps) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>{open && <DrawerContent {...rest} />}</AnimatePresence>,
    document.body,
  );
}