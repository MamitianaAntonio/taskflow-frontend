import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp } from "../motion";

interface EyebrowProps {
  children: ReactNode;
  delay?: number;
}

/** Small sans-serif label with the accent rule, shared by the three tabs. */
export default function Eyebrow({ children, delay = 0 }: EyebrowProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.p
      {...fadeUp(reduceMotion, delay)}
      className="flex items-center gap-3 font-interface text-[11px] font-medium tracking-[0.18em] text-(--text-muted) uppercase"
    >
      <span aria-hidden="true" className="h-px w-7 bg-(--accent-color)" />
      {children}
    </motion.p>
  );
}
