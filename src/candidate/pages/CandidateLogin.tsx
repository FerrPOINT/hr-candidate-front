import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  
  const [firstName, setFirstName] = useState('Тест');
  const [lastName, setLastName] = useState('Кандидат');
  const [email, setEmail] = useState('test@example.com');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Моковые данные о вакансии (в реальном приложении будут загружаться с API)
  const jobPosition: JobPosition = {
    title: "Frontend Developer",
    department: "Разработка",
    company: "WMT AI",
    type: "Полная занятость",
    questionsCount: 6
  };

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Пожалуйста, введите email');
      return;
    }

    setIsLoading(true);
    setError('');

    console.log('Submitting login form:', { email });

    // Для тестирования - всегда получаем успешный ответ от API
    const response = await candidateAuthService.authenticate({
      firstName: 'Тест',
      lastName: 'Кандидат',
      email: email.trim()
    });

    if (response.success) {
      console.log('Authentication successful:', response);
      const interviewId = '1'; // Временно хардкод, нужно сделать динамическим
      navigate(`/candidate/verify-email?email=${encodeURIComponent(email)}&interviewId=${interviewId}`);
    } else {
      console.error('Authentication failed:', response.error);
      setError(response.error || 'Ошибка авторизации');
    }
    
    setIsLoading(false);
    
    // Оригинальная логика (закомментирована для тестирования):
    /*
    try {
      console.log('Submitting login form:', { email });

      const response = await candidateAuthService.authenticate({
        firstName: 'Тест',
        lastName: 'Кандидат',
        email: email.trim()
      });

      if (response.success) {
        console.log('Authentication successful:', response);
        const interviewId = '1'; // Временно хардкод, нужно сделать динамическим
        navigate(`/candidate/verify-email?email=${encodeURIComponent(email)}&interviewId=${interviewId}`);
      } else {
        console.error('Authentication failed:', response.error);
        setError(response.error || 'Ошибка авторизации');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Произошла ошибка при авторизации';
      if (errorMessage.includes('не назначено собеседование') ||
          errorMessage.toLowerCase().includes('found user false') ||
          errorMessage.toLowerCase().includes('candidate not found') ||
          error.response?.status === 404) {
        setError('Извините, для вас не назначено собеседование. Пожалуйста, обратитесь к рекрутеру.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
    */
  };

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

                {/* Title */}
                <h1 className="text-[28px] font-bold text-[#001a2c] text-center mb-2">
                  Добро пожаловать
                </h1>

                {/* Description */}
                <p className="text-[#868c98] text-center mb-8">
                  Заполните форму ниже, чтобы начать интервью
                </p>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

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
                        errors.firstName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      disabled={isLoading}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
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
                        errors.lastName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      disabled={isLoading}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
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
                        errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
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
