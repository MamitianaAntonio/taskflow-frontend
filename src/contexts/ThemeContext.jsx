import { createContext, useContext } from "react";
import { useDarkMode } from "../hooks/useDarkMode.js";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { isDarkMode, setIsDarkMode } = useDarkMode();

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the ThemeContext
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
