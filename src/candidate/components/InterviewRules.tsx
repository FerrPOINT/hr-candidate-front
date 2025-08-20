import { Button } from './ui/button';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Bot, Clock, Mic, Headphones, CheckCircle, Users, MessageSquare } from 'lucide-react';
import svgPaths from "../imports/svg-2hi4ux9070";

interface JobPosition {
  title: string;
  department: string;
  company: string;
  type: string;
}

interface InterviewRulesProps {
  onStart: () => void;
  jobPosition: JobPosition;
}

export function InterviewRules({ onStart, jobPosition }: InterviewRulesProps) {
  const rules = [
    {
      icon: Clock,
      title: "Продолжительность",
      description: "Интервью займет примерно 15-20 минут. Постарайтесь выделить достаточно времени.",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: Mic,
      title: "Качество записи",
      description: "Используйте внешний микрофон или гарнитуру для лучшего качества. Найдите тихое место.",
      color: "bg-green-50 border-green-200"
    },
    {
      icon: MessageSquare,
      title: "Формат ответов",
      description: "Отвечайте развернуто и конкретно. Приводите примеры из своего опыта.",
      color: "bg-purple-50 border-purple-200"
    },
    {
      icon: CheckCircle,
      title: "Подготовка",
      description: "Подготовьте примеры проектов, над которыми работали, и результаты своей работы.",
      color: "bg-orange-50 border-orange-200"
    },
    {
      icon: Users,
      title: "Естественность",
      description: "Будьте собой. Мы оцениваем не только навыки, но и то, как вы впишетесь в команду.",
      color: "bg-pink-50 border-pink-200"
    },
    {
      icon: Headphones,
      title: "Технические требования",
      description: "Убедитесь в стабильном интернет-соединении. Не закрывайте и не обновляйте страницу.",
      color: "bg-red-50 border-red-200"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Orange to white gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#e16349]/20 via-[#fef9f6] via-[#fff8f3] to-white" />
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(225,99,73,0.08) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(225,99,73,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px, 80px 80px'
        }} />
      </div>

      {/* Compact Header */}
      <div className="absolute top-0 left-0 right-0 backdrop-blur-[15px] backdrop-filter bg-white/40 border-b border-[#e16349]/10 p-4 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#e16349] to-[#d55a42] rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5"
                fill="white"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 15 15"
              >
                <path d={svgPaths.p19285b00} />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-[#000000] text-sm font-medium leading-tight">
                Подготовка к интервью
              </h1>
              <p className="text-gray-600 text-xs leading-tight">
                {jobPosition.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 pb-32 min-h-screen relative z-0 px-4">
        <div className="max-w-4xl mx-auto py-8">
          {/* Welcome message */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Avatar className="w-16 h-16 border-3 border-[#e16349]/30">
                <AvatarFallback className="bg-[#e16349] text-white">
                  <Bot className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
            </div>
            
            <h2 className="text-gray-900 mb-4">
              Добро пожаловать на AI-интервью!
            </h2>
            
            <div className="bg-[#e16349]/10 border border-[#e16349]/20 rounded-[20px] p-4 mb-6 max-w-md mx-auto">
              <h3 className="text-[#e16349] font-medium mb-1">
                {jobPosition.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {jobPosition.department} • {jobPosition.company}
              </p>
            </div>
            
            <p className="text-gray-600 max-w-2xl mx-auto">
              Перед началом ознакомьтесь с правилами и рекомендациями для успешного прохождения интервью.
            </p>
          </div>

          {/* Rules cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {rules.map((rule, index) => (
              <Card key={index} className={`${rule.color} p-6 border-2 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] rounded-[24px]`}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <rule.icon className="w-6 h-6 text-[#e16349]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#000000] mb-2">
                      {rule.title}
                    </h3>
                    <p className="text-gray-600">
                      {rule.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Important note */}
          <div className="bg-gradient-to-r from-[#e16349]/10 to-[#d55a42]/10 border-2 border-[#e16349]/20 rounded-[32px] p-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#e16349]/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#e16349]" />
              </div>
              <div>
                <h3 className="text-[#e16349] mb-2">
                  Важно помнить
                </h3>
                <p className="text-gray-700">
                  Во время интервью нельзя перезагружать страницу или закрывать браузер. 
                  Ваши ответы сохраняются автоматически, но прерывание может привести к потере прогресса.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom button */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/95 to-white/80 backdrop-blur-[20px] backdrop-filter border-t border-gray-200/40 p-8 z-10 rounded-t-[32px]">
        <div className="max-w-4xl mx-auto flex justify-center">
          <Button
            onClick={onStart}
            className="bg-[#2B1F5C] hover:bg-[#1F1745] text-white rounded-[44px] px-20 py-6 font-medium text-base min-w-[320px] h-20 shadow-xl transition-all duration-200 hover:shadow-2xl hover:scale-105 border-0"
          >
            <Bot className="w-6 h-6 mr-3" />
            Начать интервью
          </Button>
        </div>
      </div>
    </div>
  );
}
