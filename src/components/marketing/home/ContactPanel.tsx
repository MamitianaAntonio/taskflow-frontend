import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Eyebrow from "./Eyebrow";
import { EASE, fadeUp, revealLine } from "../motion";
import { contactDetails, contactEmail } from "../../../constants/homeContent";

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.34 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function ContactPanel() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-10rem)] w-full max-w-7xl flex-col justify-center px-5 py-14 sm:px-8 md:min-h-[calc(100dvh-8.5rem)] md:py-20">
      <Eyebrow>Contact</Eyebrow>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:gap-16">
        <h2 className="text-[2.15rem] leading-[0.98] font-semibold tracking-[-0.04em] text-(--text-primary) sm:text-[2.75rem] lg:text-[3.25rem]">
          <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
            <motion.span className="block" {...revealLine(reduceMotion, 0.08)}>
              Write to us.
            </motion.span>
          </span>
        </h2>

        <motion.p
          {...fadeUp(reduceMotion, 0.24)}
          className="max-w-sm font-interface text-base leading-relaxed text-(--text-secondary) lg:pb-2"
        >
          A bug, an idea or a simple question? Write to us. We read every
          message that arrives.
        </motion.p>
      </div>

      <motion.div
        {...fadeUp(reduceMotion, 0.32)}
        className="mt-12 border-t border-(--border-color) pt-6"
      >
        <p className="font-interface text-[11px] font-medium tracking-[0.14em] text-(--text-muted) uppercase">
          Email
        </p>

        <a
          href={`mailto:${contactEmail}`}
          className="group mt-3 inline-flex items-baseline gap-3 rounded-lg focus-visible:ring-2 focus-visible:ring-(--accent-color) focus-visible:ring-offset-4 focus-visible:ring-offset-(--bg-primary) focus-visible:outline-none"
        >
          <span className="relative inline-block max-w-full break-all text-[clamp(1.05rem,3.6vw,2.25rem)] leading-tight font-semibold tracking-[-0.035em] text-(--text-primary) transition-colors duration-200 group-hover:text-(--accent-strong)">
            {contactEmail}
            <span
              aria-hidden="true"
              className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-(--accent-color) transition-transform duration-300 ease-out group-hover:scale-x-100"
            />
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className="h-5 w-5 shrink-0 text-(--text-muted) transition-all duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-(--accent-strong)"
          />
        </a>
      </motion.div>

      <motion.ul
        variants={listVariants}
        initial={reduceMotion ? false : "hidden"}
        animate="show"
        className="mt-12 grid gap-x-8 gap-y-6 border-t border-(--border-color) pt-6 sm:grid-cols-2"
      >
        {contactDetails.map((detail) => (
          <motion.li key={detail.label} variants={itemVariants}>
            <p className="font-interface text-[11px] font-medium tracking-[0.14em] text-(--text-muted) uppercase">
              {detail.label}
            </p>

            {"href" in detail ? (
              <a
                href={detail.href}
                className="mt-1.5 inline-block rounded font-interface text-sm font-medium text-(--text-secondary) transition-colors hover:text-(--accent-strong) focus-visible:ring-2 focus-visible:ring-(--accent-color) focus-visible:outline-none"
              >
                {detail.value}
              </a>
            ) : (
              <p className="mt-1.5 font-interface text-sm font-medium text-(--text-secondary)">
                {detail.value}
              </p>
            )}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
