import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { WMTLogo } from '../components/';
import { HelpButton, HelpModal } from '../components/';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { candidateAuthService } from '../services/candidateAuthService';

const CandidateEmailVerification: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [verificationCode, setVerificationCode] = useState('');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const email = searchParams.get('email') || '';
  const interviewId = searchParams.get('interviewId') || '1'; // Получаем ID интервью из URL

  // Обратный отсчет для повторной отправки
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setError('Введите код подтверждения');
      return;
    }

    if (verificationCode.length !== 6) {
      setError('Код должен содержать 6 цифр');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      console.log('Verifying email code:', { email, code: verificationCode });
      const response = await candidateAuthService.verifyEmail(email, verificationCode.trim());
      
      if (response.success) {
        console.log('Email verification successful:', response);
        // Перенаправляем на интервью кандидата после успешной верификации
        navigate(`/candidate/interview/${interviewId}`);
      } else {
        console.error('Email verification failed:', response.error);
        setError(response.error || 'Ошибка верификации');
      }
    } catch (error: any) {
      console.error('Email verification error:', error);
      setError(error.message || 'Ошибка верификации');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    try {
      // TODO: Добавить API для повторной отправки кода
      // Пока что симулируем задержку
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCountdown(60); // 60 секунд до следующей отправки
    } catch (err) {
      console.error('Resend code error:', err);
      setError('Ошибка при отправке кода. Попробуйте позже.');
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
                
                {/* Back Button */}
                <button
                  onClick={handleBackToLogin}
                  className="flex items-center gap-2 text-[#868c98] hover:text-[#e16349] transition-colors mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Назад к входу</span>
                </button>

                {/* Icon */}
                <div className="w-16 h-16 bg-[#e16349] rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h1 className="text-[28px] font-bold text-[#001a2c] text-center mb-2">
                  Подтвердите email
                </h1>

                {/* Description */}
                <p className="text-[#868c98] text-center mb-8">
                  Мы отправили код подтверждения на <br />
                  <span className="font-medium text-[#001a2c]">{email}</span>
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
                    <Label htmlFor="verificationCode" className="text-[#001a2c] font-medium mb-2 block">
                      Код подтверждения
                    </Label>
                    <Input
                      id="verificationCode"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Введите код из письма"
                      className="w-full h-12 px-4 border-[#e2e4e9] rounded-xl bg-white focus:border-[#e16349] focus:ring-[#e16349]"
                      maxLength={6}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading || !verificationCode.trim()}
                    className="w-full h-12 bg-[#e16349] hover:bg-[#d14a31] disabled:bg-[#f0f1ea] text-white disabled:text-[#868c98] rounded-xl font-medium transition-all duration-200"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Подтверждение...
                      </>
                    ) : (
                      'Подтвердить'
                    )}
                  </Button>
                </form>

                {/* Resend Code */}
                <div className="mt-6 text-center">
                  <p className="text-[#868c98] text-sm mb-2">
                    Не получили код?
                  </p>
                  <button
                    onClick={handleResendCode}
                    disabled={countdown > 0 || isLoading}
                    className="text-[#e16349] hover:text-[#d14a31] disabled:text-[#868c98] font-medium transition-colors"
                  >
                    {countdown > 0 
                      ? `Отправить повторно через ${formatTime(countdown)}`
                      : 'Отправить повторно'
                    }
                  </button>
                </div>

                {/* Help Text */}
                <div className="mt-8 p-4 bg-[#f8f9f4] rounded-xl">
                  <p className="text-[#868c98] text-sm text-center">
                    Проверьте папку "Спам" или "Промо" в вашей почте. 
                    Код может прийти с небольшой задержкой.
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

export default CandidateEmailVerification;
