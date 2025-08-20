import { useState } from 'react';
import { Button } from './ui/button';
import { CheckCircle, MessageSquare } from 'lucide-react';

export function InterviewComplete({ onFinish }: { onFinish?: () => void }) {
  const [showFAQ, setShowFAQ] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  const faqQuestions = [
    { id: 'timeline', text: 'Когда будет известен результат?', answer: 'Мы свяжемся с вами в течение 3-5 рабочих дней после интервью.' },
    { id: 'next-steps', text: 'Какие следующие этапы?', answer: 'Если ваши ответы нас заинтересуют, мы пригласим вас на техническое интервью с командой.' },
    { id: 'feedback', text: 'Могу ли я получить обратную связь?', answer: 'Да, мы обязательно предоставим обратную связь по результатам интервью.' },
    { id: 'contact', text: 'Как с вами связаться?', answer: 'Вы можете написать нам на hr@company.com или позвонить по номеру +7 (000) 000-00-00.' },
    { id: 'preparation', text: 'Как подготовиться к следующему этапу?', answer: 'Рекомендуем изучить наши проекты на сайте и подготовить примеры своего кода.' }
  ];

  const handleQuestionClick = (question: typeof faqQuestions[0]) => {
    setSelectedQuestion(selectedQuestion === question.id ? null : question.id);
  };

  return (
    <div className="text-center space-y-6">
      {!showFAQ ? (
        <>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h2 className="text-foreground mb-4">Интервью завершено!</h2>
            <p className="text-muted-foreground mb-6">
              Спасибо за ваше время и интересные ответы. Мы обязательно изучим их и свяжемся с вами.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline"
                onClick={() => setShowFAQ(true)}
                className="rounded-[12px] border-[#e16349] text-[#e16349] hover:bg-[#e16349] hover:text-white"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Часто задаваемые вопросы
              </Button>
              <Button 
                onClick={onFinish}
                className="bg-[#e16349] hover:bg-[#d55a42] rounded-[12px]"
              >
                Завершить сессию
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-16 h-16 bg-[#e16349] rounded-full flex items-center justify-center mx-auto">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <div className="text-center mb-6">
            <h3 className="text-foreground mb-2">Часто задаваемые вопросы</h3>
            <p className="text-muted-foreground">Ответы на популярные вопросы кандидатов</p>
          </div>
          
          <div className="space-y-4 text-left">
            {faqQuestions.map((question) => (
              <div key={question.id} className="space-y-3">
                <Button
                  variant={selectedQuestion === question.id ? "default" : "outline"}
                  className={`w-full text-left justify-start h-auto p-4 whitespace-normal transition-all hover:shadow-sm rounded-[12px] ${
                    selectedQuestion === question.id 
                      ? 'bg-[#e16349] hover:bg-[#d55a42] text-white' 
                      : 'bg-white border-muted hover:border-[#e16349]'
                  }`}
                  onClick={() => handleQuestionClick(question)}
                >
                  {question.text}
                </Button>
                
                {selectedQuestion === question.id && (
                  <div className="p-4 bg-secondary rounded-[12px]">
                    <p className="text-foreground leading-relaxed">{question.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-6 gap-3">
            <Button 
              variant="outline"
              onClick={() => setShowFAQ(false)}
              className="rounded-[12px]"
            >
              Назад
            </Button>
            <Button 
              onClick={onFinish}
              className="bg-[#e16349] hover:bg-[#d55a42] rounded-[12px]"
            >
              Завершить сессию
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
