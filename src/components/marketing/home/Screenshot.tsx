import { motion } from "framer-motion";
import { EASE } from "../motion";

interface ScreenshotProps {
  light: string;
  dark: string;
  alt: string;
  isDark: boolean;
  reduceMotion: boolean | null;
  className?: string;
}

/**
 * App screenshot with a crossfade between the light and dark variants,
 * and the same reveal as the rest of the marketing page.
 */
export default function Screenshot({
  light,
  dark,
  alt,
  isDark,
  reduceMotion,
  className = "",
}: ScreenshotProps) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.85, ease: EASE }}
      className={`overflow-hidden rounded-xl border border-(--border-color) bg-(--bg-secondary) shadow-sm ${className}`}
    >
      <div
        role="img"
        aria-label={alt}
        className="relative aspect-[16/10] overflow-hidden md:aspect-[1920/560]"
      >
        <motion.img
          src={light}
          alt=""
          loading="lazy"
          draggable={false}
          initial={false}
          animate={{ opacity: isDark ? 0 : 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-cover object-top select-none"
        />
        <motion.img
          src={dark}
          alt=""
          loading="lazy"
          draggable={false}
          initial={false}
          animate={{ opacity: isDark ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-cover object-top select-none"
        />
      </div>
    </motion.div>
  );
}
