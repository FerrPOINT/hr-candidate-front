import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Универсальный тип для значения настройки виджета
export type WidgetSettingsValue = string | number | boolean | object | null;

// Типы настроек для разных виджетов
export interface WidgetSettings {
  [widgetType: string]: {
    [settingKey: string]: WidgetSettingsValue;
  };
}

export interface WidgetSettingsState {
  settings: WidgetSettings;
  
  // Actions
  setWidgetSettings: (widgetType: string, settings: Record<string, WidgetSettingsValue>) => void;
  getWidgetSettings: (widgetType: string) => Record<string, WidgetSettingsValue>;
  updateWidgetSetting: (widgetType: string, key: string, value: WidgetSettingsValue) => void;
  resetWidgetSettings: (widgetType: string) => void;
  saveToStorage: () => void;
  loadFromStorage: () => void;
}

// Безопасный доступ к localStorage
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
};

const saveSettingsToStorage = (settings: WidgetSettings) => {
  safeLocalStorage.setItem('widget-settings', JSON.stringify(settings));
};

const loadSettingsFromStorage = (): WidgetSettings | null => {
  const stored = safeLocalStorage.getItem('widget-settings');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing widget settings from localStorage:', error);
      return null;
    }
  }
  return null;
};

export const useWidgetSettingsStore = create<WidgetSettingsState>()(
  devtools(
    (set, get) => ({
      settings: {},
      
      setWidgetSettings: (widgetType, settings) => {
        set((state) => {
          const newSettings = {
            ...state.settings,
            [widgetType]: settings,
          };
          // Сохраняем синхронно
          saveSettingsToStorage(newSettings);
          return { settings: newSettings };
        });
      },
      
      getWidgetSettings: (widgetType) => {
        const state = get();
        return state.settings[widgetType] || {};
      },
      
      updateWidgetSetting: (widgetType, key, value) => {
        set((state) => {
          const currentSettings = state.settings[widgetType] || {};
          const newSettings = {
            ...state.settings,
            [widgetType]: {
              ...currentSettings,
              [key]: value,
            },
          };
          // Сохраняем синхронно
          saveSettingsToStorage(newSettings);
          return { settings: newSettings };
        });
      },
      
      resetWidgetSettings: (widgetType) => {
        set((state) => {
          const newSettings = { ...state.settings };
          delete newSettings[widgetType];
          // Сохраняем синхронно
          saveSettingsToStorage(newSettings);
          return { settings: newSettings };
        });
      },
      
      saveToStorage: () => {
        const state = get();
        saveSettingsToStorage(state.settings);
      },
      
      loadFromStorage: () => {
        const loaded = loadSettingsFromStorage();
        if (loaded) {
          set({ settings: loaded });
        }
      },
    }),
    {
      name: 'widget-settings-store',
    }
  )
);

// При инициализации store — загрузить из localStorage
useWidgetSettingsStore.getState().loadFromStorage(); 