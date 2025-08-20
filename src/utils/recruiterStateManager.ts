import React from 'react';

// Утилита для управления состоянием рекрутерской части
// Сохраняет все выборы пользователя в localStorage

export interface RecruiterState {
  // VacancyList состояние
  vacancyList: {
    searchTerm: string;
    statusFilter: string;
    tab: 'all' | 'my';
    selectedId: string | null;
    page: number;
    pageSize: number;
    vacancyTab: string;
  };
  
  // InterviewList состояние
  interviewList: {
    currentPage: number;
    pageSize: number;
    selectedPosition: number | undefined;
    selectedStatus: string;
    searchQuery: string;
  };
  
  // VacancyCreate состояние
  vacancyCreate: {
    form: {
      title: string;
      status: string;
      topics: string[];
      language: string;
      showOtherLang: boolean;
      tags: string[];
      minScore: number;
      inviteNext: boolean;
      answerTime: number;
      level: string;
      saveAudio: boolean;
      saveVideo: boolean;
      randomOrder: boolean;
      description: string;
      questionType: string;
      questionsCount: number;
      checkType: string;
    };
    activeTab: 'basic' | 'questions' | 'advanced';
  };
  
  // InterviewCreate состояние
  interviewCreate: {
    formData: {
      firstName: string;
      lastName: string;
      email: string;
      vacancyId: string;
      scheduledDate: string;
    };
  };
  
  // Общие настройки
  general: {
    lastVisitedPage: string;
    theme: 'light' | 'dark';
    sidebarCollapsed: boolean;
  };
}

const STORAGE_KEY = 'recruiter_state_v1';

// Функции для работы с localStorage
const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`💾 Сохранено в localStorage: ${key}`, data);
  } catch (error) {
    console.error(`❌ Ошибка сохранения в localStorage: ${key}`, error);
  }
};

const loadFromStorage = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      console.log(`📖 Загружено из localStorage: ${key}`, parsed);
      return parsed;
    }
  } catch (error) {
    console.error(`❌ Ошибка загрузки из localStorage: ${key}`, error);
  }
  return null;
};

// Дефолтное состояние
const defaultState: RecruiterState = {
  vacancyList: {
    searchTerm: '',
    statusFilter: '',
    tab: 'all',
    selectedId: null,
    page: 0,
    pageSize: 20,
    vacancyTab: 'candidates',
  },
  interviewList: {
    currentPage: 0,
    pageSize: 10,
    selectedPosition: undefined,
    selectedStatus: '',
    searchQuery: '',
  },
  vacancyCreate: {
    form: {
      title: '',
      status: 'ACTIVE',
      topics: [],
      language: 'Русский',
      showOtherLang: false,
      tags: [],
      minScore: 5,
      inviteNext: false,
      answerTime: 150,
      level: 'MIDDLE',
      saveAudio: false,
      saveVideo: false,
      randomOrder: false,
      description: '',
      questionType: 'В основном хард-скиллы',
      questionsCount: 5,
      checkType: '',
    },
    activeTab: 'basic',
  },
  interviewCreate: {
    formData: {
      firstName: '',
      lastName: '',
      email: '',
      vacancyId: '',
      scheduledDate: '',
    },
  },
  general: {
    lastVisitedPage: '',
    theme: 'light',
    sidebarCollapsed: false,
  },
};

// Основной класс для управления состоянием
class RecruiterStateManager {
  private state: RecruiterState;
  private listeners: Set<(state: RecruiterState) => void> = new Set();

  constructor() {
    this.state = this.loadState();
    console.log('🔄 RecruiterStateManager инициализирован с состоянием:', this.state);
  }

  // Загрузка состояния из localStorage
  private loadState(): RecruiterState {
    const saved = loadFromStorage(STORAGE_KEY);
    if (saved) {
      // Объединяем с дефолтным состоянием для совместимости
      return this.mergeWithDefaults(saved);
    }
    return { ...defaultState };
  }

  // Объединение с дефолтными значениями
  private mergeWithDefaults(saved: any): RecruiterState {
    const merged = { ...defaultState };
    
    // Рекурсивное объединение объектов
    const mergeDeep = (target: any, source: any) => {
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          if (!target[key]) target[key] = {};
          mergeDeep(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    };
    
    mergeDeep(merged, saved);
    return merged;
  }

  // Сохранение состояния в localStorage
  private saveState() {
    saveToStorage(STORAGE_KEY, this.state);
    this.notifyListeners();
  }

  // Уведомление слушателей об изменениях
  private notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.state);
      } catch (error) {
        console.error('❌ Ошибка в слушателе состояния:', error);
      }
    });
  }

  // Подписка на изменения состояния
  subscribe(listener: (state: RecruiterState) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Получение текущего состояния
  getState(): RecruiterState {
    return { ...this.state };
  }

  // Обновление состояния
  updateState(updates: Partial<RecruiterState>) {
    this.state = { ...this.state, ...updates };
    this.saveState();
  }

  // Методы для работы с VacancyList
  updateVacancyList(updates: Partial<RecruiterState['vacancyList']>) {
    this.state.vacancyList = { ...this.state.vacancyList, ...updates };
    this.saveState();
  }

  getVacancyListState() {
    return { ...this.state.vacancyList };
  }

  // Методы для работы с InterviewList
  updateInterviewList(updates: Partial<RecruiterState['interviewList']>) {
    this.state.interviewList = { ...this.state.interviewList, ...updates };
    this.saveState();
  }

  getInterviewListState() {
    return { ...this.state.interviewList };
  }

  // Методы для работы с VacancyCreate
  updateVacancyCreate(updates: Partial<RecruiterState['vacancyCreate']>) {
    this.state.vacancyCreate = { ...this.state.vacancyCreate, ...updates };
    this.saveState();
  }

  getVacancyCreateState() {
    return { ...this.state.vacancyCreate };
  }

  // Методы для работы с InterviewCreate
  updateInterviewCreate(updates: Partial<RecruiterState['interviewCreate']>) {
    this.state.interviewCreate = { ...this.state.interviewCreate, ...updates };
    this.saveState();
  }

  getInterviewCreateState() {
    return { ...this.state.interviewCreate };
  }

  // Методы для работы с общими настройками
  updateGeneral(updates: Partial<RecruiterState['general']>) {
    this.state.general = { ...this.state.general, ...updates };
    this.saveState();
  }

  getGeneralState() {
    return { ...this.state.general };
  }

  // Сброс состояния
  resetState() {
    this.state = { ...defaultState };
    this.saveState();
    console.log('🔄 Состояние рекрутера сброшено к дефолтным значениям');
  }

  // Сброс конкретной секции
  resetSection(section: keyof RecruiterState) {
    if (section in defaultState) {
      (this.state as any)[section] = { ...(defaultState as any)[section] };
      this.saveState();
      console.log(`🔄 Секция ${section} сброшена к дефолтным значениям`);
    }
  }

  // Очистка localStorage
  clearStorage() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('🗑️ Состояние рекрутера удалено из localStorage');
    } catch (error) {
      console.error('❌ Ошибка удаления состояния из localStorage:', error);
    }
  }
}

// Создаем единственный экземпляр
export const recruiterStateManager = new RecruiterStateManager();

// React хук для использования состояния
export const useRecruiterState = () => {
  const [state, setState] = React.useState<RecruiterState>(recruiterStateManager.getState());

  React.useEffect(() => {
    const unsubscribe = recruiterStateManager.subscribe(setState);
    return unsubscribe;
  }, []);

  return {
    state,
    updateState: recruiterStateManager.updateState.bind(recruiterStateManager),
    updateVacancyList: recruiterStateManager.updateVacancyList.bind(recruiterStateManager),
    updateInterviewList: recruiterStateManager.updateInterviewList.bind(recruiterStateManager),
    updateVacancyCreate: recruiterStateManager.updateVacancyCreate.bind(recruiterStateManager),
    updateInterviewCreate: recruiterStateManager.updateInterviewCreate.bind(recruiterStateManager),
    updateGeneral: recruiterStateManager.updateGeneral.bind(recruiterStateManager),
    resetState: recruiterStateManager.resetState.bind(recruiterStateManager),
    resetSection: recruiterStateManager.resetSection.bind(recruiterStateManager),
  };
};

// Экспортируем для прямого использования
export default recruiterStateManager; 