import { useState } from 'react';
import { Button } from './ui/button';

export function CompanyInfo({ onStartInterview }: { onStartInterview?: () => void }) {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  const companyQuestions = [
    { id: 'who', text: 'Кто мы?', answer: 'Мы - динамично развивающаяся IT-компания, специализирующаяся на разработке современных технологических решений.' },
    { id: 'what', text: 'Чем мы занимаемся?', answer: 'Мы создаем инновационные продукты и сервисы, которые помогают бизнесу решать сложные задачи.' },
    { id: 'special', text: 'Что делает нас особенными?', answer: 'Наш подход к работе основан на глубоком понимании потребностей клиентов и использовании передовых технологий.' },
    { id: 'why-cool', text: 'Почему у нас круто работать?', answer: 'Мы предлагаем интересные проекты, профессиональный рост, дружную команду и конкурентную заработную плату.' },
    { id: 'values', text: 'Наши ценности', answer: 'Открытость, профессионализм, взаимопомощь и стремление к совершенству - основа нашей корпоративной культуры.' },
    { id: 'one-window', text: 'Для сотрудников у нас разработан принцип ОДНОГО ОКНА', answer: 'Все вопросы можно решить через единую точку контакта - это экономит время и упрощает процессы.' },
    { id: 'custom', text: 'Моего вопроса нет в списке', answer: 'Вы можете задать любой интересующий вас вопрос, и мы обязательно на него ответим.' }
  ];

  const handleQuestionClick = (question: typeof companyQuestions[0]) => {
    setSelectedQuestion(selectedQuestion === question.id ? null : question.id);
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-foreground mb-2">Часто задаваемые вопросы</h3>
        <p className="text-muted-foreground">Выберите интересующий вас вопрос или задайте свой</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {companyQuestions.map((question) => (
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

      <div className="flex justify-center pt-6">
                 <Button 
           size="lg"
           className="px-10 rounded-[12px] bg-[var(--interview-accent)] hover:bg-[var(--interview-accent-hover)] text-white font-medium shadow-md transition-all duration-200 hover:shadow-lg"
           onClick={onStartInterview}
         >
          У меня нет вопросов
        </Button>
      </div>
    </div>
  );
}
