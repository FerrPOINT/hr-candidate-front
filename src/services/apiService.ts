import { type ApiClient } from '../api/apiClient';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import {
  mapCandidateStatusEnum,
  mapPositionStatusEnum,
  mapInterviewStatusEnum,
  mapInterviewResultEnum,
  mapRoleEnum,
  mapQuestionTypeEnum
} from '../utils/enumMapper';
import {
  Position,
  PositionCreateRequest,
  PositionUpdateRequest,
  Candidate,
  CandidateCreateRequest,
  CandidateUpdateRequest,
  Interview,
  Question,
  QuestionCreateRequest,
  User,
  Branding,
  BrandingUpdateRequest,

  LoginRequest,
  AuthResponse,
  PositionStatusEnum,
  InterviewStatusEnum,
  InterviewResultEnum,
  TranscribeAudio200Response,
  TranscribeAnswerWithAI200Response,
  BaseQuestionFields,
  PositionDataGenerationRequest,
  PositionDataGenerationResponse,
} from '../api/models';
import { Configuration } from '../../generated-src/client/configuration';
import { AuthApi } from '../../generated-src/client/apis/auth-api';
import { AccountApi } from '../../generated-src/client/apis/account-api';
import { CandidatesApi } from '../../generated-src/client/apis/candidates-api';
import { InterviewsApi } from '../../generated-src/client/apis/interviews-api';
import { PositionsApi } from '../../generated-src/client/apis/positions-api';
import { QuestionsApi } from '../../generated-src/client/apis/questions-api';
import { TeamUsersApi } from '../../generated-src/client/apis/team-users-api';
import { AnalyticsReportsApi } from '../../generated-src/client/apis/analytics-reports-api';
import { SettingsApi } from '../../generated-src/client/apis/settings-api';
import { AIApi } from '../../generated-src/client/apis/aiapi';
import { VoiceApi } from '../../generated-src/client/apis/voice-api';
import { VoiceInterviewsApi } from '../../generated-src/client/apis/voice-interviews-api';
import { GenerationApi } from '../../generated-src/client/apis/generation-api';

// Type definitions for paginated responses (local shapes)
interface PositionsPaginatedResponse { content?: Position[]; totalElements?: number; totalPages?: number; number?: number; size?: number }
interface InterviewsPaginatedResponse { content?: Interview[]; totalElements?: number; totalPages?: number; number?: number; size?: number }
interface UsersPaginatedResponse { content?: User[]; totalElements?: number; totalPages?: number; number?: number; size?: number }

class ApiService {
  private lastToken: string | null = null;

  // Get API client with current token
  getApiClient(): ApiClient {
    const currentToken = useAuthStore.getState().token;
    
    console.log('🔑 getApiClient - currentToken:', currentToken ? `${currentToken.substring(0, 20)}...` : 'null');

    // Создаем новый клиент с текущим токеном
    const config = new Configuration({
      basePath: (process.env.REACT_APP_API_BASE_URL || '/api/v1').toString().trim().replace(/\/+$/, ''),
      accessToken: () => currentToken || ''
    });

    return {
      auth: new AuthApi(config),
      account: new AccountApi(config),
      candidates: new CandidatesApi(config),
      interviews: new InterviewsApi(config),
      positions: new PositionsApi(config),
      questions: new QuestionsApi(config),
      teamUsers: new TeamUsersApi(config),
      analyticsReports: new AnalyticsReportsApi(config),
      settings: new SettingsApi(config),
      ai: new AIApi(config),
      voice: new VoiceApi(config),
      voiceInterviews: new VoiceInterviewsApi(config),
      generation: new GenerationApi(config)
    };
  }

  // Get API client without authentication for public endpoints
  getPublicApiClient(): ApiClient {
    console.log('🔗 apiService.getPublicApiClient вызван');
    
    const basePath = (process.env.REACT_APP_API_BASE_URL || '/api/v1').toString().trim().replace(/\/+$/, '');
    console.log('📍 Base path для публичного клиента:', basePath);
    
    // Создаем новый клиент без токена для публичных эндпоинтов
    const config = new Configuration({
      basePath: basePath
      // Не устанавливаем accessToken для публичных эндпоинтов
    });
    
    console.log('⚙️ Конфигурация публичного клиента создана:', config);

    const publicClient = {
      auth: new AuthApi(config),
      account: new AccountApi(config),
      candidates: new CandidatesApi(config),
      interviews: new InterviewsApi(config),
      positions: new PositionsApi(config),
      questions: new QuestionsApi(config),
      teamUsers: new TeamUsersApi(config),
      analyticsReports: new AnalyticsReportsApi(config),
      settings: new SettingsApi(config),
      ai: new AIApi(config),
      voice: new VoiceApi(config),
      voiceInterviews: new VoiceInterviewsApi(config),
      generation: new GenerationApi(config)
    };
    
    console.log('✅ Публичный API клиент создан:', publicClient);
    return publicClient;
  }

  // === AUTHENTICATION ===
  async login(email: string, password: string): Promise<AuthResponse> {
    const loginRequest: LoginRequest = { email, password };
    // For login, we don't need token yet, so we use the public client
    const response = await this.getPublicApiClient().auth.login(loginRequest);
    return response.data;
  }

  // Force refresh API client (useful after login/logout)
  refreshApiClient() {
    console.log('🔍 refreshApiClient - No longer needed, using global apiClient');
    // The global apiClient automatically gets the current token from the store
  }

  async logout(): Promise<void> {
    await this.getApiClient().auth.logout();
  }

  // === ACCOUNT ===
  async getAccount(): Promise<User> {
    const response = await this.getApiClient().account.getAccount();
    return response.data;
  }

  async updateAccount(userData: any): Promise<User> {
    const response = await this.getApiClient().account.updateAccount(userData);
    return response.data;
  }

  // === POSITIONS ===
  async getPositions(params?: {
    status?: PositionStatusEnum;
    search?: string;
    page?: number;
    size?: number;
  }): Promise<{ items: Position[]; total: number }> {
    try {
      const page0 = params?.page != null ? Math.max(0, params.page - 1) : 0;
      const response = await this.getApiClient().positions.listPositions(
        params?.status,
        params?.search,
        undefined, // owner parameter removed
        page0,
        params?.size
      );

      const data = response.data as PositionsPaginatedResponse;

      // OpenAPI spec defines Spring Boot Page format with content, totalElements, etc.
      if (data.content && Array.isArray(data.content)) {
        // Безопасно маппим enum'ы для каждой позиции
        const items = data.content.map(position => ({
          ...position,
          status: mapPositionStatusEnum(position.status)
        }));

        return {
          items: items || [],
          total: data.totalElements || 0
        };
      } else {
        // Fallback for unexpected format
        console.error('Unexpected response format:', data);
        return {
          items: [],
          total: 0
        };
      }
    } catch (error: any) {
      console.error('getPositions error:', error);
      throw error;
    }
  }

  async getPosition(id: number): Promise<Position> {
    const response = await this.getApiClient().positions.getPosition(id);
    return response.data;
  }

  async createPosition(positionData: PositionCreateRequest): Promise<Position> {
    console.log('🔍 createPosition - Starting with token:', useAuthStore.getState().token ? 'present' : 'missing');
    try {
      const response = await this.getApiClient().positions.createPosition(positionData);
      console.log('🔍 createPosition - Success');
      return response.data;
    } catch (error: any) {
      console.error('🔍 createPosition - Error:', error.response?.status, error.response?.data);
      throw error;
    }
  }

  async updatePosition(id: number, positionData: PositionUpdateRequest): Promise<Position> {
    const response = await this.getApiClient().positions.updatePosition(id, positionData);
    return response.data;
  }

  async getPositionStats(id: number): Promise<any> {
    // Using global positions stats from analytics API (no per-position stats available)
    const response = await this.getApiClient().analyticsReports.getPositionsStats(true);
    return response.data;
  }

  // getPositionPublicLink method removed - functionality not needed per business requirements

  // === CANDIDATES ===
  async getCandidates(positionId: number): Promise<Candidate[]> {
    try {
      const response = await this.getApiClient().candidates.listPositionCandidates(positionId);
      const data = response.data as any;

      // OpenAPI spec defines Spring Boot Page format
      let candidates: any[] = [];
      if (data.content && Array.isArray(data.content)) {
        candidates = data.content;
      } else if (Array.isArray(data)) {
        // Fallback for direct array response
        candidates = data;
      } else {
        console.error('Unexpected response format:', data);
        return [];
      }

      // Безопасно маппим enum'ы для каждого кандидата
      return candidates.map(candidate => ({
        ...candidate,
        status: mapCandidateStatusEnum(candidate.status)
      }));
    } catch (error: any) {
      console.error('getCandidates error:', error);

      // Return empty array on error to prevent crashes
      return [];
    }
  }

  async getCandidate(id: number): Promise<Candidate> {
    const response = await this.getApiClient().candidates.getCandidate(id);
    return response.data;
  }

  async createCandidate(positionId: number, candidateData: CandidateCreateRequest): Promise<Candidate> {
    console.log('🔍 createCandidate - positionId:', positionId);
    console.log('🔍 createCandidate - candidateData:', candidateData);

    // Проверяем токен авторизации
    const currentToken = useAuthStore.getState().token;
    if (!currentToken) {
      throw new Error('Токен авторизации отсутствует. Необходимо войти в систему.');
    }

    // Удаляем поле source, если оно пустое или не задано
    const { source, ...rest } = candidateData as any;
    const dataToSend = (source === undefined || source === null || source === '') ? rest : { ...rest, source };
    
    console.log('🔑 createCandidate - using token:', `${currentToken.substring(0, 20)}...`);
    
    const response = await this.getApiClient().candidates.createPositionCandidate(positionId, dataToSend);

    console.log('🔍 createCandidate - response:', response.data);
    return response.data;
  }

  // createInterview moved to line 430

  async updateCandidate(id: number, candidateData: CandidateUpdateRequest): Promise<Candidate> {
    const response = await this.getApiClient().candidates.updateCandidate(id, candidateData);
    return response.data;
  }

  async deleteCandidate(id: number): Promise<void> {
    await this.getApiClient().candidates.deleteCandidate(id);
  }

  // === INTERVIEWS ===
  async getInterviews(params?: {
    positionId?: number;
    candidateId?: number;
    status?: InterviewStatusEnum;
    result?: InterviewResultEnum;
    search?: string;
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<{ items: Interview[]; total: number }> {
    try {
      const page0 = params?.page != null ? Math.max(0, params.page - 1) : 0;
      const response = await this.getApiClient().interviews.listInterviews(
        params?.positionId,
        params?.candidateId,
        params?.status,
        params?.result,
        params?.search,
        page0,
        params?.size,
        params?.sort
      );

      const data = response.data as InterviewsPaginatedResponse;

      // OpenAPI spec defines Spring Boot Page format
      if (data.content && Array.isArray(data.content)) {
        // Безопасно маппим enum'ы для каждого интервью
        const items = data.content.map(interview => ({
          ...interview,
          status: mapInterviewStatusEnum(interview.status),
          result: interview.result ? mapInterviewResultEnum(interview.result) : undefined
        }));

        return {
          items: items || [],
          total: data.totalElements || 0
        };
      } else {
        console.error('Unexpected response format:', data);
        return {
          items: [],
          total: 0
        };
      }
    } catch (error: any) {
      console.error('getInterviews error:', error);

      // If 400 error, try without optional parameters
      if (error.response?.status === 400) {
        try {
          const page0 = params?.page != null ? Math.max(0, params.page - 1) : 0;
          const retryResponse = await this.getApiClient().interviews.listInterviews(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            page0,
            params?.size
          );

          const retryData = retryResponse.data as InterviewsPaginatedResponse;

          if (retryData.content && Array.isArray(retryData.content)) {
            // Безопасно маппим enum'ы для каждого интервью
            const items = retryData.content.map(interview => ({
              ...interview,
              status: mapInterviewStatusEnum(interview.status),
              result: interview.result ? mapInterviewResultEnum(interview.result) : undefined
            }));

            return {
              items: items || [],
              total: retryData.totalElements || 0
            };
          } else {
            return {
              items: [],
              total: 0
            };
          }
        } catch (retryError) {
          console.error('Retry also failed:', retryError);
          throw retryError;
        }
      }

      throw error;
    }
  }

  async getInterview(id: number): Promise<any> {
    const response = await this.getApiClient().interviews.getInterview(id);
    return response.data;
  }

  // Создать интервью по email кандидата (без старта)
  async createInterview(interviewData: {
    positionId: number;
    candidateEmail: string;
    firstName?: string;
    lastName?: string;
  }): Promise<Interview> {
    console.log('🔍 createInterview - interviewData:', interviewData);

    // Проверяем токен авторизации
    const currentToken = useAuthStore.getState().token;
    if (!currentToken) {
      throw new Error('Токен авторизации отсутствует. Необходимо войти в систему.');
    }
    
    console.log('🔑 createInterview - using token:', `${currentToken.substring(0, 20)}...`);
    
    const response = await this.getApiClient().interviews.createInterview(interviewData);

    console.log('🔍 createInterview - response:', response.data);
    return response.data;
  }

  async startInterview(candidateId: number, positionId: number): Promise<Interview> {
    console.log('🔍 startInterview - candidateId:', candidateId, 'positionId:', positionId);

    // Implementation using real API methods:
    // Start interview using the interviews API
    // Note: This requires the interview to already exist, we need to find how interviews are created
    // For now, using startInterview with the candidate ID as interview ID
    const response = await this.getApiClient().interviews.startInterview(candidateId, {
      // Add any required interview start parameters here
    });

    return response.data as any; // InterviewStartResponse has different structure than Interview
  }

  async finishInterview(interviewId: number): Promise<Interview> {
    // Завершаем интервью, устанавливая статус finished и дату завершения
    const response = await this.getApiClient().interviews.finishInterview(interviewId);
    return response.data;
  }

  async submitInterviewAnswer(interviewId: number, answerData: any): Promise<Interview> {
    // TODO: Implement when submitInterviewAnswer method is available in API
    console.warn('submitInterviewAnswer method not available in API yet');
    throw new Error('Method not implemented');
  }

  async getPositionInterviews(positionId: number): Promise<Interview[]> {
    const response = await this.getApiClient().interviews.listPositionInterviews(positionId);
    const data = response.data as InterviewsPaginatedResponse;
    if (data.content && Array.isArray(data.content)) {
      return data.content.map(interview => ({
        ...interview,
        status: mapInterviewStatusEnum(interview.status),
        result: interview.result ? mapInterviewResultEnum(interview.result) : undefined
      }));
    }
    return [];
  }

  async createConversationMapping(interviewId: number, conversationId: string): Promise<void> {
    // TODO: Implement when createConversationMapping method is available in API
    console.warn('createConversationMapping method not available in API yet');
    throw new Error('Method not implemented');
  }

  // === QUESTIONS ===
  async getQuestions(positionId: number): Promise<{ questions: Question[]; interviewSettings: { answerTime?: number; language?: string; saveAudio?: boolean; saveVideo?: boolean; randomOrder?: boolean; minScore?: number } }> {
    try {
      // Используем правильный эндпоинт для получения вопросов с настройками
      const response = await this.getApiClient().questions.getPositionQuestionsWithSettings(positionId);
      const data = response.data;

      // Проверяем структуру ответа
      if (data.questions && Array.isArray(data.questions)) {
        // Безопасно маппим enum'ы для каждого вопроса
        const questions = data.questions.map((question: any) => ({
          ...question,
          type: mapQuestionTypeEnum(question.type)
        }));

        return {
          questions: questions || [],
          interviewSettings: {
            ...data.interviewSettings,
            minScore: (data.interviewSettings as any)?.minScore || 0
          }
        };
      } else {
        console.error('Unexpected response format for questions:', data);
        return {
          questions: [],
          interviewSettings: {
            minScore: 0
          }
        };
      }
    } catch (error: any) {
      console.error('getQuestions error:', error);

      // Fallback: попробуем старый эндпоинт
      try {
        console.log('Trying fallback endpoint...');
        const fallbackResponse = await this.getApiClient().questions.listPositionQuestions(positionId);
        const fallbackData = fallbackResponse.data;

        // Старый эндпоинт возвращает PaginatedResponse
        if (fallbackData.content && Array.isArray(fallbackData.content)) {
          console.log('Using fallback endpoint with content array');
          // Безопасно маппим enum'ы для каждого вопроса
          const questions = fallbackData.content.map((question: any) => ({
            ...question,
            type: mapQuestionTypeEnum(question.type)
          }));

          return {
            questions: questions || [],
            interviewSettings: {
              minScore: 0
            }
          };
        } else {
          console.error('Fallback endpoint also failed with unexpected format:', fallbackData);
          return {
            questions: [],
            interviewSettings: {
              minScore: 0
            }
          };
        }
      } catch (fallbackError) {
        console.error('Fallback endpoint also failed:', fallbackError);
        return {
          questions: [],
          interviewSettings: {
            minScore: 0
          }
        };
      }
    }
  }

  async createQuestion(positionId: number, questionData: QuestionCreateRequest): Promise<Question> {
    console.log('🔍 createQuestion - Starting with token:', useAuthStore.getState().token ? 'present' : 'missing');
    console.log('🔍 createQuestion - Position ID:', positionId);

    // Get the API client and log its configuration
    const apiClient = this.getApiClient();
    console.log('🔍 createQuestion - API client obtained, lastToken:', this.lastToken ? `${this.lastToken.substring(0, 20)}...` : 'null');

    try {
      const response = await this.getApiClient().questions.createPositionQuestion(positionId, questionData);
      console.log('🔍 createQuestion - Success');
      return response.data;
    } catch (error: any) {
      console.error('🔍 createQuestion - Error:', error.response?.status, error.response?.data);
      console.error('🔍 createQuestion - Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      throw error;
    }
  }

  async updateQuestion(id: number, questionData: BaseQuestionFields): Promise<Question> {
    const response = await this.getApiClient().questions.updateQuestion(id, questionData);
    return response.data;
  }

  async deleteQuestion(id: number): Promise<void> {
    await this.getApiClient().questions.deleteQuestion(id);
  }

  // === TEAM & USERS ===
  async getUsers(): Promise<User[]> {
    try {
      const response = await this.getApiClient().teamUsers.listUsers();
      const data = response.data as UsersPaginatedResponse;

      // OpenAPI spec defines Spring Boot Page format
      let users: any[] = [];
      if (data.content && Array.isArray(data.content)) {
        users = data.content;
      } else if (Array.isArray(data)) {
        // Fallback for direct array response
        users = data;
      } else {
        console.error('Unexpected response format:', data);
        return [];
      }

      // Безопасно маппим enum'ы для каждого пользователя
      return users.map(user => ({
        ...user,
        role: mapRoleEnum(user.role)
      }));
    } catch (error: any) {
      console.error('getUsers error:', error);

      // Return empty array on error to prevent crashes
      return [];
    }
  }

  async createUser(userData: any): Promise<User> {
    console.log('🔍 createUser - Starting with token:', useAuthStore.getState().token ? 'present' : 'missing');
    console.log('🔍 createUser - Token details:', useAuthStore.getState().token ? `${useAuthStore.getState().token?.substring(0, 20)}...` : 'null');
    console.log('🔍 createUser - User data:', userData);

    try {
      const response = await this.getApiClient().teamUsers.createUser(userData);
      console.log('🔍 createUser - Success');
      return response.data;
    } catch (error: any) {
      console.error('🔍 createUser - Error:', error.response?.status, error.response?.data);
      throw error;
    }
  }

  async getUser(id: number): Promise<User> {
    const response = await this.getApiClient().teamUsers.getUser(id);
    return response.data;
  }

  async updateUser(id: number, userData: any): Promise<User> {
    const response = await this.getApiClient().teamUsers.updateUser(id, userData);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await this.getApiClient().teamUsers.deleteUser(id);
  }

  // (team users methods defined above remain in effect)

  // === SETTINGS ===
  async getBranding(): Promise<Branding> {
    const response = await this.getApiClient().settings.getBranding();
    return response.data;
  }

  async updateBranding(brandingData: BrandingUpdateRequest): Promise<Branding> {
    const response = await this.getApiClient().settings.updateBranding(brandingData);
    return response.data;
  }

  async getTariffs(): Promise<any[]> {
    const response = await this.getApiClient().settings.listTariffs();
    return response.data;
  }

  async getTariffInfo(): Promise<any> {
    const response = await this.getApiClient().settings.getTariffInfo();
    return response.data;
  }

  // === ANALYTICS & REPORTS ===
  async getStats(): Promise<any> {
    const response = await this.getApiClient().analyticsReports.getPositionsStats();
    return response.data;
  }

  async getReports(): Promise<any[]> {
    const response = await this.getApiClient().analyticsReports.getReports();
    return response.data;
  }

  async getMonthlyReport(year: number, month: number): Promise<any> {
    const response = await this.getApiClient().analyticsReports.getReports();
    return response.data;
  }

  // === AI ===
  async generatePosition(description: string, questionsCount?: number, questionType?: string): Promise<Array<string>> {
    console.log('🔍 generatePosition - Starting with token:', useAuthStore.getState().token ? 'present' : 'missing');
    console.log('generatePosition called with:', { description, questionsCount, questionType });

    try {
      const response = await this.getApiClient().generation.generatePositionQuestions(description, questionsCount || 5);
      console.log('🔍 generatePosition - Success');
      console.log('generatePosition response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('🔍 generatePosition - Error:', error.response?.status, error.response?.data);
      console.error('generatePosition error:', error);
      throw error;
    }
  }

  async generatePositionData(description: string, existingData?: any): Promise<PositionDataGenerationResponse> {
    console.log('generatePositionData called with:', { description, existingData });

    const request: PositionDataGenerationRequest = {
      description,
      existingData
    };

    try {
      const response = await this.getApiClient().generation.generatePositionData(request);
      console.log('generatePositionData response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('generatePositionData error:', error);
      throw error;
    }
  }

  async transcribeAudio(audioFile: File): Promise<{ transcript: string }> {
    console.log('=== TRANSCRIBE AUDIO SERVICE START ===');
    console.log('Audio file details:', {
      name: audioFile.name,
      size: audioFile.size,
      type: audioFile.type,
      lastModified: audioFile.lastModified
    });

    // Проверяем размер файла
    if (audioFile.size === 0) {
      throw new Error('Audio file is empty');
    }

    if (audioFile.size > 50 * 1024 * 1024) { // 50MB limit
      throw new Error('Audio file is too large (max 50MB)');
    }

    try {
      console.log('Calling ai.transcribeAudio...');

      // Создаем FormData для проверки
      const formData = new FormData();
      formData.append('audio', audioFile);
      console.log('FormData created with audio file');
      console.log('FormData entries:');
      formData.forEach((value, key) => {
        console.log(`  ${key}:`, value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value);
      });

      const response = await this.getPublicApiClient().ai.transcribeAudio(audioFile);
      console.log('Raw response:', response);
      console.log('Response data:', response.data);
      console.log('Response data type:', typeof response.data);
      console.log('Response data keys:', Object.keys(response.data || {}));

      const data = response.data as TranscribeAudio200Response;
      console.log('Parsed data:', data);
      console.log('Data transcript:', data.transcript);

      console.log('=== TRANSCRIBE AUDIO SERVICE END ===');

      return {
        transcript: data.transcript || 'Текст не распознан'
      };
    } catch (error: any) {
      console.error('=== TRANSCRIBE AUDIO SERVICE ERROR ===');
      console.error('Error details:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
      }
      throw error;
    }
  }

  async transcribeInterviewAnswer(audioFile: File, interviewId: number, questionId: number): Promise<{ success: boolean; formattedText: string; interviewAnswerId: string }> {
    console.log('=== TRANSCRIBE INTERVIEW ANSWER SERVICE START ===');
    console.log('Audio file details:', {
      name: audioFile.name,
      size: audioFile.size,
      type: audioFile.type,
      lastModified: audioFile.lastModified
    });
    console.log('Interview ID:', interviewId, 'Question ID:', questionId);

    // Проверяем размер файла
    if (audioFile.size === 0) {
      throw new Error('Audio file is empty');
    }

    if (audioFile.size > 50 * 1024 * 1024) { // 50MB limit
      throw new Error('Audio file is too large (max 50MB)');
    }

    try {
      console.log('Calling ai.transcribeAnswerWithAI...');

      // Создаем FormData для проверки
      const formData = new FormData();
      formData.append('audioFile', audioFile);
      formData.append('interviewId', interviewId.toString());
      formData.append('questionId', questionId.toString());
      console.log('FormData created with audio file and IDs');
      console.log('FormData entries:');
      formData.forEach((value, key) => {
        console.log(`  ${key}:`, value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value);
      });

      const response = await this.getApiClient().ai.transcribeAnswerWithAI(audioFile, interviewId, questionId);
      console.log('Raw response:', response);
      console.log('Response data:', response.data);
      console.log('Response data type:', typeof response.data);
      console.log('Response data keys:', Object.keys(response.data || {}));

      const data = response.data as TranscribeAnswerWithAI200Response;
      console.log('Parsed data:', data);
      console.log('Data success:', data.success);
      console.log('Data formattedText:', data.formattedText);
      console.log('Data interviewAnswerId:', data.interviewAnswerId);

      console.log('=== TRANSCRIBE INTERVIEW ANSWER SERVICE END ===');

      return {
        success: data.success || false,
        formattedText: data.formattedText || 'Текст не распознан',
        interviewAnswerId: String(data.interviewAnswerId || '')
      };
    } catch (error: any) {
      console.error('=== TRANSCRIBE INTERVIEW ANSWER SERVICE ERROR ===');
      console.error('Error details:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
      }
      throw error;
    }
  }

  // === VOICE INTERVIEWS ===
  // createVoiceSession method removed - functionality not needed per business requirements

  // Остальные методы voice interviews будут реализованы через webhook'и
  // и не требуют прямых API вызовов с фронтенда

  // === MISSING ENDPOINTS ===

  // Positions
  async partialUpdatePosition(id: number, status: PositionStatusEnum): Promise<Position> {
    // TODO: Implement when partialUpdatePosition method is available in API
    console.warn('partialUpdatePosition method not available in API yet');
    throw new Error('Method not implemented');
  }

  // Questions
  async getPositionQuestionsWithSettings(positionId: number): Promise<any> {
    const response = await this.getApiClient().questions.getPositionQuestionsWithSettings(positionId);
    return response.data;
  }

  // Account
  // async getUserInfo(): Promise<any> {
  //   const response = await this.getApiClient().account.getUserInfo();
  //   return response.data;
  // }

  // Analytics & Reports
  async getInterviewsStats(): Promise<any> {
    const response = await this.getApiClient().analyticsReports.getInterviewsStats();
    return response.data;
  }

  // Settings
  async createTariff(tariffData: any): Promise<any> {
    const response = await this.getApiClient().settings.createTariff(tariffData);
    return response.data;
  }

  async updateTariff(id: number, tariffData: any): Promise<any> {
    const response = await this.getApiClient().settings.updateTariff(id, tariffData);
    return response.data;
  }

  // Candidates
  async authCandidate(authData: any): Promise<any> {
    const response = await this.getPublicApiClient().candidates.loginCandidate(authData);
    return response.data;
  }

  // === GENERIC HTTP METHODS ===
  private resolveUrl(url: string): string {
    // If url is absolute (http or https), return as is
    if (/^https?:\/\//i.test(url)) return url;
    const base = (process.env.REACT_APP_API_BASE_URL || '/api/v1').toString().trim().replace(/\/+$/, '');
    if (url.startsWith('/')) return `${base}${url}`;
    return `${base}/${url}`;
  }

  async get(url: string, config?: any): Promise<any> {
    const response = await axios.get(this.resolveUrl(url), config);
    return response;
  }

  async post(url: string, data?: any, config?: any): Promise<any> {
    const response = await axios.post(this.resolveUrl(url), data, config);
    return response;
  }

  async put(url: string, data?: any, config?: any): Promise<any> {
    const token = useAuthStore.getState().token;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.put(this.resolveUrl(url), data, {
      ...config,
      headers: { ...headers, ...config?.headers }
    });
    return response;
  }

  async delete(url: string, config?: any): Promise<any> {
    const token = useAuthStore.getState().token;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.delete(this.resolveUrl(url), {
      ...config,
      headers: { ...headers, ...config?.headers }
    });
    return response;
  }

  // === UTILITY METHODS ===
  getInterviewStatusMap() {
    return {
      IN_PROGRESS: 'В процессе',
      FINISHED: 'Завершено',
      CANCELLED: 'Отменено'
    };
  }

  getIconMap() {
    return {
      IN_PROGRESS: '🔄',
      FINISHED: '✅',
      CANCELLED: '❌',
      HIRED: '🎉',
      REJECTED: '👎'
    };
  }

  async setPositionManager(positionId: number, managerId: number): Promise<any> {
    // PUT /positions/{id}/manager { managerId }
    const token = useAuthStore.getState().token;
    const base = (process.env.REACT_APP_API_BASE_URL || '/api/v1').toString().trim().replace(/\/+$/, '');
    const response = await axios.put(
      `${base}/positions/${positionId}/manager`,
      { managerId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
}

// Экспортируем единственный экземпляр сервиса
export const apiService = new ApiService(); 
