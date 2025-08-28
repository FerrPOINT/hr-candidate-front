import { ChatMessage, QuestionCard, ProcessQuestion } from './types';

export const getCurrentTime = (): string => {
  return new Date().toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Счетчик для уникальности ID сообщений
let messageCounter = 0;

export const createMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage => {
  messageCounter++;
  return {
    ...message,
    id: `${Date.now()}-${messageCounter}`,
    timestamp: getCurrentTime()
  };
};

// Функция для сброса счетчика при необходимости
export const resetMessageCounter = () => {
  messageCounter = 0;
};

export const createQuestionCard = (questionIndex: number, questions: ProcessQuestion[], timeLimitSec: number = 150): QuestionCard => {
  return {
    id: `question-card-${questionIndex}`,
    questionIndex,
    text: questions[questionIndex]?.text || `Вопрос ${questionIndex + 1}`,
    status: 'active',
    timeRemaining: timeLimitSec,
    isNew: true
  };
};

export const markQuestionAsCompleted = (questionCards: QuestionCard[], questionIndex: number): QuestionCard[] => {
  return questionCards.map(card =>
    card.questionIndex === questionIndex ? { ...card, status: 'completed' } : card
  );
};

export const updateQuestionTime = (questionCards: QuestionCard[], timeRemaining: number): QuestionCard[] => {
  return questionCards.map(card => 
    card.status === 'active' ? { ...card, timeRemaining: timeRemaining } : card
  );
};