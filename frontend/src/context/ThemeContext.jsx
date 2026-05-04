import { createContext, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "obsidian_theme";
const ThemeContext = createContext(null);

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

function getInitialTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? true;
  return prefersDark ? "dark" : "light";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const initial = getInitialTheme();
    applyTheme(initial);
    return initial;
  });

  function setThemeMode(nextTheme) {
    const value = nextTheme === "light" ? "light" : "dark";
    setTheme(value);
    localStorage.setItem(STORAGE_KEY, value);
    applyTheme(value);
  }

  function toggleTheme() {
    setThemeMode(theme === "dark" ? "light" : "dark");
  }

  const value = useMemo(
    () => ({
      theme,
      setTheme: setThemeMode,
      toggleTheme,
      isDark: theme === "dark",
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

