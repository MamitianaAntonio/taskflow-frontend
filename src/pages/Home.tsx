import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { DarkModeToggle } from "../components/ui/DarkModeToggle";
import { useTheme } from "../contexts/ThemeContext";
import { ROUTES } from "../constants/routes";

function Home() {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(ROUTES.login);
    }, 500);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden">
      <img
        src="Logo.png"
        alt="Logo"
        className="absolute top-4 left-4 w-12"
      />

      <div className="absolute top-4 right-4">
        <DarkModeToggle isDarkMode={isDarkMode} onChange={setIsDarkMode} />
      </div>

      <div className="grow flex flex-col items-center justify-center space-y-6 px-4 text-center">
        <img
          className="max-h-xs w-[20vh]"
          src="/home-photo.png"
          alt="TaskFlow home"
        />
        <h1 className="font-sans text-4xl font-bold">
          <span className="bg-linear-to-r from-(--gradient-from) to-(--gradient-to) bg-clip-text text-transparent">
            Task
          </span>
          <span className="text-(--text-primary)">Flow</span>
        </h1>
        <h3 className="font-sans text-[1.7vh] text-(--text-secondary) max-sm:text-base">
          "Organize your task, keep your flow"
        </h3>
        <Button
          text="Get Started"
          variant="primary"
          onClick={handleClick}
          loading={loading}
        />
      </div>

      <h3 className="mb-4 font-sans font-light text-(--text-primary)">
        © Copyright 2026 Taskflow
      </h3>
    </div>
  );
}

export default Home;