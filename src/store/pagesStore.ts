import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { StateCreator } from 'zustand';
import { useWidgetSettingsStore, WidgetSettingsValue } from './widgetSettingsStore';

/**
 * pagesStore (Zustand)
 * Хранит состояние страниц, компонентов, поддерживает авто-сохранение, undo/redo, работу с localStorage.
 *
 * Sequence diagram (Mermaid) — авто-сохранение и undo/redo:
 *
 * ```mermaid
 * sequenceDiagram
 *   participant UI as User/Editor
 *   participant Store as usePagesStore
 *   participant Storage as localStorage
 *   participant Timer as AutoSaveTimer
 *
 *   UI->>Store: setPages / setActivePage / addComponent / ...
 *   Store-->>Timer: startGlobalAutoSave()
 *   Timer->>Store: saveToStorage()
 *   Store->>Storage: saveStateToStorage(pages, activePageId)
 *
 *   UI->>Store: undo()
 *   Store-->>Store: pop from undoStack, push to redoStack
 *   Store-->>UI: set({ pages, ... })
 *
 *   UI->>Store: redo()
 *   Store-->>Store: pop from redoStack, push to undoStack
 *   Store-->>UI: set({ pages, ... })
 * ```
 *
 * Бизнес-логика:
 * - Любое изменение (addPage, updatePage, addComponent, ...) помечает состояние как dirty и запускает авто-сохранение
 * - Авто-сохранение сохраняет состояние в localStorage с debounce и интервалом
 * - Undo/redo реализовано через undoStack/redoStack, хранит до 50 состояний
 * - При инициализации store — загрузка из localStorage, если нет страниц — создаётся дефолтная
 */
// debounce-утилита
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}

const STORAGE_KEY = 'hr-crm-editor-pages-v1';
const AUTO_SAVE_INTERVAL = 5000; // 5 секунд

// Глобальный таймер для автосохранения (вне store для избежания утечек)
let globalAutoSaveTimer: ReturnType<typeof setInterval> | null = null;

// Функция для запуска auto-save
const startGlobalAutoSave = (saveFunction: () => void) => {
  if (globalAutoSaveTimer) {
    clearInterval(globalAutoSaveTimer);
  }
  
  globalAutoSaveTimer = setInterval(() => {
    console.log('🔄 Auto-saving...');
    saveFunction();
  }, AUTO_SAVE_INTERVAL);
};

// Функция для остановки auto-save
const stopGlobalAutoSave = () => {
  if (globalAutoSaveTimer) {
    clearInterval(globalAutoSaveTimer);
    globalAutoSaveTimer = null;
  }
};

export interface Component {
  id: string;
  type: string;
  name?: string; // Добавляем поле для имени виджета
  x: number;
  y: number;
  width?: number;
  height?: number;
  props: Record<string, WidgetSettingsValue>;
  children?: Component[];
}

export interface Page {
  id: string;
  name: string;
  components: Component[];
  background?: string;
  gridEnabled?: boolean;
  gridSize?: number;
}

export interface PagesState {
  pages: Page[];
  activePageId: string | null;
  selectedComponentId: string | null;
  isDirty: boolean;
  isSaved: boolean;
  isModalOpen: boolean;
  
  // Actions
  setPages: (pages: Page[]) => void;
  setActivePage: (pageId: string) => void;
  setSelectedComponent: (componentId: string | null) => void;
  setDirty: (dirty: boolean) => void;
  setSaved: (saved: boolean) => void;
  setModalOpen: (isOpen: boolean) => void;
  
  // Page management
  addPage: (name: string) => void;
  updatePage: (pageId: string, updates: Partial<Page>) => void;
  deletePage: (pageId: string) => void;
  renamePage: (pageId: string, newName: string) => void;
  
  // Component management
  addComponent: (pageId: string, component: Omit<Component, 'id'>) => void;
  updateComponent: (pageId: string, componentId: string, updates: Partial<Component>) => void;
  deleteComponent: (pageId: string, componentId: string) => void;
  moveComponent: (pageId: string, componentId: string, x: number, y: number) => void;
  duplicateComponent: (pageId: string, componentId: string) => void;
  
  // Utility
  getActivePage: () => Page | null;
  getSelectedComponent: () => Component | null;
  getComponentById: (pageId: string, componentId: string) => Component | null;
  saveToStorage: () => void;
  loadFromStorage: () => void;
  
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const saveStateToStorage = debounce((pages: Page[], activePageId: string | null) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ pages, activePageId })
  );
}, 1000);

const loadStateFromStorage = (): { pages: Page[]; activePageId: string | null } | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

// --- Undo/Redo middleware ---
function withHistory<T extends PagesState>(config: StateCreator<T, [], [], T>): StateCreator<T, [], [], T> {
  return (set, get, api) => {
    let undoStack: Array<{ pages: Page[]; activePageId: string | null; selectedComponentId: string | null }> = [];
    let redoStack: Array<{ pages: Page[]; activePageId: string | null; selectedComponentId: string | null }> = [];
    const maxHistory = 50;

    // Обёртка над set для отслеживания изменений
    const wrapSet: typeof set = (partial, replace) => {
      const prev = get();
      let nextState: Partial<T> = {};
      if (typeof partial === 'function') {
        nextState = partial(prev);
      } else {
        nextState = partial;
      }
      // Если изменились pages/activePageId/selectedComponentId — сохраняем историю
      if (
        nextState.pages !== undefined ||
        nextState.activePageId !== undefined ||
        nextState.selectedComponentId !== undefined
      ) {
        undoStack.push({
          pages: JSON.parse(JSON.stringify(prev.pages)),
          activePageId: prev.activePageId,
          selectedComponentId: prev.selectedComponentId,
        });
        if (undoStack.length > maxHistory) undoStack.shift();
        redoStack = [];
      }
      set(partial, false); // Всегда используем false для replace
    };

    const undo = () => {
      if (undoStack.length === 0) return;
      const state = get();
      redoStack.push({
        pages: JSON.parse(JSON.stringify(state.pages)),
        activePageId: state.activePageId,
        selectedComponentId: state.selectedComponentId,
      });
      const prev = undoStack.pop();
      set({
        pages: prev!.pages,
        activePageId: prev!.activePageId,
        selectedComponentId: prev!.selectedComponentId,
        isDirty: true,
        isSaved: false,
      } as Partial<T>);
    };

    const redo = () => {
      if (redoStack.length === 0) return;
      const state = get();
      undoStack.push({
        pages: JSON.parse(JSON.stringify(state.pages)),
        activePageId: state.activePageId,
        selectedComponentId: state.selectedComponentId,
      });
      const next = redoStack.pop();
      set({
        pages: next!.pages,
        activePageId: next!.activePageId,
        selectedComponentId: next!.selectedComponentId,
        isDirty: true,
        isSaved: false,
      } as Partial<T>);
    };

    const store = config(wrapSet, get, api);
    return {
      ...store,
      undo,
      redo,
      canUndo: () => undoStack.length > 0,
      canRedo: () => redoStack.length > 0,
    };
  };
}

export const usePagesStore = create<PagesState>()(
  devtools(
    withHistory((set, get) => {
      // Функция для запуска auto-save с проверкой состояния
      const startAutoSave = () => {
        const state = get();
        if (state.isDirty) {
          startGlobalAutoSave(() => {
            const currentState = get();
            if (currentState.isDirty) {
              currentState.saveToStorage();
            }
          });
        }
      };

      return {
        pages: [],
        activePageId: null,
        selectedComponentId: null,
        isDirty: false,
        isSaved: true,
        isModalOpen: false,
        
        setPages: (pages) => {
          set({ pages, isDirty: true, isSaved: false });
          startAutoSave();
        },
        setActivePage: (pageId) => {
          set({ activePageId: pageId, isDirty: true, isSaved: false });
          saveStateToStorage(get().pages, pageId);
          startAutoSave();
        },
        setSelectedComponent: (componentId) => set({ selectedComponentId: componentId }),
        setDirty: (dirty) => {
          set({ isDirty: dirty });
          if (dirty) {
            startAutoSave();
          } else {
            stopGlobalAutoSave();
          }
        },
        setSaved: (saved) => set({ isSaved: saved }),
        setModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
        
        addPage: (name) => {
          const newPage: Page = {
            id: `page_${Date.now()}`,
            name,
            components: [],
            gridEnabled: true,
            gridSize: 10,
            background: '#ffffff',
          };
          
          set((state) => {
            const newPages = [...state.pages, newPage];
            saveStateToStorage(newPages, newPage.id);
            return { 
              pages: newPages, 
              activePageId: newPage.id, 
              selectedComponentId: null,
              isDirty: true,
              isSaved: false,
            };
          });
          startAutoSave();
        },
        
        updatePage: (pageId, updates) => {
          set((state) => {
            const pages = state.pages.map((page) =>
              page.id === pageId ? { ...page, ...updates } : page
            );
            saveStateToStorage(pages, state.activePageId);
            return { pages, isDirty: true, isSaved: false };
          });
          startAutoSave();
        },
        
        deletePage: (pageId) => {
          set((state) => {
            const newPages = state.pages.filter((page) => page.id !== pageId);
            const newActivePageId = state.activePageId === pageId 
              ? (newPages.length > 0 ? newPages[0].id : null)
              : state.activePageId;
              
            saveStateToStorage(newPages, newActivePageId);
            return {
              pages: newPages,
              activePageId: newActivePageId,
              selectedComponentId: null,
              isDirty: true,
              isSaved: false,
            };
          });
          startAutoSave();
        },
        
        renamePage: (pageId, newName) => {
          get().updatePage(pageId, { name: newName });
        },
        
        addComponent: (pageId, componentData) => {
          console.log('➕ Adding component:', { pageId, componentData });
          
          // Загружаем глобальные настройки для этого типа виджета
          const widgetSettingsStore = useWidgetSettingsStore.getState();
          const globalSettings = widgetSettingsStore.getWidgetSettings(componentData.type);
          
          // Объединяем переданные данные с глобальными настройками
          const mergedProps = {
            ...globalSettings,
            ...componentData.props,
          };
          
          console.log('🔧 Merged props with global settings:', { 
            type: componentData.type, 
            globalSettings, 
            mergedProps 
          });
          
          // Генерируем уникальный ID с временной меткой и случайным хешем
          const uniqueId = `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          // Генерируем имя по умолчанию, если не указано
          // Сначала проверяем глобальные настройки, затем переданное имя, затем генерируем
          const defaultName = String(componentData.name || globalSettings.name || `${componentData.type} ${Date.now()}`);
          
          const component: Component = {
            id: uniqueId,
            name: defaultName,
            width: componentData.width || 300,
            height: componentData.height || 200,
            ...componentData,
            props: mergedProps,
          };
          
          console.log('🆔 Generated component with ID:', uniqueId);
          
          set((state) => {
            const page = state.pages.find(p => p.id === pageId);
            if (!page) {
              console.error('Page not found:', pageId);
              return state;
            }
            
            // Проверяем, что компонент с таким ID не существует (должно быть false, так как ID уникальный)
            const existingComponent = page.components.find(c => c.id === component.id);
            if (existingComponent) {
              console.warn('⚠️ Component with this ID already exists:', component.id);
              console.warn('⚠️ This should not happen with unique IDs. Skipping addition.');
              return state;
            }
            
            console.log('✅ Adding component with unique ID:', component.id);
            const pages = state.pages.map((page) =>
              page.id === pageId
                ? { ...page, components: [...page.components, component] }
                : page
            );
            saveStateToStorage(pages, state.activePageId);
            return {
              pages,
              selectedComponentId: component.id,
              isDirty: true,
              isSaved: false,
            };
          });
          startAutoSave();
        },
        
        updateComponent: (pageId, componentId, updates) => {
          set((state) => {
            const pages = state.pages.map((page) =>
              page.id === pageId
                ? {
                    ...page,
                    components: page.components.map((comp) =>
                      comp.id === componentId ? { ...comp, ...updates } : comp
                    ),
                  }
                : page
            );
            saveStateToStorage(pages, state.activePageId);
            return { pages, isDirty: true, isSaved: false };
          });
          startAutoSave();
        },
        
        deleteComponent: (pageId, componentId) => {
          set((state) => {
            const pages = state.pages.map((page) =>
              page.id === pageId
                ? {
                    ...page,
                    components: page.components.filter((comp) => comp.id !== componentId),
                  }
                : page
            );
            saveStateToStorage(pages, state.activePageId);
            return {
              pages,
              selectedComponentId: state.selectedComponentId === componentId ? null : state.selectedComponentId,
              isDirty: true,
              isSaved: false,
            };
          });
          startAutoSave();
        },
        
        moveComponent: (pageId, componentId, x, y) => {
          get().updateComponent(pageId, componentId, { x, y });
        },
        
        duplicateComponent: (pageId, componentId) => {
          console.log('🔄 Duplicating component:', { pageId, componentId });
          const state = get();
          const component = state.getComponentById(pageId, componentId);
          
          if (component) {
            console.log('📋 Original component:', component);
            
            // Сохраняем настройки виджета в глобальный store
            const widgetSettingsStore = useWidgetSettingsStore.getState();
            widgetSettingsStore.setWidgetSettings(component.type, component.props);
            console.log('💾 Saved widget settings for type:', component.type);
            
            // Создаем копию компонента БЕЗ id (так как addComponent сам его сгенерирует)
            const { id, ...componentWithoutId } = component;
            
            // Генерируем имя для дубликата
            const originalName = component.name || component.type;
            const duplicatedName = `${originalName} (копия)`;
            
            const duplicatedComponent: Omit<Component, 'id'> = {
              ...componentWithoutId,
              name: duplicatedName,
              x: component.x + 20,
              y: component.y + 20,
              // Убираем id из props если он есть, чтобы избежать конфликтов
              props: {
                ...component.props,
                id: null
              }
            };
            
            console.log('📋 Duplicated component (without ID):', duplicatedComponent);
            console.log('📋 Calling addComponent with pageId:', pageId);
            state.addComponent(pageId, duplicatedComponent);
            console.log('✅ Component duplicated successfully');
          } else {
            console.error('❌ Component not found:', componentId);
          }
        },
        
        getActivePage: () => {
          const state = get();
          return state.pages.find((page) => page.id === state.activePageId) || null;
        },
        
        getSelectedComponent: () => {
          const state = get();
          const activePage = state.getActivePage();
          if (!activePage || !state.selectedComponentId) return null;
          
          return activePage.components.find((comp) => comp.id === state.selectedComponentId) || null;
        },
        
        getComponentById: (pageId, componentId) => {
          const state = get();
          const page = state.pages.find((p) => p.id === pageId);
          return page?.components.find((comp) => comp.id === componentId) || null;
        },
        
        saveToStorage: () => {
          const state = get();
          saveStateToStorage(state.pages, state.activePageId);
          set({ isDirty: false, isSaved: true });
          console.log('✅ Сохранено');
        },
        
        loadFromStorage: () => {
          const loaded = loadStateFromStorage();
          if (loaded && loaded.pages.length > 0) {
            // Миграция: добавляем значения по умолчанию для сетки для старых страниц
            const migratedPages = loaded.pages.map(page => ({
              ...page,
              gridEnabled: page.gridEnabled ?? true,
              gridSize: page.gridSize ?? 10,
              background: page.background ?? '#ffffff',
            }));
            
            // Проверяем, что activePageId существует в загруженных страницах
            const validActivePageId = loaded.activePageId && 
              migratedPages.some(page => page.id === loaded.activePageId) 
              ? loaded.activePageId 
              : migratedPages[0].id;
            
            set({ pages: migratedPages, activePageId: validActivePageId, isDirty: false, isSaved: true });
          } else {
            // Создаем первую страницу по умолчанию с дашборд-виджетом
            const defaultDashboardComponent: Component = {
              id: `comp_dashboard_${Date.now()}`,
              type: 'dashboard',
              x: 40,
              y: 40,
              width: 600,
              height: 300,
              props: {},
            };
            const defaultPage: Page = {
              id: `page_${Date.now()}`,
              name: 'Главная страница',
              components: [defaultDashboardComponent],
              background: '#ffffff',
              gridEnabled: true,
              gridSize: 10,
            };
            set({ 
              pages: [defaultPage], 
              activePageId: defaultPage.id, 
              isDirty: false, 
              isSaved: true 
            });
            saveStateToStorage([defaultPage], defaultPage.id);
          }
        },
        
        undo: () => {
          get().undo();
          startAutoSave();
        },
        
        redo: () => {
          get().redo();
          startAutoSave();
        },
        
        canUndo: () => {
          return get().canUndo();
        },
        
        canRedo: () => {
          return get().canRedo();
        },
      };
    }),
    {
      name: 'pages-store',
    }
  )
);

// При инициализации store — загрузить из localStorage
usePagesStore.getState().loadFromStorage();

// Жёсткая гарантия: если после загрузки нет страниц или нет activePageId — создать дефолтную страницу
if (typeof window !== 'undefined') {
  const state = usePagesStore.getState();
  if (!state.pages || state.pages.length === 0 || !state.activePageId) {
    const defaultDashboardComponent = {
      id: `comp_dashboard_${Date.now()}`,
      type: 'dashboard',
      x: 40,
      y: 40,
      width: 600,
      height: 300,
      props: {},
    };
    const defaultPage = {
      id: `page_${Date.now()}`,
      name: 'Главная страница',
      components: [defaultDashboardComponent],
      background: '#ffffff',
      gridEnabled: true,
      gridSize: 10,
    };
    usePagesStore.setState({
      pages: [defaultPage],
      activePageId: defaultPage.id,
      isDirty: false,
      isSaved: true,
    });
    localStorage.setItem('hr-crm-editor-pages-v1', JSON.stringify({ pages: [defaultPage], activePageId: defaultPage.id }));
  }
}

// Очистка таймера при выгрузке страницы
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    stopGlobalAutoSave();
  });
} 