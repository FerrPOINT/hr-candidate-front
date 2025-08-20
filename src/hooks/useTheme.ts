import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'auto';

// Безопасная функция для получения темы из localStorage
const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  
  try {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'light';
  } catch (error) {
    console.warn('Failed to get theme from localStorage:', error);
    return 'light';
  }
};

// Безопасная функция для сохранения темы в localStorage
const setStoredTheme = (theme: Theme): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('theme', theme);
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
};

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);
  const [isDark, setIsDark] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Инициализация после монтирования
  useEffect(() => {
    if (!isInitialized) {
      const initialTheme = getStoredTheme();
      setTheme(initialTheme);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;

    const updateTheme = () => {
      let shouldBeDark = false;
      
      if (theme === 'dark') {
        shouldBeDark = true;
      } else if (theme === 'auto') {
        shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      
      setIsDark(shouldBeDark);
      
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    updateTheme();
    setStoredTheme(theme);

    // Слушаем изменения системной темы
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        if (theme === 'auto') {
          updateTheme();
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, isInitialized]);

  const toggleTheme = () => {
    setTheme(prev => {
      switch (prev) {
        case 'light': return 'dark';
        case 'dark': return 'auto';
        case 'auto': return 'light';
        default: return 'light';
      }
    });
  };

  const setThemeMode = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return {
    theme,
    isDark,
    toggleTheme,
    setThemeMode
  };
}; 