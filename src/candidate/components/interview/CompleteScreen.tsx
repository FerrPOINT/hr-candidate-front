import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { UserData, JobPosition } from './types';
import { Logo } from '../';
import { HelpButton, HelpModal } from '../';

interface CompleteScreenProps {
  userData: UserData | null;
  jobPosition: JobPosition;
}

export function CompleteScreen({ userData, jobPosition }: CompleteScreenProps) {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  return (
    <>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center px-4 mt-8">
            <div className="bg-[#f5f6f1] rounded-[44px] w-full max-w-2xl">
              <div className="w-full h-full">
                <div className="flex flex-col gap-6 p-6 w-full">
                  
                  <div className="bg-white rounded-[32px] w-full">
                    <div className="w-full h-full">
                      <div className="flex flex-col gap-6 p-8 w-full text-center">
                        
                        {/* Success Icon */}
                        <motion.div 
                          className="flex justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        >
                          <div className="w-24 h-24 bg-[#e16349]/10 border-2 border-[#e16349]/20 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-12 h-12 text-[#e16349]" />
                          </div>
                        </motion.div>

                        {/* Main Message */}
                        <motion.div
                          className="space-y-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                        >
                          <h4 className="text-[#0a0d14]">
                            Интервью завершено!
                          </h4>
                          <p className="text-gray-600">
                            Спасибо за ваше время и интересные ответы, {userData?.firstName}.
                          </p>
                          <p className="text-gray-600">
                            Мы свяжемся с вами по поводу позиции <span className="text-[#e16349] font-medium">{jobPosition.title}</span> в ближайшее время.
                          </p>
                        </motion.div>

                        {/* Info Cards */}
                        <motion.div 
                          className="space-y-4 w-full"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7, duration: 0.5 }}
                        >
                          <div className="bg-[#e16349]/10 border border-[#e16349]/20 rounded-[20px] p-5">
                            <div className="flex items-center justify-center gap-3">
                              <span className="text-[#e16349] text-xl">📧</span>
                              <p className="text-gray-700">
                                Результат будет отправлен на <span className="text-[#e16349] font-medium">{userData?.email}</span>
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-[#e16349]/10 border border-[#e16349]/20 rounded-[20px] p-5">
                            <div className="flex items-center justify-center gap-3">
                              <span className="text-[#e16349] text-xl">⏰</span>
                              <p className="text-gray-700">
                                Ответ в течение <span className="text-[#e16349] font-medium">3-5 рабочих дней</span>
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Additional Info */}
                        <motion.div
                          className="bg-[#f5f6f1] rounded-[20px] p-5 border border-[#e2e4e9]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.9, duration: 0.5 }}
                        >
                          <p className="text-gray-600 text-sm">
                            Вы можете закрыть это окно. Мы сохранили все ваши ответы и обязательно их рассмотрим.
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Note */}
                  <div className="text-center">
                    <p className="text-gray-600 text-sm">
                      Удачи в вашем карьерном пути! 🚀
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
    </>
  );
}
