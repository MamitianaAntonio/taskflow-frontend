import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";
import PageMeta from "../components/marketing/PageMeta";
import { EASE } from "../components/marketing/motion";
import LoginForm from "../layouts/LoginForm";
import SignForm from "../layouts/SignForm";
import { warmUpBackend } from "../services/health";
import { contactEmail } from "../constants/homeContent";
import { ROUTES } from "../constants/routes";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const FormComponent = isLogin ? LoginForm : SignForm;

  // Start waking the backend while the user is still typing.
  useEffect(() => {
    warmUpBackend();
  }, []);

  return (
    <>
      <PageMeta
        title={isLogin ? "Sign in · TaskFlow" : "Sign up · TaskFlow"}
        description={
          isLogin
            ? "Sign in to TaskFlow to pick up your tasks, projects and calendar."
            : "Create a TaskFlow account and bring your tasks, projects and calendar together."
        }
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="relative h-dvh overflow-hidden bg-(--bg-primary)"
      >
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.12 }}
          className="absolute top-5 left-5 z-10 sm:top-6 sm:left-6"
        >
          <Button
            text="Back"
            variant="text"
            size="small"
            icon={<ArrowLeft aria-hidden="true" className="h-4 w-4" />}
            onClick={() => navigate(ROUTES.home)}
            aria-label="Back to the TaskFlow home page"
          />
        </motion.div>

        <main className="flex h-full items-center justify-center overflow-y-auto px-5 py-16 sm:px-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: EASE }}
              className="w-full max-w-md"
            >
              <h1 className="text-[1.9rem] leading-tight font-semibold tracking-[-0.04em] text-(--text-primary) sm:text-[2.15rem]">
                <span
                  aria-hidden="true"
                  className="mr-2 text-(--accent-color) select-none"
                >
                  -
                </span>
                {isLogin
                  ? "Sign in to TaskFlow"
                  : "Create your TaskFlow account"}
              </h1>

              <p className="mt-2 font-interface text-sm leading-relaxed text-(--text-secondary)">
                {isLogin
                  ? "Your tasks, projects and calendar are where you left them."
                  : "Tasks, projects, deadlines and notifications all live together."}
              </p>

              <div className="mt-7">
                <FormComponent
                  onSwitch={() => setIsLogin((prev) => !prev)}
                />
              </div>

              <p className="mt-6 font-interface text-xs text-(--text-muted) sm:text-sm">
                Need a hand?{" "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="rounded font-medium text-(--text-secondary) underline decoration-(--accent-muted) underline-offset-4 transition-colors hover:text-(--accent-strong) focus-visible:ring-2 focus-visible:ring-(--accent-color) focus-visible:outline-none"
                >
                  Write to us
                </a>
                .
              </p>
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>
    </>
  );
}

export default Auth;
