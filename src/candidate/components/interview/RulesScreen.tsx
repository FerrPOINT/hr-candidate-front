import { Button } from '../';
import { Logo } from '../';
import { HelpButton, HelpModal } from '../';
import { JobPosition } from './types';
import { Clock, Mic, MessageSquare } from 'lucide-react';

interface RulesScreenProps {
  jobPosition: JobPosition;
  onContinue: () => void;
  isHelpModalOpen: boolean;
  onToggleHelpModal: (open: boolean) => void;
}

export function RulesScreen({ 
  jobPosition, 
  onContinue, 
  isHelpModalOpen, 
  onToggleHelpModal 
}: RulesScreenProps) {
  return (
    <>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center px-4 mt-8">
            <div className="bg-[#f5f6f1] rounded-[44px] w-full max-w-3xl">
              <div className="w-full h-full">
                <div className="flex flex-col gap-6 p-6 w-full">
                  
                  <div className="bg-white rounded-[32px] w-full">
                    <div className="w-full h-full">
                      <div className="flex flex-col gap-5 p-6 w-full text-center">
                        
                        <div className="bg-[#e16349]/10 border border-[#e16349]/20 rounded-[20px] p-5 w-full">
                          <h4 className="text-[#e16349] mb-2">
                            {jobPosition.title}
                          </h4>
                          <p className="text-gray-600">
                            {jobPosition.company} • {jobPosition.questionsCount} вопросов
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-600 mb-4">
                            Перед началом интервью ознакомьтесь с краткой информацией о процессе
                          </p>
                        </div>

                        {/* Rules Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                          <div className="bg-gray-50 rounded-[20px] p-4 text-center">
                            <div className="w-12 h-12 bg-[#e16349]/10 border border-[#e16349]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Clock className="w-6 h-6 text-[#e16349]" />
                            </div>
                            <p className="text-gray-600 text-sm mb-1">
                              Продолжительность
                            </p>
                            <div className="text-lg font-medium text-[#000000]">
                              15-20 минут
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-[20px] p-4 text-center">
                            <div className="w-12 h-12 bg-[#e16349]/10 border border-[#e16349]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Mic className="w-6 h-6 text-[#e16349]" />
                            </div>
                            <p className="text-gray-600 text-sm mb-1">
                              Формат
                            </p>
                            <div className="text-lg font-medium text-[#000000]">
                              Голосовые ответы
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-[20px] p-4 text-center">
                            <div className="w-12 h-12 bg-[#e16349]/10 border border-[#e16349]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                              <MessageSquare className="w-6 h-6 text-[#e16349]" />
                            </div>
                            <p className="text-gray-600 text-sm mb-1">
                              Количество
                            </p>
                            <div className="text-lg font-medium text-[#000000]">
                              {jobPosition.questionsCount} вопросов
                            </div>
                          </div>
                        </div>

                        {/* Tips */}
                        <div className="bg-[#e16349]/5 border border-[#e16349]/20 rounded-[20px] p-4 w-full">
                          <div className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-[#e16349]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-[#e16349] rounded-full"></div>
                            </div>
                            <div className="text-left">
                              <p className="text-[#e16349] text-sm">
                                <span className="font-medium">Совет:</span> Используйте наушники или внешний микрофон для лучшего качества записи
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Start Button */}
                        <div className="pt-3 w-full">
                          <Button
                            onClick={onContinue}
                            className="bg-[#e16349] hover:bg-[#d55a42] text-white rounded-3xl px-8 py-4 w-full h-16 text-lg font-medium shadow-md transition-all"
                          >
                            Проверить микрофон
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      </div>

      <HelpModal 
        isOpen={isHelpModalOpen} 
        onClose={() => onToggleHelpModal(false)} 
      />
    </>
  );
}
