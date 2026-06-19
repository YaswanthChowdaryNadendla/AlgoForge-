import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('algoforge-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    // Default to system theme
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
  });

  // Apply theme to document element
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Add theme-changing flag for CSS transition coordination
    root.classList.add('theme-changing');
    
    if (theme === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    
    localStorage.setItem('algoforge-theme', theme);
    
    const timeout = setTimeout(() => {
      root.classList.remove('theme-changing');
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [theme]);

  // Clean up legacy sound system settings from localStorage
  useEffect(() => {
    localStorage.removeItem('algoforge-sound-enabled');
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
