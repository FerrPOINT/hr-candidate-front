import { useState, useEffect } from 'react';
import { Button } from './';
import { Card, CardContent } from './ui/card';
import { Clock, User, Mic, CheckCircle, ArrowRight } from 'lucide-react';

export function WelcomeScreen({ onContinue }: { onContinue: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const welcomeSteps = [
    {
      icon: <User className="w-8 h-8 text-[#e16349]" />,
      title: "Добро пожаловать!",
      description: "Это AI-интервью для позиции Frontend Разработчик"
    },
    {
      icon: <Clock className="w-8 h-8 text-[#e16349]" />,
      title: "Время интервью",
      description: "Интервью займет примерно 15 минут вашего времени"
    },
    {
      icon: <Mic className="w-8 h-8 text-[#e16349]" />,
      title: "Формат ответов",
      description: "Вы будете отвечать голосом, поэтому подготовьте микрофон"
    }
  ];

  useEffect(() => {
    if (currentStep < welcomeSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, welcomeSteps.length]);

  return (
    <div className="text-center space-y-8">
      {/* Анимированные шаги */}
      <div className="space-y-6">
        {welcomeSteps.map((step, index) => (
          <div
            key={index}
            className={`transition-all duration-500 ${
              index <= currentStep 
                ? 'opacity-100 transform translate-y-0' 
                : 'opacity-30 transform translate-y-4'
            }`}
          >
            <Card className={`border-2 transition-all duration-300 ${
              index === currentStep 
                ? 'border-[#e16349] shadow-lg' 
                : index < currentStep 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-muted'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  {index < currentStep ? (
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  ) : (
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      index === currentStep ? 'bg-[#e16349]/10' : 'bg-secondary'
                    }`}>
                      {step.icon}
                    </div>
                  )}
                </div>
                <h3 className="text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Прогресс бар */}
      <div className="flex justify-center">
        <div className="flex gap-2">
          {welcomeSteps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index <= currentStep ? 'bg-[#e16349]' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Кнопка продолжения */}
      {currentStep >= welcomeSteps.length - 1 && (
        <div className="animate-fade-in">
          <Button 
            onClick={onContinue}
            size="lg"
            className="bg-[#e16349] hover:bg-[#d55a42] rounded-[12px] px-8"
          >
            Продолжить
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Дополнительная информация */}
      <div className="mt-8 p-4 bg-secondary/50 rounded-[20px]">
        <p className="text-muted-foreground text-sm">
          💡 Совет: Найдите тихое место и проверьте подключение к интернету
        </p>
      </div>
    </div>
  );
}
