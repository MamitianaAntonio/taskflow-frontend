import { Link } from "react-router-dom";
import { DarkModeToggle } from "../components/ui/DarkModeToggle";
import HomeTabs from "../components/marketing/HomeTabs";
import { ROUTES } from "../constants/routes";
import { useTheme } from "../contexts/ThemeContext";

export default function SiteHeader() {
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-(--bg-primary)">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-5 sm:px-8 md:grid md:h-16 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4">
        <div className="flex h-12 items-center justify-between md:h-auto">
          <Link
            to={ROUTES.home}
            aria-label="TaskFlow home"
            className="group flex w-fit items-center gap-2.5 rounded-control outline-none focus-visible:ring-2 focus-visible:ring-(--accent-color)"
          >
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-control bg-(--bg-tertiary) ring-1 ring-(--border-color) transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
              <img
                src="/Logo.png"
                alt=""
                className="h-full w-full object-contain"
              />
            </span>
            <span className="text-sm font-semibold tracking-tight text-(--text-primary)">
              Task<span className="text-(--accent-color)">Flow</span>
            </span>
          </Link>

          <div className="flex items-center gap-1 md:hidden">
            <DarkModeToggle isDarkMode={isDarkMode} onChange={setIsDarkMode} />
            <Link
              to={ROUTES.login}
              className="rounded-control px-2.5 py-2 text-sm font-medium text-(--text-secondary) transition-colors hover:text-(--text-primary) focus-visible:ring-2 focus-visible:ring-(--accent-color) focus-visible:outline-none"
            >
              Log in
            </Link>
          </div>
        </div>

        <HomeTabs />

        <div className="hidden items-center justify-end gap-2 md:flex">
          <DarkModeToggle isDarkMode={isDarkMode} onChange={setIsDarkMode} />
          <Link
            to={ROUTES.login}
            className="rounded-control px-3 py-2 text-sm font-medium text-(--text-secondary) transition-colors hover:text-(--text-primary) focus-visible:ring-2 focus-visible:ring-(--accent-color) focus-visible:outline-none"
          >
            Log in
          </Link>
        </div>
      </div>
    </header>
  );
}
