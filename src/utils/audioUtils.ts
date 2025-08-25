/**
 * Формирует полный URL для аудио файла
 * @param audioUrl - относительный путь к аудио файлу (например, "/media/getvoice")
 * @returns полный URL для воспроизведения
 */
export const getFullAudioUrl = (audioUrl: string): string => {
  if (!audioUrl) {
    return '';
  }
  
  // Если URL уже полный (начинается с http), возвращаем как есть
  if (audioUrl.startsWith('http://') || audioUrl.startsWith('https://')) {
    return audioUrl;
  }
  
  // Получаем базовый URL из переменных окружения
  const baseUrl = process.env.REACT_APP_API_BASE_URL || '';
  
  // Убираем лишние слеши
  const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
  const cleanAudioUrl = audioUrl.replace(/^\/+/, '');
  
  // Формируем полный URL
  return `${cleanBaseUrl}/${cleanAudioUrl}`;
};

/**
 * Проверяет, является ли URL относительным
 * @param url - URL для проверки
 * @returns true, если URL относительный
 */
export const isRelativeUrl = (url: string): boolean => {
  return !url.startsWith('http://') && !url.startsWith('https://');
};

/**
 * Логирует информацию об аудио URL для отладки
 * @param originalUrl - оригинальный URL из API
 * @param fullUrl - полный URL для воспроизведения
 * @param context - контекст для логирования
 */
export const logAudioUrl = (originalUrl: string, fullUrl: string, context: string) => {
  console.log(`🎵 Audio URL Debug [${context}]:`, {
    original: originalUrl,
    full: fullUrl,
    baseUrl: process.env.REACT_APP_API_BASE_URL,
    isRelative: isRelativeUrl(originalUrl)
  });
};
