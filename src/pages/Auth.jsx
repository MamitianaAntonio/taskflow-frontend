import { useState } from "react";
import LoginForm from "../layouts/LoginForm";
import SignForm from "../layouts/SignForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import { DarkModeToggle } from "../components/ui/DarkModeToggle";
import { useTheme } from "../contexts/ThemeContext";
import "./style/Auth.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const {isDarkMode, setIsDarkMode } = useTheme();
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
    <div className="flex flex-col md:flex-row min-h-screen justify-center overflow-hidden">
      {/** dark mode toggle */}
      <div className="absolute top-4 right-4">
        <DarkModeToggle isDarkMode={isDarkMode} onChange={setIsDarkMode} />
      </div>
      {/* Left Side */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-(--bg-tertiary) p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-(--accent-muted) via-transparent to-(--color-info)/5 pointer-events-none" />
        <div
          key={isLogin}
          className="relative z-10 max-w-md text-center animate-fadeSlideUp"
        >
          <div className="flex justify-center mb-6 text-(--accent-color) text-5xl animate-floatSlow">
            <FontAwesomeIcon icon={isLogin ? faRightToBracket : faListCheck} />
          </div>

          <h1 className="text-4xl font-bold mb-4 tracking-tight text-(--text-primary)">
            {isLogin ? "Welcome back to TaskFlow" : "Organize. Track. Achieve."}
          </h1>

          <div
            className="w-16 h-1 mx-auto mb-6 rounded-full 
            bg-linear-to-r from-(--gradient-from) to-(--gradient-to)"
          ></div>

          <p className="text-(--text-secondary) text-lg leading-relaxed">
            {isLogin
              ? "Continue managing your tasks and tracking project progress with clarity."
              : "Plan smarter, monitor every milestone, and turn ideas into completed projects."}
          </p>

          <p className="mt-8 text-sm text-(--text-secondary) opacity-70">
            TaskFlow transforms chaos into structured progress.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-col w-full md:w-1/2 items-center justify-center p-6">
        <img
          className="w-[15vh] max-h-xs"
          src="home-photo.png"
          alt="Home photo"
        />
        <h3 className="text-xl text-(--text-secondary) font-bold mb-4">
          {isLogin ? "Login to your account" : "Create a new account"}
        </h3>
        {/**3D flipping animation */}
        <div className="w-full max-w-md flip-perspective">
          <div className={`flip-card ${isFlipping ? "flipping" : ""}`}>
            <FormComponent onSwitch={toggleForm} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <h3 className="absolute bottom-0 w-full text-center font-sans text-(--text-primary) font-light mb-4 sm:text-sm text-xs">
        © Copyright 2026 TaskFlow
      </h3>
    </div>
  );
}

export default Auth;
