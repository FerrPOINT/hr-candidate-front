import { usePagesStore } from '../pagesStore';

describe('pagesStore', () => {
  beforeEach(() => {
    // Очищаем localStorage перед каждым тестом
    localStorage.clear();
  });

  it('инициализируется с правильными значениями по умолчанию', () => {
    const store = usePagesStore.getState();
    
    expect(store.pages).toBeDefined();
    expect(Array.isArray(store.pages)).toBe(true);
    expect(store.activePageId).toBeDefined();
    expect(store.selectedComponentId).toBeNull();
    expect(store.isDirty).toBe(false);
    expect(store.isSaved).toBe(true);
    expect(store.isModalOpen).toBe(false);
  });

  it('имеет все необходимые методы', () => {
    const store = usePagesStore.getState();
    
    expect(typeof store.setPages).toBe('function');
    expect(typeof store.setActivePage).toBe('function');
    expect(typeof store.setSelectedComponent).toBe('function');
    expect(typeof store.addPage).toBe('function');
    expect(typeof store.updatePage).toBe('function');
    expect(typeof store.deletePage).toBe('function');
    expect(typeof store.addComponent).toBe('function');
    expect(typeof store.updateComponent).toBe('function');
    expect(typeof store.deleteComponent).toBe('function');
    expect(typeof store.getActivePage).toBe('function');
    expect(typeof store.saveToStorage).toBe('function');
    expect(typeof store.loadFromStorage).toBe('function');
  });

  it('устанавливает выбранный компонент', () => {
    const store = usePagesStore.getState();
    
    store.setSelectedComponent('test-component-id');
    expect(usePagesStore.getState().selectedComponentId).toBe('test-component-id');
    
    store.setSelectedComponent(null);
    expect(usePagesStore.getState().selectedComponentId).toBeNull();
  });

  it('управляет состоянием модального окна', () => {
    const store = usePagesStore.getState();
    
    store.setModalOpen(true);
    expect(usePagesStore.getState().isModalOpen).toBe(true);
    
    store.setModalOpen(false);
    expect(usePagesStore.getState().isModalOpen).toBe(false);
  });

  it('управляет состоянием dirty/saved', () => {
    const store = usePagesStore.getState();
    
    store.setDirty(true);
    expect(usePagesStore.getState().isDirty).toBe(true);
    
    store.setSaved(false);
    expect(usePagesStore.getState().isSaved).toBe(false);
  });

  it('добавляет новую страницу', () => {
    const store = usePagesStore.getState();
    const initialPagesCount = store.pages.length;
    
    store.addPage('Test Page');
    
    const newState = usePagesStore.getState();
    expect(newState.pages.length).toBe(initialPagesCount + 1);
    expect(newState.pages[newState.pages.length - 1].name).toBe('Test Page');
    expect(newState.isDirty).toBe(true);
    expect(newState.isSaved).toBe(false);
  });

  it('получает активную страницу', () => {
    const store = usePagesStore.getState();
    const activePage = store.getActivePage();
    
    expect(activePage).toBeDefined();
    expect(activePage?.id).toBe(store.activePageId);
  });

  it('сохраняет и загружает из localStorage', () => {
    const store = usePagesStore.getState();
    
    // Сохраняем
    store.saveToStorage();
    expect(usePagesStore.getState().isDirty).toBe(false);
    expect(usePagesStore.getState().isSaved).toBe(true);
    
    // Загружаем
    store.loadFromStorage();
    expect(usePagesStore.getState().pages).toBeDefined();
  });

  it('поддерживает undo/redo', () => {
    const store = usePagesStore.getState();
    
    expect(typeof store.undo).toBe('function');
    expect(typeof store.redo).toBe('function');
    expect(typeof store.canUndo).toBe('function');
    expect(typeof store.canRedo).toBe('function');
    
    // Изначально undo/redo недоступны
    expect(store.canUndo()).toBe(false);
    expect(store.canRedo()).toBe(false);
  });
});