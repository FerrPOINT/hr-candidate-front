import { useState, useEffect } from 'react';
import { Button } from './';
import { Input } from './ui/input';
import { WMTLogo } from './';
import { HelpButton, HelpModal } from './';
import { Mail, CheckCircle2, RefreshCw, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

interface JobPosition {
  title: string;
  department: string;
  company: string;
  type: string;
  questionsCount: number;
}

interface EmailVerificationProps {
  email: string;
  onContinue: () => void;
  onGoBack: () => void;
  jobPosition: JobPosition;
}



export function EmailVerification({ email, onContinue, onGoBack, jobPosition }: EmailVerificationProps) {
  const [code, setCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState('');
  const [sentCode] = useState('123456'); // Simulate sent code
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsResending(false);
    setCountdown(60);
  };

  const handleVerifyCode = async () => {
    setError('');
    
    if (!code.trim()) {
      setError('Введите код подтверждения');
      return;
    }

    if (code.length !== 6) {
      setError('Код должен содержать 6 цифр');
      return;
    }

    setIsVerifying(true);
    
    // Simulate API call for verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate code verification
    if (code === sentCode) {
      // Убираем промежуточное состояние и сразу переходим к следующему этапу
      onContinue();
    } else {
      setIsVerifying(false);
      setError('Неверный код. Проверьте код в письме и попробуйте снова');
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && code.length === 6 && !isVerifying) {
      handleVerifyCode();
    }
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

          {/* Main Content - Compact version */}
          <div className="flex-1 flex items-center justify-center px-4 mt-8">
            <div className="bg-[#f5f6f1] rounded-[44px] w-full max-w-2xl">
              <div className="w-full h-full">
                <div className="flex flex-col gap-6 p-6 w-full">
                  
                  {/* Back Button - at the top */}
                  <div className="flex justify-start">
                    <Button
                      onClick={onGoBack}
                      disabled={isVerifying}
                      variant="ghost"
                      className={`flex items-center gap-2 text-gray-600 hover:text-white hover:bg-[#e16349] transition-all duration-200 px-4 py-2 h-10 rounded-2xl ${
                        isVerifying ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Назад
                    </Button>
                  </div>
                  
                  {/* Main Card - more compact */}
                  <div className="bg-white rounded-[32px] w-full">
                    <div className="w-full h-full">
                      <div className="flex flex-col gap-6 p-6 w-full">
                        
                        {/* Job Position Info - centered and more compact */}
                        <div className="bg-[#e16349]/10 border border-[#e16349]/20 rounded-[20px] p-5 w-full">
                          <div className="text-center">
                            <h4 className="text-[#e16349] mb-2">
                              {jobPosition.title}
                            </h4>
                            <p className="text-gray-600">
                              {jobPosition.company} • {jobPosition.questionsCount} вопросов
                            </p>
                          </div>
                        </div>

                        {/* Email info - centered and more compact */}
                        <div className="text-center">
                          <p className="text-gray-600 mb-3">
                            Мы отправили 6-значный код подтверждения на:
                          </p>
                          <p className="text-[#e16349] font-medium text-lg">
                            {email}
                          </p>
                        </div>

                        {/* Code Input - more compact */}
                        <div className="w-full">
                          <div className="bg-white relative rounded-[20px] w-full mb-3">
                            <Input
                              type="text"
                              value={code}
                              onChange={handleCodeChange}
                              onKeyPress={handleKeyPress}
                              disabled={isVerifying}
                              className={`w-full border-[#e2e4e9] bg-transparent h-16 px-6 rounded-[20px] text-lg text-center font-mono tracking-wide ${
                                error ? 'border-red-500' : code.length === 6 ? 'border-green-500' : ''
                              } ${isVerifying ? 'opacity-60 cursor-not-allowed' : ''}`}
                              placeholder="123456"
                              maxLength={6}
                            />
                          </div>
                          {error && (
                            <div className="flex items-center gap-2 justify-center text-red-500 mb-3">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-sm">{error}</span>
                            </div>
                          )}
                          <p className="text-gray-500 text-sm text-center">
                            Введите 6-значный код из письма. Код действителен 10 минут.
                          </p>
                        </div>

                        {/* Action Buttons - more compact */}
                        <div className="space-y-5 w-full">
                          <Button
                            onClick={handleVerifyCode}
                            disabled={code.length !== 6 || isVerifying}
                            className={`rounded-3xl px-8 py-4 w-full h-16 text-lg font-medium shadow-md transition-all duration-200 ${
                              code.length === 6 && !isVerifying
                                ? 'bg-[#e16349] hover:bg-[#d55a42] text-white hover:shadow-lg transform hover:-translate-y-0.5' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {isVerifying ? (
                              <div className="flex items-center justify-center gap-3">
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span>Проверяем код...</span>
                              </div>
                            ) : (
                              'Подтвердить код'
                            )}
                          </Button>

                          <div className="flex items-center justify-center">
                            <Button
                              onClick={handleResendCode}
                              disabled={isResending || countdown > 0 || isVerifying}
                              variant="ghost"
                              className={`text-gray-600 hover:text-white hover:bg-[#e16349] transition-all duration-200 px-4 py-2 h-10 rounded-2xl ${
                                (isResending || countdown > 0 || isVerifying) ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              {isResending ? (
                                <>
                                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                  Отправляем код...
                                </>
                              ) : countdown > 0 ? (
                                `Отправить повторно через ${countdown}с`
                              ) : (
                                'Отправить код повторно'
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Help Text - more compact */}
                  <div className="text-center">
                    <p className="text-gray-600 text-sm">
                      Не получили код? Проверьте папку "Спам" или "Промоакции"
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
