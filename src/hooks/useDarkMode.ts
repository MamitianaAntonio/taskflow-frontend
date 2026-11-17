import { useEffect, useRef, useState } from "react";

const THEME_TRANSITION_MS = 400;

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true",
  );
  const isFirstRun = useRef(true);
  const timeout = useRef<number | undefined>(undefined);

  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode ? "true" : "false");

    const root = document.documentElement;

    if (isFirstRun.current) {
      isFirstRun.current = false;
    } else {
      window.clearTimeout(timeout.current);

      if (!root.classList.contains("theme-transition")) {
        root.classList.add("theme-transition");
      }

      timeout.current = window.setTimeout(() => {
        root.classList.remove("theme-transition");
      }, THEME_TRANSITION_MS);
    }

    root.setAttribute("data-theme", isDarkMode ? "dark" : "light");

    return () => window.clearTimeout(timeout.current);
  }, [isDarkMode]);

  return { isDarkMode, setIsDarkMode };
}
