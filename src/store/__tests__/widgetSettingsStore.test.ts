import { useWidgetSettingsStore, WidgetSettingsValue } from '../widgetSettingsStore';

describe('widgetSettingsStore', () => {
  beforeEach(() => {
    // Очищаем store и localStorage перед каждым тестом
    localStorage.clear();
    useWidgetSettingsStore.setState({ settings: {} });
    // Очищаем localStorage после установки пустого состояния
    localStorage.removeItem('widget-settings');
  });

  it('инициализируется с пустыми настройками', () => {
    const store = useWidgetSettingsStore.getState();
    expect(store.settings).toEqual({});
  });

  it('имеет все необходимые методы', () => {
    const store = useWidgetSettingsStore.getState();
    
    expect(typeof store.setWidgetSettings).toBe('function');
    expect(typeof store.getWidgetSettings).toBe('function');
    expect(typeof store.updateWidgetSetting).toBe('function');
    expect(typeof store.resetWidgetSettings).toBe('function');
    expect(typeof store.saveToStorage).toBe('function');
    expect(typeof store.loadFromStorage).toBe('function');
  });

  it('устанавливает настройки виджета', () => {
    const store = useWidgetSettingsStore.getState();
    const testSettings = {
      title: 'Test Widget',
      enabled: true,
      count: 42,
    };

    store.setWidgetSettings('test-widget', testSettings);
    
    const newState = useWidgetSettingsStore.getState();
    expect(newState.settings['test-widget']).toEqual(testSettings);
  });

  it('получает настройки виджета', () => {
    const store = useWidgetSettingsStore.getState();
    const testSettings = {
      title: 'Test Widget',
      enabled: true,
    };

    store.setWidgetSettings('test-widget', testSettings);
    
    const retrievedSettings = store.getWidgetSettings('test-widget');
    expect(retrievedSettings).toEqual(testSettings);
  });

  it('возвращает пустой объект для несуществующего виджета', () => {
    const store = useWidgetSettingsStore.getState();
    
    const settings = store.getWidgetSettings('non-existent-widget');
    expect(settings).toEqual({});
  });

  it('обновляет отдельную настройку виджета', () => {
    const store = useWidgetSettingsStore.getState();
    
    // Устанавливаем начальные настройки
    store.setWidgetSettings('test-widget', { title: 'Old Title', enabled: false });
    
    // Обновляем одну настройку
    store.updateWidgetSetting('test-widget', 'title', 'New Title');
    
    const settings = store.getWidgetSettings('test-widget');
    expect(settings.title).toBe('New Title');
    expect(settings.enabled).toBe(false); // должно остаться неизменным
  });

  it('создает новый виджет при обновлении настройки несуществующего виджета', () => {
    const store = useWidgetSettingsStore.getState();
    
    store.updateWidgetSetting('new-widget', 'title', 'New Widget');
    
    const settings = store.getWidgetSettings('new-widget');
    expect(settings.title).toBe('New Widget');
  });

  it('сбрасывает настройки виджета', () => {
    const store = useWidgetSettingsStore.getState();
    
    // Устанавливаем настройки для двух виджетов
    store.setWidgetSettings('widget1', { title: 'Widget 1' });
    store.setWidgetSettings('widget2', { title: 'Widget 2' });
    
    // Сбрасываем настройки первого виджета
    store.resetWidgetSettings('widget1');
    
    const state = useWidgetSettingsStore.getState();
    expect(state.settings['widget1']).toBeUndefined();
    expect(state.settings['widget2']).toEqual({ title: 'Widget 2' });
  });

  it('сохраняет и загружает из localStorage', () => {
    const store = useWidgetSettingsStore.getState();
    const testSettings = {
      'widget1': { title: 'Widget 1', enabled: true },
      'widget2': { title: 'Widget 2', count: 5 },
    };

    // Устанавливаем настройки
    useWidgetSettingsStore.setState({ settings: testSettings });
    
    // Сохраняем
    store.saveToStorage();
    
    // Проверяем, что сохранилось в localStorage
    const saved = localStorage.getItem('widget-settings');
    expect(saved).toBeTruthy();
    const parsed = JSON.parse(saved!);
    expect(parsed).toEqual(testSettings);
    
    // Очищаем store
    useWidgetSettingsStore.setState({ settings: {} });
    expect(useWidgetSettingsStore.getState().settings).toEqual({});
    
    // Загружаем
    store.loadFromStorage();
    expect(useWidgetSettingsStore.getState().settings).toEqual(testSettings);
  });

  it('обрабатывает различные типы значений', () => {
    const store = useWidgetSettingsStore.getState();
    
    store.updateWidgetSetting('test-widget', 'string', 'text');
    store.updateWidgetSetting('test-widget', 'number', 123);
    store.updateWidgetSetting('test-widget', 'boolean', true);
    store.updateWidgetSetting('test-widget', 'object', { nested: 'value' });
    store.updateWidgetSetting('test-widget', 'null', null);
    
    const settings = store.getWidgetSettings('test-widget');
    expect(settings.string).toBe('text');
    expect(settings.number).toBe(123);
    expect(settings.boolean).toBe(true);
    expect(settings.object).toEqual({ nested: 'value' });
    expect(settings.null).toBeNull();
  });

  it('автоматически сохраняет в localStorage при изменениях', () => {
    const store = useWidgetSettingsStore.getState();
    
    // Очищаем localStorage перед тестом
    localStorage.removeItem('widget-settings');
    
    store.setWidgetSettings('auto-save-test', { title: 'Auto Save' });
    
    // Проверяем, что сохранилось в localStorage
    const saved = localStorage.getItem('widget-settings');
    expect(saved).toBeTruthy();
    
    const parsed = JSON.parse(saved!);
    expect(parsed['auto-save-test']).toEqual({ title: 'Auto Save' });
  });
});