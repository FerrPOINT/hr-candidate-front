import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/';
import { WMTLogo } from '../components/';
import { CheckCircle } from 'lucide-react';

const CandidateComplete: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate('/candidate/login');
  };

  return (
    <div className="bg-[#e9eae2] min-h-screen w-full">
      <div className="w-full h-full flex flex-col">
        <div className="flex flex-col gap-4 p-6 w-full h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between w-full">
            <WMTLogo size="medium" />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="bg-[#f5f6f1] rounded-[44px] w-full max-w-2xl">
              <div className="w-full h-full">
                <div className="flex flex-col gap-6 p-8 w-full">
                  
                  {/* Success Card */}
                  <div className="bg-white rounded-[32px] p-8 text-center">
                    <div className="mb-8">
                      <div className="w-24 h-24 bg-[#28a745] rounded-full mx-auto mb-6 flex items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-white" />
                      </div>
                      <h1 className="text-[28px] font-bold text-[#0a0d14] mb-4">
                        Интервью завершено!
                      </h1>
                      <p className="text-[16px] text-[#525866] leading-[24px]">
                        Спасибо за участие в голосовом интервью. 
                        Ваши ответы будут обработаны и отправлены рекрутеру.
                      </p>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-[#e9eae2] rounded-[20px] p-6 mb-8">
                      <h2 className="text-[18px] font-semibold text-[#0a0d14] mb-4">
                        Что дальше?
                      </h2>
                      <ul className="text-left space-y-3">
                        <li className="flex items-start">
                          <span className="text-[#28a745] mr-3 mt-1">✓</span>
                          <span className="text-[14px] text-[#525866]">
                            Ваши ответы анализируются AI
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#28a745] mr-3 mt-1">✓</span>
                          <span className="text-[14px] text-[#525866]">
                            Рекрутер получит подробный отчет
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#28a745] mr-3 mt-1">✓</span>
                          <span className="text-[14px] text-[#525866]">
                            С вами свяжутся в ближайшее время
                          </span>
                        </li>
                      </ul>
                    </div>

                    <Button
                      onClick={handleBackToLogin}
                      className="w-full bg-[#e16349] hover:bg-[#d14a31] text-white py-4 px-8 rounded-3xl text-[16px] font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#e16349] focus:ring-offset-2"
                    >
                      Начать новое интервью
                    </Button>
                  </div>

                  {/* Info Panel */}
                  <div className="bg-white rounded-[32px] p-4">
                    <p className="text-[12px] text-[#525866] text-center">
                      <strong>Демонстрационный режим:</strong> Это заглушка для тестирования. 
                      В реальном приложении здесь будет интеграция с API.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateComplete;
