import { create } from 'zustand';
import { CandidateLoginRequest } from '../api/models';
import { apiService } from '../services/apiService';
import { jwtDecode } from 'jwt-decode';
import type { Interview } from '../api/models';

export type UserRole = 'CANDIDATE' | null;
export type AuthZone = 'crm' | 'candidate';

type AuthUser = Interview | null;

interface AuthState {
  token: string | null;
  role: UserRole;
  user: AuthUser;
  isAuth: boolean;
  isLoading: boolean;
  error: string | null;
  showSessionExpiredModal: boolean;
  loginAdmin: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  loginCandidate: (data: CandidateLoginRequest, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  restoreSession: () => Promise<void>;
  showSessionExpired: () => void;
  hideSessionExpired: () => void;
  setAuthError: (msg: string) => void;
}

function parseJwt(token: string): Record<string, unknown> {
  try {
    return jwtDecode(token) as Record<string, unknown>;
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return {};
  }
}

// Helper function to get storage key with zone
const getKey = (base: string, zone: AuthZone) => `${zone}_${base}`;

// Helper function to save auth data to storage
const saveAuthData = (token: string, user: AuthUser, role: string, rememberMe: boolean = false, zone: AuthZone = 'crm') => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(getKey('auth_token', zone), token);
  storage.setItem(getKey('auth_user', zone), JSON.stringify(user));
  storage.setItem(getKey('auth_role', zone), role);
  storage.setItem(getKey('auth_rememberMe', zone), rememberMe.toString());
};

// Helper function to get auth data from storage
const getAuthData = (zone: AuthZone = 'crm') => {
  let token = localStorage.getItem(getKey('auth_token', zone));
  let userStr = localStorage.getItem(getKey('auth_user', zone));
  let role = localStorage.getItem(getKey('auth_role', zone)) as UserRole;
  let rememberMe = localStorage.getItem(getKey('auth_rememberMe', zone)) === 'true';

  if (!token || !userStr) {
    token = sessionStorage.getItem(getKey('auth_token', zone));
    userStr = sessionStorage.getItem(getKey('auth_user', zone));
    role = sessionStorage.getItem(getKey('auth_role', zone)) as UserRole;
    rememberMe = false;
  }

  return { token, userStr, role, rememberMe };
};

// Helper function to clear auth data from both storages
const clearAuthData = (zone: AuthZone = 'crm') => {
  localStorage.removeItem(getKey('auth_token', zone));
  localStorage.removeItem(getKey('auth_user', zone));
  localStorage.removeItem(getKey('auth_role', zone));
  localStorage.removeItem(getKey('auth_rememberMe', zone));

  sessionStorage.removeItem(getKey('auth_token', zone));
  sessionStorage.removeItem(getKey('auth_user', zone));
  sessionStorage.removeItem(getKey('auth_role', zone));
  sessionStorage.removeItem(getKey('auth_rememberMe', zone));
};

/**
 * authStore (Zustand)
 * Хранит состояние авторизации, токен, пользователя, роль, ошибки и методы для логина/логаута/восстановления сессии.
 *
 * Sequence diagram (Mermaid) — процесс авторизации:
 *
 * ```mermaid
 * sequenceDiagram
 *   participant UI as LoginForm
 *   participant Store as useAuthStore
 *   participant API as AuthApi/CandidatesApi
 *   participant Storage as localStorage/sessionStorage
 *
 *   UI->>Store: loginAdmin(email, password)
 *   Store->>API: POST /login
 *   API-->>Store: { token, user }
 *   Store->>Storage: saveAuthData(token, user, role)
 *   Store-->>UI: set({ token, user, role, isAuth: true })
 *
 *   UI->>Store: loginCandidate(data)
 *   Store->>API: POST /auth-candidate
 *   API-->>Store: { token, candidate }
 *   Store->>Storage: saveAuthData(token, candidate, role)
 *   Store-->>UI: set({ token, user: candidate, role, isAuth: true })
 *
 *   UI->>Store: restoreSession()
 *   Store->>Storage: getAuthData()
 *   alt token найден и не истёк
 *     Store-->>UI: set({ token, user, role, isAuth: true })
 *   else нет токена или истёк
 *     Store-->>UI: set({ isAuth: false })
 *   end
 * ```
 *
 * Бизнес-логика:
 * - loginAdmin: логинит администратора, сохраняет токен и пользователя, обновляет состояние
 * - loginCandidate: логинит кандидата, сохраняет токен и пользователя, обновляет состояние
 * - restoreSession: восстанавливает сессию из localStorage/sessionStorage, проверяет валидность токена
 * - logout: очищает все данные, сбрасывает состояние
 */
export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  user: null,
  isAuth: false,
  isLoading: true, // Initialize loading to true
  error: null,
  showSessionExpiredModal: false,
  async loginAdmin() { throw new Error('Admin auth is not available'); },
  async loginCandidate(data: CandidateLoginRequest, rememberMe: boolean = false) {
    const zone: AuthZone = 'candidate';
    console.log('🔍 loginCandidate - Starting login process');
    
    // Для тестирования - всегда получаем успешный ответ от API
    const res = await apiService.getApiClient().candidates.loginCandidate(data);
    const candidateResp = res.data as any;
    const candidate = candidateResp.interview as Interview | undefined;
    // На этом шаге токена нет — он придёт после верификации email
    if (candidate) {
      saveAuthData('', candidate, 'CANDIDATE', rememberMe, zone);
    }

    set({ token: null, user: candidate || null, role: 'CANDIDATE', isAuth: false, error: null });
    apiService.refreshApiClient();
    console.log('🔍 loginCandidate - Login completed successfully');
    
    // Оригинальная логика (закомментирована для тестирования):
    /*
    try {
      const res = await apiService.getApiClient().candidates.loginCandidate(data);
      const { token, candidate } = res.data as { token: string; candidate: Candidate };
      const payload = token ? parseJwt(token as string) : {};

      if (token) {
        saveAuthData(token as string, candidate, (payload.role as string) || 'CANDIDATE', rememberMe, 'candidate');
      }

      set({ token, user: candidate, role: (payload.role as UserRole) || 'CANDIDATE', isAuth: true, error: null });
      apiService.refreshApiClient();
    } catch (e: unknown) {
      const error = e instanceof Error ? e : { message: 'Ошибка авторизации кандидата' };
      const errorMessage = (error as Error).message || 'Ошибка авторизации кандидата';
      
      // Специальная обработка для случая когда кандидат не найден
      if (errorMessage.includes('не назначено собеседование') ||
          errorMessage.toLowerCase().includes('found user false') ||
          errorMessage.toLowerCase().includes('candidate not found')) {
        const customError = new Error('Извините, для вас не назначено собеседование. Пожалуйста, обратитесь к рекрутеру.');
        set({ error: customError.message, isAuth: false });
        throw customError;
      }
      
      set({ error: errorMessage, isAuth: false });
      throw error;
    }
    */
  },
  logout() {
    clearAuthData('crm');
    clearAuthData('candidate');
    localStorage.removeItem('candidate_form_data');
    localStorage.removeItem('admin_remember_me');
    set({ token: null, role: null, user: null, isAuth: false, isLoading: false, error: null });
    apiService.refreshApiClient();
  },
  async restoreSession() {
    set({ isLoading: true });
    try {
      let zone: AuthZone = 'crm';
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        if (/^\/(interview|session)/.test(path)) zone = 'candidate';
      }
      console.log('🔍 restoreSession - Starting session restoration for zone:', zone);
      const { token, userStr, role, rememberMe } = getAuthData(zone);

      console.log('🔍 restoreSession - Found token:', token ? `${token.substring(0, 20)}...` : 'null');
      console.log('🔍 restoreSession - Found user:', !!userStr);

      if (token && userStr) {
        const user = JSON.parse(userStr) as AuthUser;
        const payload = parseJwt(token);

        console.log('🔍 restoreSession - Token payload:', payload);

        const currentTime = Date.now() / 1000;
        if ((payload.exp as number | undefined) && (payload.exp as number) < currentTime) {
          console.log('🔍 restoreSession - Token expired, clearing session');
          clearAuthData(zone);
          localStorage.removeItem('candidate_form_data');
          localStorage.removeItem('admin_remember_me');
          set({ token: null, role: null, user: null, isAuth: false, isLoading: false, error: null });
          apiService.refreshApiClient();
          return;
        }

        set({ token, user, role, isAuth: true, error: null, isLoading: false });
        apiService.refreshApiClient();
        console.log('🔍 restoreSession - Session restored successfully', { rememberMe });
      } else {
        console.log('🔍 restoreSession - No saved session found');
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('🔍 restoreSession - Error restoring session:', error);
      clearAuthData('crm');
      clearAuthData('candidate');
      localStorage.removeItem('candidate_form_data');
      localStorage.removeItem('admin_remember_me');
      set({ token: null, role: null, user: null, isAuth: false, isLoading: false, error: null });
      apiService.refreshApiClient();
    }
  },
  showSessionExpired() {
    set({ showSessionExpiredModal: true });
  },
  hideSessionExpired() {
    set({ showSessionExpiredModal: false });
  },
  setAuthError(msg: string) {
    set({ error: msg });
  },
})); 
