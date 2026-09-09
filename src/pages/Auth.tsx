import { useState } from "react";
import LoginForm from "../layouts/LoginForm";
import SignForm from "../layouts/SignForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket, faListCheck } from "@fortawesome/free-solid-svg-icons";
import { DarkModeToggle } from "../components/ui/DarkModeToggle";
import { useTheme } from "../contexts/ThemeContext";
import "./style/Auth.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { isDarkMode, setIsDarkMode } = useTheme();
  const [isFlipping, setIsFlipping] = useState(false);
  const FormComponent = isLogin ? LoginForm : SignForm;

  const toggleForm = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setIsLogin((prev) => !prev);
      setIsFlipping(false);
    }, 300);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center overflow-hidden md:flex-row">
      <div className="absolute top-4 right-4">
        <DarkModeToggle isDarkMode={isDarkMode} onChange={setIsDarkMode} />
      </div>

      <div className="relative hidden items-center justify-center overflow-hidden bg-(--bg-tertiary) p-10 md:flex md:w-1/2">
        <div
          key={String(isLogin)}
          className="relative z-10 max-w-md animate-fadeSlideUp text-center"
        >
          <div className="mb-6 flex justify-center text-5xl text-(--accent-color) animate-floatSlow">
            <FontAwesomeIcon icon={isLogin ? faRightToBracket : faListCheck} />
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-(--text-primary)">
            {isLogin ? "Welcome back to TaskFlow" : "Organize. Track. Achieve."}
          </h1>

          <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-(--accent-color)" />

          <p className="text-lg leading-relaxed text-(--text-secondary)">
            {isLogin
              ? "Continue managing your tasks and tracking project progress with clarity."
              : "Plan smarter, monitor every milestone, and turn ideas into completed projects."}
          </p>

          <p className="mt-8 text-sm text-(--text-secondary) opacity-70">
            TaskFlow transforms chaos into structured progress.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center p-6 md:w-1/2">
        <img
          className="max-h-xs w-[15vh]"
          src="/home-photo.png"
          alt="TaskFlow"
        />
        <h3 className="mb-4 text-xl font-bold text-(--text-secondary)">
          {isLogin ? "Login to your account" : "Create a new account"}
        </h3>
        <div className="flip-perspective w-full max-w-md">
          <div className={`flip-card ${isFlipping ? "flipping" : ""}`}>
            <FormComponent onSwitch={toggleForm} />
          </div>
        </div>
      </div>

      <h3 className="font-sans absolute bottom-0 mb-4 w-full text-center text-xs font-light text-(--text-primary) sm:text-sm">
        © Copyright 2026 TaskFlow
      </h3>
    </div>
  );
}

export default Auth;