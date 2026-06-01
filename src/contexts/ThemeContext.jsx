import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LOCAL_STORAGE_KEYS } from '../constants/constants.js';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.DARK_MODE);
      if (stored !== null) {
        return stored === 'true';
      }
      // Check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      const root = window.document.documentElement;
      if (darkMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem(LOCAL_STORAGE_KEYS.DARK_MODE, String(darkMode));
    } catch {
      // LocalStorage access may fail in sandboxed iframe or disabled cookies
    }
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  const value = {
    darkMode,
    setDarkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
