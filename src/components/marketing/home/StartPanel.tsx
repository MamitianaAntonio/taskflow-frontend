import { motion, useReducedMotion } from "framer-motion";
import { PrimaryLink, SecondaryLink } from "./ActionLink";
import Eyebrow from "./Eyebrow";
import FlowWord from "../FlowWord";
import { EASE, fadeUp, revealLine } from "../motion";
import { homeSpecs } from "../../../constants/homeContent";
import { ROUTES } from "../../../constants/routes";

export default function StartPanel() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-10rem)] w-full max-w-7xl flex-col px-5 pt-14 pb-8 sm:px-8 md:min-h-[calc(100dvh-8.5rem)] md:pt-20">
      <div className="flex flex-1 items-center">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-10">
          <div>
            <Eyebrow>Task and project manager</Eyebrow>

            <h1 className="mt-6 text-[clamp(1.95rem,9.9vw,2.6rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-(--text-primary) sm:text-[3.4rem] lg:text-[4.25rem]">
              <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
                <motion.span
                  className="block"
                  {...revealLine(reduceMotion, 0.08)}
                >
                  Organize your tasks,
                </motion.span>
              </span>
              <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
                <motion.span
                  className="block"
                  {...revealLine(reduceMotion, 0.16)}
                >
                  keep your <FlowWord />.
                </motion.span>
              </span>
            </h1>

            <motion.div {...fadeUp(reduceMotion, 0.34)}>
              <p className="mt-6 max-w-md font-interface text-base leading-relaxed text-(--text-secondary)">
                Everything you&apos;re working on, in one place: tasks,
                projects, calendar and notifications.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <PrimaryLink to={ROUTES.login}>Get started</PrimaryLink>
                <SecondaryLink to="/?tab=about">
                  What&apos;s inside
                </SecondaryLink>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
            className="mx-auto w-full max-w-[17rem] sm:max-w-[19rem] lg:mx-0 lg:max-w-none lg:justify-self-end"
          >
            <motion.img
              src="/home-photo.png"
              alt="Illustration of a person organizing their tasks"
              draggable={false}
              animate={reduceMotion ? undefined : { y: [0, -9, 0] }}
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 8, repeat: Infinity, ease: "easeInOut" }
              }
              className="w-full select-none"
            />
          </motion.div>
        </div>
      </div>

      <motion.ul
        {...fadeUp(reduceMotion, 0.5)}
        className="mt-10 flex flex-wrap items-center gap-y-2 border-t border-(--border-color) pt-5 font-mono text-[10.5px] tracking-[0.2em] text-(--text-muted) uppercase"
      >
        {homeSpecs.map((spec, index) => (
          <li key={spec} className="flex items-center gap-x-3 sm:gap-x-4">
            {index > 0 && (
              <span aria-hidden="true" className="text-(--text-muted) opacity-50">
                ·
              </span>
            )}
            <span>{spec}</span>
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
