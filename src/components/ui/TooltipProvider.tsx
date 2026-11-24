import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";

type TooltipSide = "top" | "right" | "bottom" | "left";

interface ActiveTooltip {
  text: string;
  side: TooltipSide;
  rect: DOMRect;
}

const GAP = 10;
const EDGE = 8;
/** Above every overlay in the app (modals, drawers, toasts, boot screen). */
const TOOLTIP_Z_INDEX = 2147483647;

function readSide(el: HTMLElement): TooltipSide {
  const side = el.dataset.tooltipSide;
  return side === "right" || side === "bottom" || side === "left"
    ? side
    : "top";
}

function findTrigger(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) return null;
  return target.closest<HTMLElement>("[data-tooltip], [title]");
}

/**
 * Single app-wide tooltip layer.
 *
 * Any element with `data-tooltip` (or a native `title`) gets the shared
 * TaskFlow tooltip. Rendered in a portal so no parent stacking context or
 * `overflow` can clip it, with the highest possible z-index.
 */
export default function TooltipProvider() {
  const [active, setActive] = useState<ActiveTooltip | null>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const adoptedTitleRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const restoreTitle = () => {
      const el = adoptedTitleRef.current;
      if (!el) return;

      if (el.dataset.tooltipAdopted === "true") {
        const text = el.dataset.tooltip;
        if (text) el.setAttribute("title", text);
        delete el.dataset.tooltipAdopted;
      }

      if (el.dataset.tooltipAria === "true") {
        el.removeAttribute("aria-label");
        delete el.dataset.tooltipAria;
      }

      adoptedTitleRef.current = null;
    };

    const hide = () => {
      triggerRef.current = null;
      restoreTitle();
      setActive(null);
    };

    const show = (el: HTMLElement) => {
      if (triggerRef.current === el) return;

      restoreTitle();

      const title = el.getAttribute("title");
      const text = el.dataset.tooltip ?? title;
      if (!text) return;

      el.dataset.tooltip = text;
      if (title) {
        el.removeAttribute("title");
        el.dataset.tooltipAdopted = "true";
        adoptedTitleRef.current = el;

        // Keep the accessible name when the native title was the only one.
        if (!el.getAttribute("aria-label") && !el.textContent?.trim()) {
          el.setAttribute("aria-label", text);
          el.dataset.tooltipAria = "true";
        }
      }

      triggerRef.current = el;
      setActive({
        text,
        side: readSide(el),
        rect: el.getBoundingClientRect(),
      });
    };

    const handlePointerOver = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const el = findTrigger(event.target);
      if (!el) return;
      if (
        event.relatedTarget instanceof Node &&
        el.contains(event.relatedTarget)
      ) {
        return;
      }
      show(el);
    };

    const handlePointerOut = (event: PointerEvent) => {
      const el = findTrigger(event.target);
      if (!el || el !== triggerRef.current) return;
      if (
        event.relatedTarget instanceof Node &&
        el.contains(event.relatedTarget)
      ) {
        return;
      }
      hide();
    };

    const handleFocusIn = (event: FocusEvent) => {
      const el = findTrigger(event.target);
      // Matches the sidebar's focus-visible behaviour and avoids tooltips on tap.
      if (el && el.matches(":focus-visible")) show(el);
    };

    const handleFocusOut = (event: FocusEvent) => {
      if (
        triggerRef.current &&
        event.relatedTarget instanceof Node &&
        triggerRef.current.contains(event.relatedTarget)
      ) {
        return;
      }
      hide();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") hide();
    };

    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerout", handlePointerOut);
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    document.addEventListener("pointerdown", hide, true);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);

    return () => {
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      document.removeEventListener("pointerdown", hide, true);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
      restoreTitle();
    };
  }, []);

  useLayoutEffect(() => {
    const bubble = bubbleRef.current;
    if (!active || !bubble) return;

    bubble.style.visibility = "hidden";

    const { rect } = active;
    const width = bubble.offsetWidth;
    const height = bubble.offsetHeight;

    let side = active.side;

    // Flip to the opposite side when the requested one would leave the viewport.
    if (side === "top" && rect.top < height + GAP + EDGE) side = "bottom";
    else if (
      side === "bottom" &&
      window.innerHeight - rect.bottom < height + GAP + EDGE
    ) {
      side = "top";
    } else if (
      side === "right" &&
      window.innerWidth - rect.right < width + GAP + EDGE
    ) {
      side = "left";
    } else if (side === "left" && rect.left < width + GAP + EDGE) {
      side = "right";
    }

    let left = 0;
    let top = 0;

    if (side === "top") {
      left = rect.left + rect.width / 2 - width / 2;
      top = rect.top - GAP - height;
    } else if (side === "bottom") {
      left = rect.left + rect.width / 2 - width / 2;
      top = rect.bottom + GAP;
    } else if (side === "right") {
      left = rect.right + GAP;
      top = rect.top + rect.height / 2 - height / 2;
    } else {
      left = rect.left - GAP - width;
      top = rect.top + rect.height / 2 - height / 2;
    }

    const maxLeft = Math.max(EDGE, window.innerWidth - width - EDGE);
    const maxTop = Math.max(EDGE, window.innerHeight - height - EDGE);

    bubble.style.setProperty(
      "--tooltip-enter-x",
      side === "right" ? "-4px" : side === "left" ? "4px" : "0px",
    );
    bubble.style.setProperty(
      "--tooltip-enter-y",
      side === "bottom" ? "-4px" : side === "top" ? "4px" : "0px",
    );
    bubble.style.left = `${Math.min(Math.max(left, EDGE), maxLeft)}px`;
    bubble.style.top = `${Math.min(Math.max(top, EDGE), maxTop)}px`;
    bubble.style.visibility = "visible";
  }, [active]);

  if (!active) return null;

  return createPortal(
    <div
      ref={bubbleRef}
      role="tooltip"
      className="pointer-events-none fixed w-max max-w-[min(20rem,calc(100vw-2rem))] rounded-inner border border-(--border-color) bg-(--bg-primary) px-2.5 py-1 font-interface text-xs font-semibold break-words text-(--text-primary) shadow-lg shadow-(--shadow) motion-safe:animate-[taskflow-tooltip-in_150ms_ease-out]"
      style={
        {
          left: 0,
          top: 0,
          zIndex: TOOLTIP_Z_INDEX,
          visibility: "hidden",
        } as CSSProperties
      }
    >
      {active.text}
    </div>,
    document.body,
  );
}
