import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidateAuthService, CandidateAuthRequest, EmailVerificationRequest } from '../services/candidateAuthService';

export interface UseCandidateAuthReturn {
  // Состояние
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  candidateData: any;
  
  // Действия
  authenticate: (data: CandidateAuthRequest) => Promise<void>;
  verifyEmail: (data: EmailVerificationRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useCandidateAuth = (): UseCandidateAuthReturn => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [candidateData, setCandidateData] = useState<any>(null);

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    const checkAuth = () => {
      const token = candidateAuthService.getToken();
      const data = candidateAuthService.getCandidateData();
      
      if (token && data) {
        setIsAuthenticated(true);
        setCandidateData(data);
      }
    };

    checkAuth();
  }, []);

  /**
   * Аутентификация кандидата
   */
  const authenticate = useCallback(async (data: CandidateAuthRequest) => {
    setIsLoading(true);
    setError('');

    console.log('Starting authentication with data:', data);

    // Для тестирования - всегда получаем успешный ответ от API
    const response = await candidateAuthService.authenticate(data);
    
    if (response.success) {
      console.log('Authentication successful:', response);
      setCandidateData({
        id: response.candidateId || '1',
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email
      });

      // Переходим к странице верификации
      navigate(`/candidate/verify-email?email=${encodeURIComponent(data.email)}`);
    } else {
      console.error('Authentication failed:', response.error);
      setError(response.error || 'Ошибка аутентификации');
    }
    
    setIsLoading(false);
    
    // Оригинальная логика (закомментирована для тестирования):
    /*
    try {
      console.log('Starting authentication with data:', data);

      const response = await candidateAuthService.authenticate(data);
      
      if (response.success) {
        console.log('Authentication successful:', response);
        setCandidateData({
          id: response.candidateId || '1',
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email
        });

        // Переходим к странице верификации
        navigate(`/candidate/verify-email?email=${encodeURIComponent(data.email)}`);
      } else {
        console.error('Authentication failed:', response.error);
        setError(response.error || 'Ошибка аутентификации');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Ошибка аутентификации';
      if (errorMessage.includes('не назначено собеседование') ||
          errorMessage.toLowerCase().includes('found user false') ||
          errorMessage.toLowerCase().includes('candidate not found')) {
        setError('Извините, для вас не назначено собеседование. Пожалуйста, обратитесь к рекрутеру.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
    */
  }, [navigate]);

  /**
   * Подтверждение email
   */
  const verifyEmail = async (data: EmailVerificationRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await candidateAuthService.verifyEmail(data.email, data.verificationCode);
      
      if (response.success && response.candidateId) {
        // Сохраняем токен и данные
        const candidateData = candidateAuthService.getCandidateData();
        if (candidateData) {
          setIsAuthenticated(true);
          setCandidateData(candidateData);
          
          // Переходим к интервью
          navigate('/candidate/interview/1'); // Временный ID интервью
        }
      } else {
        setError(response.error || 'Ошибка подтверждения email');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка подтверждения email');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Выход из системы
   */
  const logout = (): void => {
    candidateAuthService.clearAuth();
    setIsAuthenticated(false);
    setCandidateData(null);
    setError(null);
    navigate('/candidate/login');
  };

  /**
   * Очистка ошибки
   */
  const clearError = (): void => {
    setError(null);
  };

  return {
    isAuthenticated,
    isLoading,
    error,
    candidateData,
    authenticate,
    verifyEmail,
    logout,
    clearError
  };
};
