import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const THEME_KEY = 'hr-crm-theme';

// Безопасная функция для получения темы из localStorage
const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    
    // По умолчанию — системная тема
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  } catch (error) {
    console.warn('Failed to get theme from localStorage:', error);
    return 'light';
  }
};

// Безопасная функция для сохранения темы в localStorage
const setStoredTheme = (theme: Theme): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);
  const [isInitialized, setIsInitialized] = useState(false);

  // Инициализация темы после монтирования
  useEffect(() => {
    if (!isInitialized) {
      const initialTheme = getStoredTheme();
      setThemeState(initialTheme);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Применение темы к DOM
  useEffect(() => {
    if (!isInitialized) return;
    
    setStoredTheme(theme);
    
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme, isInitialized]);

  // Слушаем изменения системной темы
  useEffect(() => {
    if (typeof window === 'undefined' || !isInitialized) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Обновляем тему только если пользователь не выбрал конкретную тему
      const stored = localStorage.getItem(THEME_KEY);
      if (!stored || (stored !== 'dark' && stored !== 'light')) {
        const newTheme: Theme = mediaQuery.matches ? 'dark' : 'light';
        setThemeState(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isInitialized]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () => setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
} 