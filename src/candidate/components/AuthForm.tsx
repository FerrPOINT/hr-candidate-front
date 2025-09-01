import { useState, useEffect } from 'react';
import { Button } from './';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Header, HelpModal } from './';
import { Loader2, AlertCircle } from 'lucide-react';
import { candidateAuthService } from '../services/candidateAuthService';

interface JobPosition {
  title: string;
  department: string;
  company: string;
  type: string;
  questionsCount: number;
}

interface AuthFormProps {
  onContinue: (userData: { firstName: string; lastName: string; email: string; jobPosition?: JobPosition; interviewId?: number }) => void;
  positionId: number; // ID вакансии, а не интервью
}

export function AuthForm({ onContinue, positionId }: AuthFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState<string>('');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jobPosition, setJobPosition] = useState<JobPosition | null>(null);
  const [isLoadingPosition, setIsLoadingPosition] = useState(true);

  // Загружаем информацию о вакансии при монтировании компонента (без localStorage)
  useEffect(() => {
    const loadPositionInfo = async () => {
      try {
        setIsLoadingPosition(true);
        const positionSummary = await candidateAuthService.getPositionSummary(positionId);
        setJobPosition({
          title: positionSummary.title,
          department: positionSummary.department,
          company: positionSummary.company,
          type: positionSummary.type,
          questionsCount: positionSummary.questionsCount
        });
      } catch (error) {
        console.error('Error loading position info:', error);
        // Не подставляем фиктивные данные, оставляем jobPosition = null — UI покажет ошибку
        setJobPosition(null);
      } finally {
        setIsLoadingPosition(false);
      }
    };

    if (positionId) {
      void loadPositionInfo();
    }
  }, [positionId]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'Имя обязательно для заполнения';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Фамилия обязательна для заполнения';
    }

    if (!email.trim()) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Введите корректный email адрес';
    }

    setErrors(newErrors);
    setServerError(''); // Очищаем серверную ошибку при новой попытке
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setServerError('');
      
      // Отладочный вывод данных
      console.log('🔍 AuthForm.handleSubmit - данные формы:', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        positionId: positionId
      });
      
      try {
        // Реальный вызов API для аутентификации
        const response = await candidateAuthService.authenticate({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          positionId: positionId
        });
        
        console.log('📥 AuthForm.handleSubmit - ответ от API:', response);
        
        if (response.success) {
          onContinue({ 
            firstName: firstName.trim(), 
            lastName: lastName.trim(), 
            email: email.trim(),
            jobPosition: jobPosition || undefined,
            interviewId: typeof response.interviewId === 'number' ? response.interviewId : undefined
          });
        } else {
          setServerError(response.error || 'Ошибка аутентификации');
        }
      } catch (error: any) {
        console.error('Authentication error:', error);
        setServerError(error.message || 'Произошла ошибка при авторизации');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header onHelpClick={() => setIsHelpModalOpen(true)} />

      {/* Main Content - Compact version */}
      <div className="flex-1 flex items-start justify-center px-4 pt-20">
            <div className="rounded-[44px] w-full max-w-2xl" style={{ backgroundColor: 'var(--interview-substrate)' }}>
              <div className="w-full h-full">
                <div className="flex flex-col gap-6 p-6 w-full">
                  
                  {/* Job Position Card - more compact */}
                  <div className="bg-white rounded-[32px] w-full">
                    <div className="w-full h-full">
                      <div className="flex flex-col gap-5 p-6 w-full">
                        
                        {/* Job info centered - more compact */}
                        <div className="text-center">
                          <p className="text-gray-600 mb-4">
                            Вы проходите интервью на позицию:
                          </p>
                          {isLoadingPosition ? (
                            <div className="rounded-[20px] p-5 mb-4" style={{ backgroundColor: 'rgba(225, 99, 73, 0.1)', border: '1px solid rgba(225, 99, 73, 0.2)' }}>
                              <div className="flex items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--interview-accent)' }} />
                                <span className="ml-2 text-gray-600">Загрузка информации о вакансии...</span>
                              </div>
                            </div>
                          ) : jobPosition ? (
                            <div className="rounded-[20px] p-5 mb-4" style={{ backgroundColor: 'rgba(225, 99, 73, 0.1)', border: '1px solid rgba(225, 99, 73, 0.2)' }}>
                              <h4 className="mb-2" style={{ color: 'var(--interview-accent)' }}>
                                {jobPosition.title}
                              </h4>
                              <p className="text-gray-600">
                                {jobPosition.company} • {jobPosition.questionsCount} вопросов
                              </p>
                            </div>
                          ) : (
                            <div className="rounded-[20px] p-5 mb-4" style={{ backgroundColor: 'rgba(225, 99, 73, 0.1)', border: '1px solid rgba(225, 99, 73, 0.2)' }}>
                              <p className="text-red-500">Ошибка загрузки информации о вакансии</p>
                            </div>
                          )}
                        </div>

                        {/* Form - more compact */}
                        <form onSubmit={handleSubmit} className="space-y-6 w-full">
                          <div className="space-y-5">
                            <div>
                              <Label className="text-[#0a0d14] mb-2 block text-left">
                                Имя
                              </Label>
                              <div className="bg-white relative rounded-[20px] w-full">
                                <Input
                                  type="text"
                                  value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)}
                                  disabled={isLoading}
                                  autoComplete="given-name"
                                  name="firstName"
                                  className={`w-full border-[#e2e4e9] bg-transparent h-14 px-6 rounded-[20px] text-base ${
                                    errors.firstName ? 'border-red-500' : ''
                                  } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                                  placeholder="Введите ваше имя"
                                />
                              </div>
                              {errors.firstName && (
                                <p className="text-red-500 text-sm mt-1 text-left">{errors.firstName}</p>
                              )}
                            </div>

                            <div>
                              <Label className="text-[#0a0d14] mb-2 block text-left">
                                Фамилия
                              </Label>
                              <div className="bg-white relative rounded-[20px] w-full">
                                <Input
                                  type="text"
                                  value={lastName}
                                  onChange={(e) => setLastName(e.target.value)}
                                  disabled={isLoading}
                                  autoComplete="family-name"
                                  name="lastName"
                                  className={`w-full border-[#e2e4e9] bg-transparent h-14 px-6 rounded-[20px] text-base ${
                                    errors.lastName ? 'border-red-500' : ''
                                  } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                                  placeholder="Введите вашу фамилию"
                                />
                              </div>
                              {errors.lastName && (
                                <p className="text-red-500 text-sm mt-1 text-left">{errors.lastName}</p>
                              )}
                            </div>

                            <div>
                              <Label className="text-[#0a0d14] mb-2 block text-left">
                                Email
                              </Label>
                              <div className="bg-white relative rounded-[20px] w-full">
                                <Input
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  disabled={isLoading}
                                  autoComplete="email"
                                  name="email"
                                  className={`w-full border-[#e2e4e9] bg-transparent h-14 px-6 rounded-[20px] text-base ${
                                    errors.email ? 'border-red-500' : ''
                                  } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                                  placeholder="ваш.email@example.com"
                                />
                              </div>
                              {errors.email && (
                                <p className="text-red-500 text-sm mt-1 text-left">{errors.email}</p>
                              )}
                            </div>
                          </div>

                          {/* Server Error Display */}
                          {serverError && (
                            <div className="flex items-center gap-2 text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">
                              <AlertCircle className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm">{serverError}</span>
                            </div>
                          )}

                          <div className="pt-1">
                            <Button
                              type="submit"
                              disabled={isLoading}
                              className={`bg-[#e16349] hover:bg-[#d55a42] text-white rounded-3xl px-8 py-4 w-full h-16 text-lg font-medium shadow-md transition-all duration-200 ${
                                isLoading 
                                  ? 'opacity-70 cursor-not-allowed' 
                                  : 'hover:shadow-lg transform hover:-translate-y-0.5'
                              }`}
                            >
                              {isLoading ? (
                                <div className="flex items-center justify-center gap-3">
                                  <Loader2 className="w-6 h-6 animate-spin" />
                                  <span>Отправляем данные...</span>
                                </div>
                              ) : (
                                'Продолжить'
                              )}
                            </Button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Note - more compact */}
                  <div className="text-center">
                    <p className="text-gray-600 text-sm">
                      Ваши данные будут использованы только для проведения интервью и обратной связи
                    </p>
                  </div>
                </div>
              </div>
            </div>
      </div>

      <HelpModal 
        isOpen={isHelpModalOpen} 
        onClose={() => setIsHelpModalOpen(false)} 
      />
    </div>
  );
}
