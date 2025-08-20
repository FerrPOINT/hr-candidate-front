import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useConversation } from '@elevenlabs/react';
import { apiService } from '../services/apiService';
import elevenLabsConfig from '../config/elevenLabsConfig';

interface VoiceSessionState {
  sessionId: string | null;
  status: 'idle' | 'connecting' | 'connected' | 'error' | 'ended';
  isListening: boolean;
  isSpeaking: boolean;
  isAgentSpeaking: boolean;
  isUserListening: boolean;
  hasError: boolean;
}

interface VoiceSessionData {
  sessionId?: string;
  agentId?: string;
  status?: string;
  webhookUrl?: string;
  createdAt?: string;
  interviewId?: number;
  signedUrl?: string;
  candidateData?: any;
}

interface UseElevenLabsOptions {
  onMessage?: (message: string) => void;
  onError?: (error: string) => void;
  onSessionEnd?: () => void;
  onAgentStart?: () => void;
  onAgentEnd?: () => void;
  onUserStart?: () => void;
  onUserEnd?: () => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

// Глобальный реестр активных сессий для предотвращения конфликтов
const activeSessions = new Map<string, boolean>();

export const useElevenLabs = (options: UseElevenLabsOptions) => {
  // If feature disabled — return inert implementation to avoid side effects
  if (!elevenLabsConfig.enabled) {
    return {
      isConnected: false,
      isSpeaking: false,
      isRecording: false,
      messages: [],
      start: async () => {},
      stop: async () => {},
      sendText: async () => {},
      sendAudio: async () => {},
    } as any;
  }

  console.log('🔍 useElevenLabs initialized with options:', options);
  
  const {
    onMessage, 
    onError, 
    onSessionEnd, 
    onAgentStart, 
    onAgentEnd, 
    onUserStart, 
    onUserEnd,
    onConnect,
    onDisconnect
  } = options;
  
  const [state, setState] = useState<VoiceSessionState>({
    sessionId: null,
    status: 'idle',
    isListening: false,
    isSpeaking: false,
    isAgentSpeaking: false,
    isUserListening: false,
    hasError: false
  });

  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const sessionRef = useRef<VoiceSessionData | null>(null);
  const isInitialized = useRef(false);
  const contextualUpdateSent = useRef(false);
  const isStartingSession = useRef(false);
  const sessionStartedRef = useRef(false);
  const sessionIdRef = useRef<string | null>(null);
  const componentId = useRef<string>(`session_${Date.now()}_${Math.random()}`);

  // Загружаем данные сессии при инициализации
  useEffect(() => {
    const loadSessionData = () => {
      try {
        const storedData = localStorage.getItem('voiceSessionData');
        if (storedData) {
          const data = JSON.parse(storedData);
          console.log('🔍 useElevenLabs - Loading session data from localStorage:', data);
          console.log('🔍 useElevenLabs - agentId from localStorage:', data.agentId);
          console.log('🔍 useElevenLabs - agentId type:', typeof data.agentId);
          console.log('🔍 useElevenLabs - agentId length:', data.agentId?.length);
          console.log('🔍 useElevenLabs - agentId starts with:', data.agentId?.substring(0, 10));
          sessionRef.current = data;
          sessionIdRef.current = data.sessionId || null;
        }
      } catch (error) {
        console.error('❌ Error loading session data:', error);
      }
    };

    loadSessionData();
  }, []);

  // Стабильная конфигурация conversation
  const conversationConfig = useMemo(() => ({
    onConnect: async () => {
      console.log('ELEVENLABS_CHAT: Голосовая сессия подключена');
      console.log('🔍 Agent ID being used:', sessionRef.current?.agentId);
      console.log('🔍 Current interview ID:', sessionRef.current?.interviewId);
      console.log('🔍 Component ID:', componentId.current);
      
      if (!sessionRef.current?.agentId) {
        console.warn('⚠️ WARNING: No agentId found! ElevenLabs may not work correctly.');
        console.warn('⚠️ Session data:', sessionRef.current);
      } else {
        console.log('✅ Agent ID found:', sessionRef.current.agentId);
        console.log('🔍 This should be YOUR custom agent, not a default one');
      }
      
      setState(prev => ({ 
        ...prev, 
        status: 'connected'
      }));
      
      if (onConnect) onConnect();
    },

    onDisconnect: () => {
      console.log('ELEVENLABS_CHAT: Голосовая сессия отключена');
      console.log('🔍 Component ID:', componentId.current);
      
      setState(prev => ({ 
        ...prev, 
        status: 'ended'
      }));
      
      contextualUpdateSent.current = false;
      
      if (onDisconnect) onDisconnect();
    },
    
    onMessage: (message: any) => {
      console.log('ELEVENLABS_CHAT: Сообщение от ElevenLabs:', message);
      // Логируем тип сообщения для диагностики
      if (message && message.type) {
        console.log(`[DIAG] ElevenLabs message type:`, message.type);
      }
      if (message.type === 'user_transcript') {
        setState(prev => ({ 
          ...prev, 
          isUserListening: false,
          isListening: false 
        }));
        if (onUserEnd) onUserEnd();
      } else if (message.type === 'assistant_message') {
        if (message.text) {
          if (onMessage) onMessage(message.text);
        }
      } else if (message.type === 'conversation_started') {
        console.log('🎤 Conversation started');
      } else if (message.type === 'conversation_ended') {
        console.log('🔚 Conversation ended');
        setState(prev => ({ ...prev, status: 'ended' }));
        if (onSessionEnd) onSessionEnd();
      } else if (message.text) {
        if (onMessage) onMessage(message.text);
      }
    },
    
    onError: (error: any) => {
      console.error('ELEVENLABS_CHAT: Ошибка ElevenLabs:', error);
      setState(prev => ({ 
        ...prev, 
        status: 'error',
        hasError: true 
      }));
      if (onError) {
        onError(error.message || 'ElevenLabs error');
      }
    },
    
    onAgentStart: () => {
      console.log('ELEVENLABS_CHAT: AI начал говорить');
      setState(prev => ({ 
        ...prev, 
        isAgentSpeaking: true,
        isSpeaking: true 
      }));
      if (onAgentStart) onAgentStart();
    },
    
    onAgentEnd: () => {
      console.log('ELEVENLABS_CHAT: AI закончил говорить');
      setState(prev => ({ 
        ...prev, 
        isAgentSpeaking: false,
        isSpeaking: false 
      }));
      if (onAgentEnd) onAgentEnd();
    },
    
    onUserStart: () => {
      console.log('ELEVENLABS_CHAT: Пользователь начал говорить');
      setState(prev => ({ 
        ...prev, 
        isUserListening: true,
        isListening: true 
      }));
      if (onUserStart) onUserStart();
    },
    
    onUserEnd: () => {
      console.log('ELEVENLABS_CHAT: Пользователь закончил говорить');
      setState(prev => ({ 
        ...prev, 
        isUserListening: false,
        isListening: false 
      }));
      if (onUserEnd) onUserEnd();
    }
  }), [onConnect, onDisconnect, onMessage, onError, onAgentStart, onAgentEnd, onUserStart, onUserEnd, onSessionEnd]);

  // Стабильный экземпляр conversation
  const conversation = useConversation(conversationConfig);

  // Получение signed URL и данных сессии из localStorage
  const getSignedUrl = useCallback(async () => {
    if (signedUrl) {
      return signedUrl;
    }

    try {
      const storedData = localStorage.getItem('voiceSessionData');
      console.log('🔍 Raw stored data from localStorage:', storedData);
      
      if (storedData) {
        const data = JSON.parse(storedData);
        console.log('🔍 Parsed session data:', data);
        console.log('🔍 Previous agentId in localStorage:', data.agentId);
        console.log('🔍 Previous interviewId in localStorage:', data.interviewId);
        console.log('🔍 Current interviewId from URL:', window.location.pathname.split('/').pop());
        
        if (data.signedUrl) {
          console.log('✅ Found signed URL in localStorage');
          console.log('🔍 agentId from localStorage:', data.agentId);
          console.log('🔍 sessionId from localStorage:', data.sessionId);
          
          if (!data.agentId) {
            console.warn('⚠️ WARNING: No agentId in localStorage! This may cause issues.');
            console.warn('⚠️ Available data keys:', Object.keys(data));
          } else {
            console.log('✅ Agent ID found in localStorage:', data.agentId);
          }
          
          setSignedUrl(data.signedUrl);
          
          setState(prev => ({
            ...prev,
            sessionId: data.sessionId || null,
            status: 'idle'
          }));

          sessionRef.current = {
            sessionId: data.sessionId,
            agentId: data.agentId,
            status: data.status,
            webhookUrl: data.webhookUrl,
            createdAt: data.createdAt,
            interviewId: data.interviewId,
            signedUrl: data.signedUrl,
            candidateData: data.candidateData
          };

          sessionIdRef.current = data.sessionId || null;
          console.log('🔍 Session ref updated with agentId:', sessionRef.current.agentId);
          return data.signedUrl;
        }
      }
    } catch (error) {
      console.error('❌ Error parsing voice session data:', error);
    }

    throw new Error('No voice session data found. Please start the interview first.');
  }, [signedUrl]);

  // Запуск сессии с signed URL
  const startSession = useCallback(async () => {
    const sessionKey = sessionIdRef.current || 'default';
    
    // Проверяем, не запущена ли уже сессия для этого sessionId
    if (activeSessions.has(sessionKey)) {
      console.log('⚠️ Session already active for this sessionId:', sessionKey);
      console.log('🔍 Component ID:', componentId.current);
      return;
    }
    
    // Защита от множественных вызовов
    if (sessionStartedRef.current || isStartingSession.current) {
      console.log('⚠️ Session already started or starting, skipping startSession');
      console.log('🔍 Component ID:', componentId.current);
      return;
    }
    
    if (state.status === 'connecting' || state.status === 'connected') {
      console.log('⚠️ Session already connecting or connected, skipping startSession');
      console.log('🔍 Component ID:', componentId.current);
      return;
    }
    
    if (!sessionRef.current?.agentId) {
      console.warn('⚠️ No agentId available, cannot start session');
      throw new Error('No agent ID available. Please start the interview first.');
    }
    
    if (isInitialized.current) {
      console.log('⚠️ Session already initialized, skipping startSession');
      console.log('🔍 Component ID:', componentId.current);
      return;
    }
    
    try {
      isStartingSession.current = true;
      sessionStartedRef.current = true;
      activeSessions.set(sessionKey, true);
      
      console.log('🚀 Starting ElevenLabs session...');
      console.log('🔍 Component ID:', componentId.current);
      console.log('🔍 Session Key:', sessionKey);
      
      setState(prev => ({ ...prev, status: 'connecting' }));
      setIsLoading(true);

      // 1. Проверяем разрешения микрофона
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      console.log('✅ Microphone permission granted');

      // 2. Получаем signed URL
      const url = await getSignedUrl();
      console.log('🔍 Got signed URL:', url);

      // 3. Запускаем сессию с ElevenLabs
      if (conversation && typeof conversation.startSession === 'function') {
        console.log('🔍 Starting ElevenLabs session with signed URL...');
        
        // Добавляем interview_id и candidate_name (firstName) в dynamicVariables, если есть
        const dynamicVariables: Record<string, any> = {};
        if (sessionRef.current?.interviewId) {
          dynamicVariables.interview_id = String(sessionRef.current.interviewId);
        }
        const firstName = sessionRef.current?.candidateData?.candidate?.firstName;
        if (firstName) {
          dynamicVariables.candidate_name = firstName;
        }
        // Можно добавить и другие переменные, если нужно
        
        const conversationId = await conversation.startSession({ 
          signedUrl: url,
          connectionType: "websocket",
          ...(Object.keys(dynamicVariables).length > 0 ? { dynamicVariables } : {})
        });
        
        console.log('✅ Got conversation_id from startSession:', conversationId);
        console.log('🔍 Conversation ID type:', typeof conversationId);
        console.log('🔍 Conversation ID length:', conversationId?.length);
        
        if (conversationId) {
          console.log('✅ Conversation ID saved:', conversationId);
          
          // Отправляем маппинг на наш бэкенд
          if (!contextualUpdateSent.current) {
            try {
              const session = sessionRef.current || JSON.parse(localStorage.getItem('voiceSessionData') || '{}');
              const interviewId = session.interviewId;
              
              console.log('📤 Sending conversation mapping:', {
                interviewId: interviewId,
                conversationId: conversationId
              });
              
              if (interviewId) {
                await apiService.createConversationMapping(interviewId, conversationId);
              }
              
              contextualUpdateSent.current = true;
              console.log('✅ Conversation mapping sent successfully');
            } catch (err) {
              console.error('❌ Failed to send conversation mapping:', err);
              contextualUpdateSent.current = true;
            }
          }
        } else {
          console.warn('⚠️ No conversationId found - skipping conversation mapping');
        }
        
        isInitialized.current = true;
        console.log('✅ ElevenLabs session started successfully');
      } else {
        throw new Error('Conversation not initialized or startSession method not available');
      }
    } catch (error: any) {
      console.error('❌ Error starting session:', error);
      setState(prev => ({ 
        ...prev, 
        status: 'error',
        hasError: true 
      }));
      sessionStartedRef.current = false;
      activeSessions.delete(sessionKey);
      throw error;
    } finally {
      isStartingSession.current = false;
      setIsLoading(false);
    }
  }, [conversation, getSignedUrl, state.status]);

  // Остановка сессии
  const stopSession = useCallback(async () => {
    const sessionKey = sessionIdRef.current || 'default';
    
    if (state.status === 'ended') {
      console.log('⚠️ Session already ended, skipping stopSession');
      return;
    }
    
    try {
      console.log('🛑 Stopping ElevenLabs session...');
      console.log('🔍 Component ID:', componentId.current);
      console.log('🔍 Session Key:', sessionKey);
      
      if (conversation && typeof (conversation as any).endSession === 'function') {
        await (conversation as any).endSession();
        console.log('✅ ElevenLabs session ended');
      } else if (conversation && typeof (conversation as any).stopSession === 'function') {
        await (conversation as any).stopSession();
        console.log('✅ ElevenLabs session stopped');
      } else {
        console.warn('⚠️ No session end method available');
      }

      setState(prev => ({ 
        ...prev, 
        status: 'ended',
        isAgentSpeaking: false,
        isUserListening: false
      }));

      isInitialized.current = false;
      sessionRef.current = null;
      contextualUpdateSent.current = false;
      sessionStartedRef.current = false;
      activeSessions.delete(sessionKey);
    } catch (error: any) {
      console.error('❌ Error stopping session:', error);
      throw error;
    }
  }, [conversation, state.status]);

  // Очистка при размонтировании
  useEffect(() => {
    const id = componentId.current;
    return () => {
      const sessionKey = sessionIdRef.current || 'default';
      console.log('🔄 Component unmounting - cleaning up session');
      console.log('🔍 Component ID:', id);
      console.log('🔍 Session Key:', sessionKey);
      
      // Удаляем из реестра активных сессий
      activeSessions.delete(sessionKey);
    };
  }, []);

  // Fallback: если статус не 'ended', но возможно есть свойство isEnded у conversation
  useEffect(() => {
    try {
      if (
        state.status !== 'ended' &&
        conversation &&
        typeof (conversation as any).isEnded === 'boolean' &&
        (conversation as any).isEnded
      ) {
        console.log('[DIAG] Fallback: Detected conversation.isEnded, setting status to ended');
        setState(prev => ({ ...prev, status: 'ended' }));
        if (onSessionEnd) onSessionEnd();
      }
    } catch (e) {
      // Просто логируем, не ломаем поток
      console.log('[DIAG] Fallback: conversation.isEnded check failed', e);
    }
  }, [state.status, conversation, onSessionEnd]);

  return {
    // Состояние
    ...state,
    signedUrl,
    isLoading,
    isConnected: state.status === 'connected',
    hasError: state.status === 'error',
    isEnded: state.status === 'ended',
    
    // Данные сессии
    sessionData: sessionRef.current,
    
    // Методы управления сессией
    startSession,
    stopSession,
    
    // Утилиты
    getSignedUrl
  };
}; 