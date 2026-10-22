import { createContext, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Force dark theme permanently
  const theme = "dark";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark");
    // Persist dark theme (optional)
    localStorage.setItem("theme", theme);
  }, []);

  // No toggle function needed; kept for compatibility
  const toggleTheme = () => {};

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
