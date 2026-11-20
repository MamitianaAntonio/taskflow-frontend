import { motion, useReducedMotion } from "framer-motion";

/** Two phases of the same wave, so the line under "flow" can drift. */
const WAVE_A = "M2 7C18 7 22 3 38 7C54 11 58 11 74 7C90 3 94 3 110 7";
const WAVE_B = "M2 7C18 7 22 11 38 7C54 3 58 3 74 7C90 11 94 11 110 7";

interface FlowWordProps {
  className?: string;
}

/** The accented "flow" with its small drifting underline. */
export default function FlowWord({ className = "" }: FlowWordProps) {
  const reduceMotion = useReducedMotion();

  return (
    <span
      className={`relative inline-block text-(--accent-strong) ${className}`}
    >
      flow
      <svg
        aria-hidden="true"
        viewBox="0 0 112 14"
        preserveAspectRatio="none"
        className="absolute -bottom-[0.06em] left-0 h-[0.16em] w-full"
      >
        <motion.path
          d={WAVE_A}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={
            reduceMotion
              ? { opacity: 0.7 }
              : { opacity: 0.7, d: [WAVE_A, WAVE_B, WAVE_A] }
          }
          transition={{
            opacity: { duration: 0.6, delay: 0.7 },
            d: {
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8,
            },
          }}
        />
      </svg>
    </span>
  );
}
