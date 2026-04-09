import React, { createContext, useContext, useState, useEffect } from 'react';
 
const ThemeContext = createContext();
 
export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(localStorage.getItem('theme') || 'dark');
  const [actualTheme, setActualTheme] = useState('dark');
  // New: Global Font Size state
  const [fontSize, setFontSize] = useState(parseInt(localStorage.getItem('fontSize')) || 16);
 
  useEffect(() => {
    setActualTheme(themeMode);
    localStorage.setItem('theme', themeMode);
  }, [themeMode]);
 
  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);
 
  const colors = {
    dark: {
      appBg: '#020617',
      mainGradient: 'linear-gradient(135deg, #2e003e 0%, #35174fff 50%, #38041eff 100%)',
      textPrimary: '#ffffff',
      textSecondary: '#b39ddb',
      cardBg: 'rgba(255, 255, 255, 0.05)',
      border: 'rgba(255,255,255,0.1)'
    },
    light: {
      appBg: '#f8f9fa',
      mainGradient: 'linear-gradient(135deg, #f3e5f5 0%, #ede7f6 50%, #e8eaf6 100%)',
      textPrimary: '#212529',
      textSecondary: '#6c757d',
      cardBg: '#ffffff',
      border: 'rgba(0,0,0,0.1)'
    },
    frost: {
      appBg: '#ffffff',
      mainGradient: 'linear-gradient(45deg, rgba(238,119,82,0.2) 0%, rgba(231,60,126,0.2) 25%, rgba(35,166,213,0.2) 75%, rgba(35,213,171,0.2) 100%)',
      textPrimary: '#1a1a1a',
      textSecondary: '#4a4a4a',
      cardBg: 'rgba(255, 255, 255, 0.4)',
      border: 'rgba(255, 255, 255, 0.7)'
    }
  };
 
  const currentColors = colors[actualTheme] || colors.dark;
 
  return (
    <ThemeContext.Provider value={{
      themeMode,
      setThemeMode,
      currentColors,
      actualTheme,
      fontSize,
      setFontSize
    }}>
      <div style={{ fontSize: `${fontSize}px` }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
 
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) return { currentColors: {}, themeMode: 'dark', fontSize: 16 };
  return context;
};
 