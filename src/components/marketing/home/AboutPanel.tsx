import { motion, useReducedMotion } from "framer-motion";
import { PrimaryLink, SecondaryLink } from "./ActionLink";
import Eyebrow from "./Eyebrow";
import Screenshot from "./Screenshot";
import { fadeUp, revealLine } from "../motion";
import { useTheme } from "../../../contexts/ThemeContext";
import { ROUTES } from "../../../constants/routes";

export default function AboutPanel() {
  const reduceMotion = useReducedMotion();
  const { isDarkMode } = useTheme();

  return (
    <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
      <div className="pt-14 md:pt-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:gap-16">
          <div>
            <Eyebrow>About</Eyebrow>

            <h2 className="mt-6 max-w-[13ch] text-[2.4rem] leading-[0.98] font-semibold tracking-[-0.04em] text-(--text-primary) sm:text-[3.3rem] lg:text-[4rem]">
              <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
                <motion.span
                  className="block"
                  {...revealLine(reduceMotion, 0.08)}
                >
                  One app for
                </motion.span>
              </span>
              <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
                <motion.span
                  className="block"
                  {...revealLine(reduceMotion, 0.16)}
                >
                  the whole day.
                </motion.span>
              </span>
            </h2>
          </div>

          <motion.div {...fadeUp(reduceMotion, 0.28)} className="lg:pb-2">
            <p className="max-w-sm font-interface text-base leading-relaxed text-(--text-secondary)">
              TaskFlow is a task and project manager. Your tasks, projects,
              deadlines and notifications live together, so one screen is
              enough to see what is going on.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <PrimaryLink to={ROUTES.login}>Get started</PrimaryLink>
              <SecondaryLink to="/?tab=contact">Write to us</SecondaryLink>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div {...fadeUp(reduceMotion, 0.4)} className="mt-10 md:mt-12">
        <Screenshot
          light="/demo/dashboard.png"
          dark="/demo/dashboard-dark.png"
          alt="TaskFlow dashboard showing the task breakdown, quick add and project overview"
          isDark={isDarkMode}
          reduceMotion={reduceMotion}
        />
      </motion.div>

      <div className="mt-16 grid gap-8 border-t border-(--border-color) pt-10 md:mt-24 md:pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-start lg:gap-16">
        <div>
          <h3 className="max-w-[18ch] text-[1.6rem] leading-tight font-semibold tracking-[-0.03em] text-(--text-primary) sm:text-[1.9rem]">
            Everything sits where you expect it.
          </h3>

          <p className="mt-4 max-w-md font-interface text-base leading-relaxed text-(--text-secondary)">
            Tasks carry subtasks and a status you can change in one click.
            Projects get a kanban board. The calendar shows the month, day by
            day. Search finds what you wrote down months ago, and notifications
            tell you when something is due.
          </p>

          <p className="mt-4 max-w-md font-interface text-base leading-relaxed text-(--text-secondary)">
            Create a task, drop it in a project, give it a date. It shows up on
            the board, in the calendar and in your notifications.
          </p>
        </div>

        <Screenshot
          light="/demo/taskboard.png"
          dark="/demo/taskboard-dark.png"
          alt="Task list with status filters, a quick add field and the tasks of the day"
          isDark={isDarkMode}
          reduceMotion={reduceMotion}
        />
      </div>

      <div className="pb-16 md:pb-24" />
    </div>
  );
}
