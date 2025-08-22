import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { WMTLogo } from '../components/';
import { HelpButton, HelpModal } from '../components/';
import { Loader2 } from 'lucide-react';
import { candidateAuthService, CandidateAuthData } from '../services/candidateAuthService';

interface JobPosition {
  title: string;
  department: string;
  company: string;
  type: string;
  questionsCount: number;
}

const CandidateLogin: React.FC = () => {
  const navigate = useNavigate();
  const { interviewId } = useParams<{ interviewId: string }>();
  
  // Проверяем, что candidateAuthService доступен
  console.log('🔍 candidateAuthService доступен:', !!candidateAuthService);
  console.log('🔍 candidateAuthService.authenticate доступен:', !!candidateAuthService?.authenticate);
  
  const [firstName, setFirstName] = useState('Тест');
  const [lastName, setLastName] = useState('Кандидат');
  const [email, setEmail] = useState('test@example.com');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [jobPosition, setJobPosition] = useState<JobPosition | null>(null);
  const [isLoadingPosition, setIsLoadingPosition] = useState(true);
  const [positionId, setPositionId] = useState<number | null>(null);

  // Получаем positionId из interviewId через API
  useEffect(() => {
    console.log('🔄 useEffect для загрузки данных о вакансии вызван');
    console.log('📝 interviewId:', interviewId);
    
    const loadPositionInfo = async () => {
      if (!interviewId) {
        console.log('❌ interviewId отсутствует');
        return;
      }
      
      try {
        console.log('📤 Начинаем загрузку информации о вакансии для interviewId:', interviewId);
        setIsLoadingPosition(true);
        
        // Получаем информацию о вакансии через interviewId
        console.log('🔐 Вызываем candidateAuthService.getPositionSummary...');
        const positionSummary = await candidateAuthService.getPositionSummary(parseInt(interviewId, 10));
        console.log('📥 Получена информация о вакансии:', positionSummary);
        
        setJobPosition({
          title: positionSummary.title,
          department: positionSummary.department,
          company: positionSummary.company,
          type: positionSummary.type,
          questionsCount: positionSummary.questionsCount
        });
        
        // Используем ID вакансии из ответа API
        console.log('💾 Устанавливаем positionId:', positionSummary.id);
        setPositionId(positionSummary.id);
      } catch (error) {
        console.error('💥 Ошибка загрузки информации о вакансии:', error);
        // В случае ошибки используем заглушку и дефолтный positionId
        console.log('🔄 Используем fallback данные');
        setJobPosition({
          title: 'Software Engineer',
          department: 'Engineering',
          company: 'WMT group',
          type: 'Full-time',
          questionsCount: 6
        });
        const fallbackPositionId = parseInt(interviewId, 10);
        console.log('💾 Устанавливаем fallback positionId:', fallbackPositionId);
        setPositionId(fallbackPositionId);
      } finally {
        console.log('🏁 Завершаем загрузку данных о вакансии');
        setIsLoadingPosition(false);
      }
    };

    loadPositionInfo();
  }, [interviewId]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'Имя обязательно для заполнения';
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = 'Имя должно содержать минимум 2 символа';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Фамилия обязательна для заполнения';
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = 'Фамилия должна содержать минимум 2 символа';
    }

    if (!email.trim()) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Введите корректный email';
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 handleSubmit вызван');
    console.log('📝 Текущие значения формы:', { firstName, lastName, email, positionId });
    
    // Очищаем предыдущие ошибки
    setServerError('');
    setFieldErrors({});
    
    if (!validateForm()) {
      console.log('❌ Валидация формы не прошла');
      return;
    }

    if (!positionId) {
      console.log('❌ positionId отсутствует');
      setServerError('Ошибка загрузки данных вакансии. Пожалуйста, обновите страницу.');
      return;
    }

    console.log('✅ Форма валидна, начинаем отправку');
    setIsLoading(true);

    try {
      console.log('📤 Отправляем запрос на логин кандидата:', { 
        firstName: firstName.trim(), 
        lastName: lastName.trim(), 
        email: email.trim(),
        positionId 
      });

      // Вызываем API логина кандидата
      console.log('🔐 Вызываем candidateAuthService.authenticate...');
      const response = await candidateAuthService.authenticate({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        positionId
      });

      console.log('📥 Получен ответ от candidateAuthService:', response);

      // Переходим на следующую страницу ТОЛЬКО при успешном ответе
      if (response.success) {
        console.log('✅ Аутентификация успешна:', response);
        
        // Проверяем, что есть candidateId для безопасности
        if (response.candidateId) {
          console.log('🔄 Переходим на страницу верификации');
          // Успешный логин - переходим на страницу верификации
          navigate(`/candidate/verify-email?email=${encodeURIComponent(email.trim())}&interviewId=${interviewId}`);
        } else {
          console.log('⚠️ Неожиданный ответ - нет candidateId');
          // Неожиданный ответ - показываем ошибку
          setServerError('Неожиданный ответ от сервера. Пожалуйста, попробуйте еще раз.');
        }
      } else {
        // Ошибка аутентификации - показываем сообщение об ошибке
        console.log('❌ Аутентификация не удалась:', response.error);
        setServerError(response.error || 'Произошла ошибка при авторизации');
      }
    } catch (error: any) {
      console.error('💥 Ошибка в handleSubmit:', error);
      
      // Обрабатываем различные типы ошибок от сервера
      let errorMessage = 'Произошла ошибка при авторизации';
      
      if (error.response?.status === 400) {
        errorMessage = 'Неверные данные для входа. Пожалуйста, проверьте введенную информацию.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Извините, для вас не назначено собеседование. Пожалуйста, обратитесь к рекрутеру.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Доступ запрещен. Пожалуйста, убедитесь, что у вас есть активное собеседование.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Сервер временно недоступен. Пожалуйста, попробуйте позже.';
      } else if (error.message) {
        // Обрабатываем специфичные сообщения об ошибках
        if (error.message.includes('не назначено собеседование') ||
            error.message.toLowerCase().includes('found user false') ||
            error.message.toLowerCase().includes('candidate not found')) {
          errorMessage = 'Извините, для вас не назначено собеседование. Пожалуйста, обратитесь к рекрутеру.';
        } else if (error.message.includes('positionId') || error.message.includes('вакансии')) {
          errorMessage = 'Ошибка валидации данных вакансии. Пожалуйста, обратитесь к рекрутеру.';
        } else {
          errorMessage = error.message;
        }
      }
      
      console.log('🚨 Устанавливаем сообщение об ошибке:', errorMessage);
      setServerError(errorMessage);
    } finally {
      console.log('🏁 Завершаем handleSubmit, убираем loading');
      setIsLoading(false);
    }
  };

  // Показываем загрузку пока получаем данные о вакансии
  if (isLoadingPosition) {
    return (
      <div className="bg-[#e9eae2] min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#e16349]" />
          <p className="text-[#001a2c]">Загрузка информации о вакансии...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#e9eae2] min-h-screen w-full">
      <div className="w-full h-full flex flex-col">
        <div className="flex flex-col gap-4 p-6 w-full h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between w-full">
            <WMTLogo size="medium" />
            <HelpButton onClick={() => setIsHelpModalOpen(true)} />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
              <div className="bg-[#f5f6f1] rounded-[44px] p-8 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.08)] border border-[#e2e4e9]">
                
                {/* Job Position Card */}
                {jobPosition && (
                  <div className="bg-white rounded-[32px] p-6 mb-8 border border-[#e2e4e9]">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-[20px] font-bold text-[#001a2c] mb-1">
                          {jobPosition.title}
                        </h2>
                        <p className="text-[#868c98] text-sm">
                          {jobPosition.department} • {jobPosition.company}
                        </p>
                      </div>
                      <div className="bg-[#e16349] text-white px-3 py-1 rounded-full text-xs font-medium">
                        {jobPosition.type}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[#868c98] text-sm">
                      <span>📝</span>
                      <span>{jobPosition.questionsCount} вопросов в интервью</span>
                    </div>
                  </div>
                )}

                {/* Title */}
                <h1 className="text-[28px] font-bold text-[#001a2c] text-center mb-2">
                  Добро пожаловать
                </h1>

                {/* Description */}
                <p className="text-[#868c98] text-center mb-8">
                  Заполните форму ниже, чтобы начать интервью
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="firstName" className="text-[#001a2c] font-medium mb-2 block">
                      Имя *
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Введите ваше имя"
                      className={`w-full h-12 px-4 border-[#e2e4e9] rounded-xl bg-white focus:border-[#e16349] focus:ring-[#e16349] ${
                        fieldErrors.firstName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      disabled={isLoading}
                    />
                    {fieldErrors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{fieldErrors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName" className="text-[#001a2c] font-medium mb-2 block">
                      Фамилия *
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Введите вашу фамилию"
                      className={`w-full h-12 px-4 border-[#e2e4e9] rounded-xl bg-white focus:border-[#e16349] focus:ring-[#e16349] ${
                        fieldErrors.lastName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      disabled={isLoading}
                    />
                    {fieldErrors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{fieldErrors.lastName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-[#001a2c] font-medium mb-2 block">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Введите ваш email"
                      className={`w-full h-12 px-4 border-[#e2e4e9] rounded-xl bg-white focus:border-[#e16349] focus:ring-[#e16349] ${
                        fieldErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      disabled={isLoading}
                    />
                    {fieldErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
                    )}
                  </div>

                  {/* Server Error Message - показываем прямо над кнопкой */}
                  {serverError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-red-800 text-sm font-medium">Ошибка авторизации</p>
                          <p className="text-red-700 text-sm mt-1">{serverError}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading || !positionId}
                    className="w-full h-12 bg-[#e16349] hover:bg-[#d14a31] disabled:bg-[#f0f1ea] text-white disabled:text-[#868c98] rounded-xl font-medium transition-all duration-200"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Вход...
                      </>
                    ) : (
                      'Продолжить'
                    )}
                  </Button>
                </form>

                {/* Help Text */}
                <div className="mt-8 p-4 bg-[#f8f9f4] rounded-xl">
                  <p className="text-[#868c98] text-sm text-center">
                    После заполнения формы мы отправим код подтверждения на ваш email
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <HelpModal 
        isOpen={isHelpModalOpen} 
        onClose={() => setIsHelpModalOpen(false)} 
      />
    </div>
  );
};

export default CandidateLogin;
