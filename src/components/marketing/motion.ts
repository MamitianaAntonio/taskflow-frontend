import type { TargetAndTransition, Transition } from "framer-motion";

export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type MotionProps = {
  initial?: TargetAndTransition | boolean;
  animate?: TargetAndTransition;
  transition?: Transition;
};

/** Masked line reveal: slide a line up from below its container. */
export function revealLine(
  reduceMotion: boolean | null,
  delay: number,
): MotionProps {
  if (reduceMotion) return {};

  return {
    initial: { y: "110%" },
    animate: { y: "0%" },
    transition: { duration: 1, ease: EASE, delay },
  };
}

/** Fade a block in while lifting it a few pixels. */
export function fadeUp(
  reduceMotion: boolean | null,
  delay: number,
): MotionProps {
  if (reduceMotion) return {};

  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: EASE, delay },
  };
}
