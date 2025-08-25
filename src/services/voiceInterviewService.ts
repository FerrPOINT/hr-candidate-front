/**
 * Voice Interview Service
 * Сервис для работы с голосовыми интервью через backend API
 *
 * Sequence diagram (Mermaid):
 *
 * ```mermaid
 * sequenceDiagram
 *   participant UI as Frontend UI
 *   participant Service as VoiceInterviewService
 *   participant API as Backend API
 *   participant ElevenLabs as ElevenLabs API
 *
 *   UI->>Service: startInterview(interviewId, options)
 *   Service->>API: POST /interviews/{id}/start (InterviewStartRequest)
 *   API->>ElevenLabs: Create agent, voice session
 *   ElevenLabs-->>API: Session info
 *   API-->>Service: InterviewStartResponse
 *   Service-->>UI: InterviewStartResponse
 *
 *   Note over UI,Service: UI получает данные для старта голосового интервью
 * ```
 *
 * Ключевые этапы:
 * - UI вызывает startInterview с нужными опциями
 * - Service формирует InterviewStartRequest и отправляет на backend
 * - Backend создаёт агента и сессию в ElevenLabs
 * - Backend возвращает InterviewStartResponse с параметрами для UI
 */

// Голосовые/интервью API отключены в этом билде (оставлены заглушки типов)
// import type { VoiceSettings } from '../client/models/voice-settings'; // Module not found, using any

/**
 * Опции запуска интервью
 * - voiceMode: включить голосовой режим
 * - autoCreateAgent: создать агента автоматически
 * - includeCandidateData: включить данные кандидата
 * - agentConfig: параметры агента (типизировано)
 * - voiceSettings: параметры голоса (типизировано)
 */
interface StartInterviewOptions {
  voiceMode?: boolean;
  autoCreateAgent?: boolean;
  includeCandidateData?: boolean;
  agentConfig?: any;
  voiceSettings?: any; // VoiceSettings type not available
}

export class VoiceInterviewService {
  /**
   * Запуск интервью с голосовым режимом
   * Возвращает все необходимые данные для проведения интервью
   *
   * @param interviewId ID интервью
   * @param options Опции запуска (см. StartInterviewOptions)
   * @returns InterviewStartResponse с параметрами для UI
   */
  static async startInterview(interviewId: number, options: StartInterviewOptions = {}): Promise<any> {
    // Простая проверка вместо конфига
    const elevenLabsEnabled = false; // Временно отключено
    
    if (!elevenLabsEnabled) {
      return {
        signedUrl: '',
        sessionId: '',
        agentId: '',
        webhookUrl: '',
        status: undefined,
        message: 'ElevenLabs disabled',
        candidateData: {},
      } as unknown as any;
    }
    const request: any = {
      autoCreateAgent: options.autoCreateAgent ?? false,
      includeCandidateData: options.includeCandidateData ?? true,
      agentConfig: options.agentConfig,
      voiceSettings: options.voiceSettings
    };

    try {
      console.log('🚀 Starting interview with options:', request);
      throw new Error('Voice/Interviews API недоступны в этом билде');
    } catch (error: any) {
      console.error('❌ Error starting interview:', error);
      throw new Error(error?.response?.data?.message || error?.message || 'Failed to start interview');
    }
  }

  /**
   * Завершение интервью
   * @param interviewId ID интервью
   * @returns Ответ backend (тип зависит от API)
   */
  static async finishInterview(interviewId: number): Promise<any> {
    const elevenLabsEnabled = false; // Временно отключено
    if (!elevenLabsEnabled) return;
    try {
      throw new Error('Voice/Interviews API недоступны в этом билде');
    } catch (error: any) {
      console.error('❌ Error finishing interview:', error);
      throw new Error(error?.response?.data?.message || error?.message || 'Failed to finish interview');
    }
  }
} 