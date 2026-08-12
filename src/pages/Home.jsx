import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { DarkModeToggle } from "../components/ui/DarkModeToggle";
import { useTheme } from "../contexts/ThemeContext";
import { useState } from "react";

function Home() {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    setLoading(true);
    // simulate short delay before navigation
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 500);
  };

  return (
    <>
      <div className="relative flex flex-col items-center justify-between overflow-hidden w-full h-full min-h-screen">
        <img
          src="Logo.png"
          alt="Logo image"
          className="w-12 top-4 left-4 absolute"
        />

        {/** dark mode toggle */}
        <div className="absolute top-4 right-4">
          <DarkModeToggle isDarkMode={isDarkMode} onChange={setIsDarkMode} />
        </div>

        {/** centered section */}
        <div className="flex flex-col items-center justify-center grow space-y-6 text-center px-4">
          <img
            className="w-[20vh] max-h-xs"
            src="/home-photo.png"
            alt="Home photo"
          />
          <h1 className="font-sans text-4xl font-bold">
            <span className="bg-linear-to-r from-(--gradient-from) to-(--gradient-to) bg-clip-text text-transparent">
              Task
            </span>
            <span className="text-(--text-primary)">Flow</span>
          </h1>
          <h3 className="font-sans text-(--text-secondary) text-[1.7vh] max-sm:text-base">
            "Organize your task, keep your flow"
          </h3>
          <Button
            text="Get Started"
            variant="primary"
            onClick={handleClick}
            loading={loading}
          />
        </div>

        <h3 className="font-sans text-(--text-primary) font-light mb-4">
          © Copyright 2026 Taskflow
        </h3>
      </div>
    </>
  );
}

export default Home;
