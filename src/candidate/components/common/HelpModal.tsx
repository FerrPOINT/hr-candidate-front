import { X, Smartphone, Wifi, Shield, Chrome } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  const helpCards = [
    {
      number: "1",
      title: "Запустите на другом устройстве",
      icon: Smartphone
    },
    {
      number: "2", 
      title: "Проверьте интернет-соединение",
      icon: Wifi
    },
    {
      number: "3",
      title: "Отключите VPN и блокировщики",
      icon: Shield
    },
    {
      number: "4",
      title: "Используйте браузер Chrome",
      icon: Chrome
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] w-full max-w-3xl shadow-2xl animate-fade-in">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs text-gray-500">
              Если возникли технические проблемы во время собеседования:
            </p>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Help Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {helpCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <div 
                  key={card.number}
                  className="bg-white border border-gray-100 rounded-[18px] p-5 flex items-center gap-4 hover:border-gray-200 transition-all duration-300 group cursor-pointer"
                  style={{ boxShadow: 'var(--elevation-sm)' }}
                >
                  {/* Icon */}
                  <div className="w-10 h-10 bg-[#e16349]/10 border border-[#e16349]/20 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#e16349]/15 transition-colors duration-300">
                    <IconComponent className="w-5 h-5 text-[#e16349]" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <p className="text-[#0a0d14] font-semibold leading-tight">
                      {card.title}
                    </p>
                  </div>

                  {/* Number badge */}
                  <div className="w-6 h-6 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center text-xs font-medium group-hover:bg-gray-200 transition-all duration-300">
                    {card.number}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 