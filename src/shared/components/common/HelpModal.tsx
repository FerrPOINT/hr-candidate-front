import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden relative shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900">Помощь</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Как работает интервью?</h4>
                <p className="text-gray-600 text-sm">
                  Наш ИИ-ассистент проведет с вами дружескую беседу. Отвечайте на вопросы естественно, 
                  приводите примеры из опыта. У вас будет 2 минуты 30 секунд на каждый ответ.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Технические требования</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Работающий микрофон</li>
                  <li>• Стабильное интернет-соединение</li>
                  <li>• Современный браузер (Chrome, Firefox, Safari)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Что делать если возникли проблемы?</h4>
                <p className="text-gray-600 text-sm">
                  Если у вас возникли технические проблемы, попробуйте обновить страницу или 
                  обратитесь в службу поддержки.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-100">
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors"
            >
              Понятно
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
