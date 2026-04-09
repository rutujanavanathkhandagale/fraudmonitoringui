import React, { createContext, useContext, useState, useEffect } from 'react';

// Define your Brand Colors here
const themes = {
  dark: {
    appBg: "#0f051a",          // Deep Purple background
    cardBg: "#1a0b2e",         // Slightly lighter purple for cards
    textPrimary: "#ffffff",
    textSecondary: "rgba(255, 255, 255, 0.7)",
    border: "rgba(255, 255, 255, 0.1)",
    accent: "#7c3aed"          // Purple/Violet accent
  },
  light: {
    appBg: "#f8f9fa",
    cardBg: "#ffffff",
    textPrimary: "#212529",
    textSecondary: "#6c757d",
    border: "#dee2e6",
    accent: "#7c3aed"
  }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Toggle function if you want a button later
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const currentColors = isDarkMode ? themes.dark : themes.light;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, currentColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};