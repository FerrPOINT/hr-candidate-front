import { useState, useEffect } from 'react';
import { Button } from './';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { WMTLogo, HelpButton, HelpModal } from './';
import { Loader2 } from 'lucide-react';
import { candidateAuthService } from '../services/candidateAuthService';

interface JobPosition {
  title: string;
  department: string;
  company: string;
  type: string;
  questionsCount: number;
}

interface AuthFormProps {
  onContinue: (userData: { firstName: string; lastName: string; email: string }) => void;
  interviewId: number; // Теперь принимаем interviewId вместо готовой jobPosition
}

export function AuthForm({ onContinue, interviewId }: AuthFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jobPosition, setJobPosition] = useState<JobPosition | null>(null);
  const [isLoadingPosition, setIsLoadingPosition] = useState(true);

  // Загружаем информацию о вакансии при монтировании компонента
  useEffect(() => {
    const loadPositionInfo = async () => {
      try {
        setIsLoadingPosition(true);
        // Получаем краткую информацию о вакансии через новый API
        const positionSummary = await candidateAuthService.getPositionSummary(interviewId);
        
        // Используем полную информацию из API
        setJobPosition({
          title: positionSummary.title,
          department: positionSummary.department,
          company: positionSummary.company,
          type: positionSummary.type,
          questionsCount: positionSummary.questionsCount
        });
      } catch (error) {
        console.error('Error loading position info:', error);
        // В случае ошибки используем заглушку
        setJobPosition({
          title: 'Software Engineer',
          department: 'Engineering',
          company: 'WMT group',
          type: 'Full-time',
          questionsCount: 3
        });
      } finally {
        setIsLoadingPosition(false);
      }
    };

    if (interviewId) {
      loadPositionInfo();
    }
  }, [interviewId]);

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
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      // Имитируем API запрос
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
      onContinue({ firstName, lastName, email });
    }
  };

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--interview-bg)' }}>
      <div className="w-full h-full flex flex-col">
        <div className="flex flex-col gap-4 p-6 w-full h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between w-full">
            <WMTLogo size="medium" />
            <HelpButton onClick={() => setIsHelpModalOpen(true)} />
          </div>

          {/* Main Content - Compact version */}
          <div className="flex-1 flex items-center justify-center px-4 mt-8">
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
        </div>
      </div>

      <HelpModal 
        isOpen={isHelpModalOpen} 
        onClose={() => setIsHelpModalOpen(false)} 
      />
    </div>
  );
}
