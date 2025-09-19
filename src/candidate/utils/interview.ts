export const formatInterviewTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const getInterviewStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'STARTED': 'В процессе',
    'PAUSED': 'Приостановлено',
    'COMPLETED': 'Завершено',
    'CANCELLED': 'Отменено',
  };
  
  return statusMap[status] || 'Неизвестно';
};

export const calculateProgress = (currentQuestion: number, totalQuestions: number): number => {
  if (totalQuestions === 0) return 0;
  return Math.round((currentQuestion / totalQuestions) * 100);
};