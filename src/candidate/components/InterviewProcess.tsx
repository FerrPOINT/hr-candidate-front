import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './';
import { HelpModal, HelpButton, Logo } from './';
import { InstructionsModal } from './InstructionsModal';
import { AIAvatarWithWaves } from './AIAvatarWithWaves';
import { Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import types and utilities
import { ProcessStage, AIMessage, QuestionCard } from './interview/types';

import { apiClient } from '../../api/apiClient';
import { getFullAudioUrl, logAudioUrl } from '../../utils/audioUtils';
import { createQuestionCard, markQuestionAsCompleted, updateQuestionTime } from './interview/utils';
import { useAudioRecording } from '../hooks/useAudioRecording';

// Import components
import { MessageBubble } from './interview/MessageBubble';
import { QuestionProgressIndicator } from './interview/QuestionProgressIndicator';
import { QuestionCardComponent } from './interview/QuestionCardComponent';
import { MicrophoneTestCard } from './interview/MicrophoneTestCard';
import { ReadingTestCard } from './interview/ReadingTestCard';
import { CandidateQuestions } from './CandidateQuestions';

interface InterviewProcessProps {
  interviewId: number;
  token?: string;
  jobPosition?: {
    title: string;
    department: string;
    company: string;
    type: string;
    questionsCount: number;
  };
  candidateId?: string;
}

export function InterviewProcess({ interviewId, jobPosition }: InterviewProcessProps) {
  const [stage, setStage] = useState<ProcessStage>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(150);
  const [isRecording, setIsRecording] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSavingAnswer, setIsSavingAnswer] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [messages, setMessages] = useState<(AIMessage | { id: string; content: string; isVisible: boolean; isNew: boolean; isUser: boolean })[]>([]);
  const [questionCards, setQuestionCards] = useState<QuestionCard[]>([]); // Оставляем для совместимости
  const [userResponse, setUserResponse] = useState(''); // Оставляем для совместимости
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isAISpeaking, setIsAISpeaking] = useState(true);
  const [showMicrophoneCard, setShowMicrophoneCard] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState<number | null>(jobPosition?.questionsCount || null);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState<number | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<any | null>(null);
  const [answerTimeSec, setAnswerTimeSec] = useState<number>(150);
  
  // Состояние для ошибок
  const [error, setError] = useState<string | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const skipQuestionFnRef = useRef<(() => void) | null>(null);
  const isStopInProgressRef = useRef<boolean>(false);

  // Аудио воспроизведение welcome-сообщений из API
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const welcomeQueueRef = useRef<{ id: string; text: string; audioUrl?: string }[]>([]);
  const completionQueueRef = useRef<{ id: string; text: string; audioUrl?: string }[]>([]);
  const testMessageRef = useRef<{ text?: string; audioUrl?: string } | null>(null);
  const positiveResponsesRef = useRef<{ text?: string; audioUrl?: string }[]>([]);
  const negativeResponsesRef = useRef<{ text?: string; audioUrl?: string }[]>([]);
  const additionalQuestionsRef = useRef<{ question?: string; answer?: string }[]>([]);
  const currentQuestionIdRef = useRef<number | null>(null);

  // interviewId теперь приходит из пропсов (Single Page)

  // Функция для показа ошибки и блокировки интервью
  const showError = useCallback((errorMessage: string) => {
    console.error('❌ API Error:', errorMessage);
    setError(errorMessage);
    setIsErrorModalOpen(true);
    setIsAISpeaking(false);
    setIsTranscribing(false);
    setIsSavingAnswer(false);
    setIsRecording(false);
  }, []);

  // Функция для скрытия ошибки
  const hideError = useCallback(() => {
    setError(null);
    setIsErrorModalOpen(false);
  }, []);

  // Функция для повторной попытки загрузки данных
  const retryLoading = useCallback(() => {
    hideError();
    // Сохраняем текущий путь и перезагружаем страницу
    const currentPath = window.location.pathname;
    window.location.href = currentPath;
  }, [hideError]);

  // НАДЕЖНАЯ функция автоскролла с несколькими попытками
  const scrollToBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scroll = () => { container.scrollTop = container.scrollHeight; };
    scroll();
    requestAnimationFrame(scroll);
    setTimeout(scroll, 50);
    setTimeout(scroll, 200);
  }, []);

  // Initialize welcome messages from API with audio sequencing
  useEffect(() => {
    let isCancelled = false;
    const loadAndPlayWelcome = async () => {
      try {
        setIsAISpeaking(true);
        setShowMicrophoneCard(false);
        setMessages([]);
        
        // Загружаем данные интервью напрямую из API (Single Page, без localStorage)
        const resp = await apiClient.candidates.getInterviewData(interviewId);
        
        if (isCancelled) return;
        setInitialData(resp.data);
        const items = ((resp.data as any)?.welcome?.messages || []).map((m: any, idx: number) => ({ id: `welcome-${idx}`, text: m.text || '', audioUrl: m.audioUrl }));
        welcomeQueueRef.current = items;
        testMessageRef.current = (resp.data as any)?.test?.testMessage || null;
        positiveResponsesRef.current = (resp.data as any)?.test?.testPositiveResponses || [];
        negativeResponsesRef.current = (resp.data as any)?.test?.testNegativeResponses || [];
        completionQueueRef.current = (((resp.data as any)?.completion?.messages) || []).map((m: any, idx: number) => ({ id: `completion-${idx}`, text: m?.text || '', audioUrl: m?.audioUrl }));
        additionalQuestionsRef.current = ((resp.data as any)?.additionalQuestions || []) as any[];
        
        // answerTime из interview секции (секунды) с фолбэком 150
        const answerTime = Number(((resp.data as any)?.interview?.answerTime)) || 150;
        setAnswerTimeSec(answerTime);
        setTimeRemaining(answerTime);

        const playIndex = async (index: number) => {
          if (isCancelled) return;
          if (index >= welcomeQueueRef.current.length) {
            const microphoneCard = { 
              id: 'microphone-card', 
              content: 'microphone-card', 
              isVisible: true, 
              isNew: true,
              type: 'microphone-card'
            } as any;
            setMessages(prev => [...prev, microphoneCard]);
            setShowMicrophoneCard(true);
            setIsAISpeaking(false);
            const t = testMessageRef.current;
            if (t?.text || t?.audioUrl) {
              setTimeout(async () => {
                if (t?.text) {
                  const id = `test-msg`;
                  setMessages(prev => [...prev, { id, content: t.text!, isVisible: true, isNew: true } as any]);
                  setTimeout(() => setMessages(prev => prev.map(m => (m.id === id ? { ...m, isNew: false } : m))), 500);
                  scrollToBottom();
                }
                if (t?.audioUrl) {
                  try {
                    const fullUrl = getFullAudioUrl(t.audioUrl);
                    logAudioUrl(t.audioUrl, fullUrl, 'InterviewProcess:TestMessage');
                    if (audioRef.current) audioRef.current.pause();
                    const audio = new Audio(fullUrl);
                    audioRef.current = audio;
                    setIsAISpeaking(true);
                    audio.onended = () => { setIsAISpeaking(false); };
                    audio.onerror = () => { setIsAISpeaking(false); };
                    await audio.play();
                  } catch {
                    setIsAISpeaking(false);
                  }
                }
              }, 1000);
            }
            setTimeout(() => scrollToBottom(), 10);
            setTimeout(() => scrollToBottom(), 100);
            setTimeout(() => scrollToBottom(), 300);
            return;
          }

          const item = welcomeQueueRef.current[index];
          setMessages(prev => [...prev, { id: item.id, content: item.text, isVisible: true, isNew: true } as any]);
          setTimeout(() => setMessages(prev => prev.map(m => (m.id === item.id ? { ...m, isNew: false } : m))), 500);
          scrollToBottom();
          if (item.audioUrl) {
            try {
              const fullUrl = getFullAudioUrl(item.audioUrl);
              logAudioUrl(item.audioUrl, fullUrl, 'InterviewProcess:Welcome');
              if (audioRef.current) audioRef.current.pause();
              const audio = new Audio(fullUrl);
              audioRef.current = audio;
              setIsAISpeaking(true);
              audio.onended = () => { setIsAISpeaking(false); playIndex(index + 1); };
              audio.onerror = () => { setIsAISpeaking(false); playIndex(index + 1); };
              await audio.play();
            } catch {
              setIsAISpeaking(false);
              playIndex(index + 1);
            }
          } else {
            setIsAISpeaking(false);
            playIndex(index + 1);
          }
        };

        playIndex(0);
      } catch (e: any) {
        const errorMessage = e?.response?.data?.message || e?.message || 'Ошибка загрузки данных интервью';
        showError(errorMessage);
      }
    };

    loadAndPlayWelcome();
    return () => { isCancelled = true; };
  }, [interviewId, scrollToBottom, showError]);

  // Простой автоскролл при изменении контента
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);



  // Timer logic — moved below to avoid using handlers before declaration

  const addQuestionCard = useCallback((questionIndex: number, textOverride?: string) => {
    console.log(`➕ Adding question card ${questionIndex + 1}`);
    const base = createQuestionCard(questionIndex, [], answerTimeSec);
    const newQuestionCard = { ...base, text: textOverride ?? base.text } as QuestionCard;
    setQuestionCards(prev => {
      const id = `question-card-${Math.max(0, questionIndex)}`;
      if (prev.some(card => card.id === id)) {
        console.log('🔁 Skip adding duplicate question card', { id });
        return prev;
      }
      return [...prev, newQuestionCard];
    });
    
    // Добавляем question card в сообщения
    const questionCardMsg = { 
      id: `question-card-${questionIndex}`, 
      content: `question-card-${questionIndex}`, 
      isVisible: true, 
      isNew: true,
      type: 'question-card',
      questionCard: newQuestionCard
    } as any;
    setMessages(prev => [...prev, questionCardMsg]);
    
    // Агрессивный скролл после добавления карточки
    setTimeout(() => scrollToBottom(), 10);
    setTimeout(() => scrollToBottom(), 100);
    setTimeout(() => scrollToBottom(), 300);
    
    setTimeout(() => {
      setQuestionCards(prev => prev.map(card =>
        card.id === newQuestionCard.id ? { ...card, isNew: false } : card
      ));
      setMessages(prev => prev.map(msg => 
        msg.id === `question-card-${questionIndex}` ? { ...msg, isNew: false } : msg
      ));
    }, 500);
  }, [answerTimeSec, scrollToBottom]);

  const completeQuestion = useCallback((questionIndex: number) => {
    console.log(`✅ Completing question ${questionIndex + 1}`);
    setQuestionCards(prev => markQuestionAsCompleted(prev, questionIndex));
  }, []);

  // Event handlers
  const { isRecording: isRec, startRecording, stopRecording, audioBlob, clearAudio } = useAudioRecording();
  const [isPendingMicUpload, setIsPendingMicUpload] = useState(false);

  const handleMicrophoneTest = useCallback(() => {
    console.log('🎤 Starting microphone test');
    setStage('recording-test');
    setIsRecording(true);
    void startRecording();
    setIsAISpeaking(false);
    

    
    // Агрессивный скролл после добавления сообщения
    setTimeout(() => scrollToBottom(), 10);
    setTimeout(() => scrollToBottom(), 100);
    setTimeout(() => scrollToBottom(), 300);
  }, []);

  const handleContinueToInstructions = useCallback(() => {
    console.log('📋 Opening instructions modal');
    setShowContinueButton(false);
    setIsInstructionsModalOpen(true);
  }, []);

  const handleStopMicrophoneTest = useCallback(async () => {
    if (isStopInProgressRef.current) { return; }
    isStopInProgressRef.current = true;
    console.log('⏹️ Stopping microphone test');
    setIsRecording(false);
    try {
      stopRecording();
    } catch {}
    setIsTranscribing(true);
    // Включаем реактивное ожидание появления blob и отправки
    setIsPendingMicUpload(true);
  }, [audioBlob, clearAudio, interviewId, scrollToBottom, stopRecording, showError]);

  // Реактивная отправка тестовой записи, когда blob готов
  useEffect(() => {
    const upload = async () => {
      if (!isPendingMicUpload || !audioBlob) return;
      try {
        let resp: any = { data: {} };
        const fileType = audioBlob.type || 'audio/webm';
        const fileExt = fileType.includes('wav') ? 'wav' : (fileType.includes('ogg') ? 'ogg' : 'webm');

        const file = new File([audioBlob], `mic-test.${fileExt}`, { type: fileType });
        resp = await apiClient.candidates.testMicrophone(interviewId, file);
        setIsTranscribing(false);

        // Сообщение пользователю
        const userMsg = { id: 'user-response', content: 'Тестовая запись отправлена', isVisible: true, isNew: true, isUser: true } as any;
        setMessages(prev => [...prev, userMsg]);
        setTimeout(() => scrollToBottom(), 10);

        const isOk = (resp.data as any)?.isReadyForInterview === true;
        const responses = isOk ? positiveResponsesRef.current : negativeResponsesRef.current;

        // Проигрываем все сообщения из responses по очереди
        const playResponses = async (idx: number) => {
          if (idx >= responses.length) {
            // Все сообщения проиграны
            if (!isOk) {
              setStage('welcome');
              setShowMicrophoneCard(true);
            } else {
              setShowContinueButton(true);
            }
            return;
          }

          const item = responses[idx];
          if (item?.text) {
            const id = `test-feedback-${idx}-${Date.now()}`;
            setMessages(prev => [...prev, { id, content: item.text!, isVisible: true, isNew: true } as any]);
            setTimeout(() => setMessages(prev => prev.map(m => (m.id === id ? { ...m, isNew: false } : m))), 500);
            scrollToBottom();
          }

          if (item?.audioUrl) {
            try {
              const fullUrl = getFullAudioUrl(item.audioUrl);
              logAudioUrl(item.audioUrl, fullUrl, 'InterviewProcess:TestFeedback');
              if (audioRef.current) audioRef.current.pause();
              const audio = new Audio(fullUrl);
              audioRef.current = audio;
              setIsAISpeaking(true);
              audio.onended = () => { 
                setIsAISpeaking(false); 
                playResponses(idx + 1);
              };
              audio.onerror = () => { 
                setIsAISpeaking(false); 
                playResponses(idx + 1);
              };
              await audio.play();
            } catch {
              setIsAISpeaking(false);
              playResponses(idx + 1);
            }
          } else {
            // Нет аудио - переходим к следующему сообщению через небольшую паузу
            setTimeout(() => {
              playResponses(idx + 1);
            }, 800);
          }
        };

        // Запускаем проигрывание всех сообщений
        playResponses(0);
      } catch (e: any) {
        setIsTranscribing(false);
        const errorMessage = e?.response?.data?.message || e?.message || 'Ошибка тестирования микрофона';
        showError(errorMessage);
      } finally {
        setIsPendingMicUpload(false);
        clearAudio();
        isStopInProgressRef.current = false;
      }
    };
    void upload();
  }, [isPendingMicUpload, audioBlob, interviewId, clearAudio, scrollToBottom, showError]);

  const handleStartInterview = useCallback(async () => {
    console.log('🚀 Starting interview');
    setIsInstructionsModalOpen(false);
    setStage('question');
    setTimeRemaining(answerTimeSec);
    setCurrentQuestionIndex(0);
    setIsAISpeaking(true);
    setTimerStarted(false); // Запускаем таймер после озвучки вопроса

    try {
      await apiClient.candidates.startInterview(interviewId);
    } catch (e: any) {
      // При ошибке запуска интервью показываем ошибку и блокируем продолжение
      const errorMessage = e?.response?.data?.message || e?.message || 'Ошибка запуска интервью';
      showError(errorMessage);
      return;
    }

    const fetchAndPlay = async () => {
      try {
        const { data } = await apiClient.candidates.getCurrentQuestion(interviewId);
        if (!data || !data.questionId) {
          try { await apiClient.candidates.endInterview(interviewId); } catch {}
          const playCompletion = async (idx: number) => {
            if (idx >= completionQueueRef.current.length) {
              // После completion переходим к candidate-questions без автозаливки в чат
              setStage('candidate-questions');
              return;
            }
            const item = completionQueueRef.current[idx];
            setMessages(prev => [...prev, { id: item.id, content: item.text, isVisible: true, isNew: true } as any]);
            setTimeout(() => setMessages(prev => prev.map(m => (m.id === item.id ? { ...m, isNew: false } : m))), 500);
            scrollToBottom();
            if (item.audioUrl) {
              try {
                const fullUrl = getFullAudioUrl(item.audioUrl);
                logAudioUrl(item.audioUrl, fullUrl, 'InterviewProcess:Completion');
                if (audioRef.current) audioRef.current.pause();
                const audio = new Audio(fullUrl);
                audioRef.current = audio;
                setIsAISpeaking(true);
                audio.onended = () => { setIsAISpeaking(false); playCompletion(idx + 1); };
                audio.onerror = () => { setIsAISpeaking(false); playCompletion(idx + 1); };
                await audio.play();
              } catch {
                setIsAISpeaking(false);
                playCompletion(idx + 1);
              }
            } else {
              setIsAISpeaking(false);
              playCompletion(idx + 1);
            }
          };
          playCompletion(0);
          return;
        }

        // ВАЖНО: сначала фиксируем идентификатор текущего вопроса
        setCurrentQuestionId(data.questionId || null);
        currentQuestionIdRef.current = (data.questionId as any) ?? null;
        console.log('🆔 Set currentQuestionId from getCurrentQuestion:', currentQuestionIdRef.current);

        const qNum = ((data as any).index ?? 1) - 1;
        setCurrentQuestionNumber((data as any).index || 1);
        setTotalQuestions((data as any).total || null);
        setCurrentQuestionIndex(Math.max(0, qNum));
        addQuestionCard(Math.max(0, qNum), data.text || '');
        const cardId = `question-card-${Math.max(0, qNum)}`;
        setTimeout(() => setQuestionCards(prev => prev.map(card => card.id === cardId ? { ...card, isNew: false } : card)), 500);
        scrollToBottom();

        if (data.audioUrl) {
          try {
            const fullUrl = getFullAudioUrl(data.audioUrl);
            logAudioUrl(data.audioUrl, fullUrl, 'InterviewProcess:Question');
            if (audioRef.current) audioRef.current.pause();
            const audio = new Audio(fullUrl);
            audioRef.current = audio;
            setIsAISpeaking(true);
            audio.onended = () => { setIsAISpeaking(false); setTimerStarted(true); };
            audio.onerror = () => { setIsAISpeaking(false); setTimerStarted(true); };
            await audio.play();
          } catch { setIsAISpeaking(false); setTimerStarted(true); }
        } else {
          setIsAISpeaking(false);
          setTimerStarted(true);
        }
      } catch (e: any) {
        const errorMessage = e?.response?.data?.message || e?.message || 'Ошибка получения вопроса';
        showError(errorMessage);
      }
    };

    fetchAndPlay();
  }, [addQuestionCard, interviewId, scrollToBottom, showError]);

  const handleRecordAnswer = useCallback(() => {
    console.log('🎙️ Starting to record answer for question', currentQuestionIndex + 1);
    setStage('recording-answer');
    setIsRecording(true);
    setIsAISpeaking(false);
    void startRecording();
    // НЕ трогаем таймер - он должен продолжать работать как есть
  }, [currentQuestionIndex, startRecording]);

  const handleSkipQuestion = useCallback(async () => {
    console.log(`⏭️ Skipping question ${currentQuestionIndex + 1}`, {
      interviewId,
      currentQuestionId: currentQuestionIdRef.current,
      reason: 'user_action_or_timeout'
    });
    completeQuestion(currentQuestionIndex);
    setTimerStarted(false);
    setTimeRemaining(answerTimeSec);
    try {
      if (currentQuestionIdRef.current != null) {
        console.log('📤 submitAnswer(skip=true) → sending', {
          interviewId,
          questionId: currentQuestionIdRef.current,
          skip: true
        });
        await apiClient.candidates.submitAnswer(interviewId, currentQuestionIdRef.current, true);
        console.log('✅ submitAnswer(skip=true) → success');
      } else {
        console.warn('⚠️ Cannot submit skip: currentQuestionId is null');
      }
    } catch (e: any) {
      const errorMessage = e?.response?.data?.message || e?.message || 'Ошибка отправки ответа';
      console.error('❌ submitAnswer(skip=true) failed:', errorMessage, e);
      showError(errorMessage);
      return;
    }

    try {
      console.log('🔄 Fetching next question after skip', { interviewId });
      const { data } = await apiClient.candidates.getCurrentQuestion(interviewId);
      console.log('📥 getCurrentQuestion →', data);
      if (!data || !data.questionId) {
        console.log('🏁 No more questions, ending interview', { interviewId });
        try { await apiClient.candidates.endInterview(interviewId); } catch {}
        const playCompletion = async (idx: number) => {
          if (idx >= completionQueueRef.current.length) {
            // Переход к candidate-questions без автозаливки
            setStage('candidate-questions');
            return;
          }
          const item = completionQueueRef.current[idx];
          setMessages(prev => [...prev, { id: item.id, content: item.text, isVisible: true, isNew: true } as any]);
          setTimeout(() => setMessages(prev => prev.map(m => (m.id === item.id ? { ...m, isNew: false } : m))), 500);
          scrollToBottom();
          if (item.audioUrl) {
            try {
              const fullUrl = getFullAudioUrl(item.audioUrl);
              logAudioUrl(item.audioUrl, fullUrl, 'InterviewProcess:Completion');
              if (audioRef.current) audioRef.current.pause();
              const audio = new Audio(fullUrl);
              audioRef.current = audio;
              setIsAISpeaking(true);
              audio.onended = () => { setIsAISpeaking(false); playCompletion(idx + 1); };
              audio.onerror = () => { setIsAISpeaking(false); playCompletion(idx + 1); };
              await audio.play();
            } catch {
              setIsAISpeaking(false);
              playCompletion(idx + 1);
            }
          } else {
            setIsAISpeaking(false);
            playCompletion(idx + 1);
          }
        };
        playCompletion(0);
        return;
      }

      setCurrentQuestionId(data.questionId || null);
      currentQuestionIdRef.current = (data.questionId as any) ?? null;
      console.log('🆔 Set currentQuestionId from getCurrentQuestion (after skip):', currentQuestionIdRef.current);
      const qNumber = (((data as any).index ?? (currentQuestionIndex + 2)) as number) - 1;
      setCurrentQuestionNumber((data as any).index || (qNumber + 1));
      setTotalQuestions((data as any).total || totalQuestions);
      setCurrentQuestionIndex(Math.max(0, qNumber));
      addQuestionCard(Math.max(0, qNumber), data.text || '');
      const cardId = `question-card-${Math.max(0, qNumber)}`;
      setTimeout(() => setQuestionCards(prev => prev.map(card => card.id === cardId ? { ...card, isNew: false } : card)), 500);
      scrollToBottom();

      // Важно: переходим в стадию вопроса, чтобы кнопки отрисовались
      setStage('question');

      setIsAISpeaking(false);
      setTimerStarted(false);
      setTimeRemaining(answerTimeSec);
      if (data.audioUrl) {
        try {
          const fullUrl = getFullAudioUrl(data.audioUrl);
          logAudioUrl(data.audioUrl, fullUrl, 'InterviewProcess:Question');
          if (audioRef.current) audioRef.current.pause();
          const audio = new Audio(fullUrl);
          audioRef.current = audio;
          setIsAISpeaking(true);
          audio.onended = () => { setIsAISpeaking(false); setTimerStarted(true); };
          audio.onerror = () => { setIsAISpeaking(false); setTimerStarted(true); };
          await audio.play();
        } catch { setIsAISpeaking(false); setTimerStarted(true); }
      } else { setTimerStarted(true); }
    } catch (e: any) {
      const errorMessage = e?.response?.data?.message || e?.message || 'Ошибка получения следующего вопроса';
      console.error('❌ getCurrentQuestion after skip failed:', errorMessage, e);
      showError(errorMessage);
    }
  }, [currentQuestionIndex, completeQuestion, addQuestionCard, interviewId, totalQuestions, scrollToBottom, showError]);

  // Даем таймеру доступ к логике пропуска
  useEffect(() => {
    skipQuestionFnRef.current = () => { void handleSkipQuestion(); };
  }, [handleSkipQuestion]);

  const handleStopRecording = useCallback(() => {
    if (isStopInProgressRef.current || isSavingAnswer || isTranscribing) {
      console.log('⏹️ Stop ignored: in-progress');
      return;
    }
    isStopInProgressRef.current = true;
    console.log('⏹️ Stopping recording for question', currentQuestionIndex + 1, {
      interviewId,
      currentQuestionId: currentQuestionIdRef.current,
      stage
    });
    setIsRecording(false);
    setIsTranscribing(true);
    setIsSavingAnswer(true);

    stopRecording()
      .then((blob) => {
        if (!currentQuestionIdRef.current) {
          throw new Error('Не удалось определить вопрос для ответа');
        }
        if (!blob || blob.size === 0) {
          throw new Error('Аудиозапись пустая');
        }
        const fileType = blob.type || 'audio/webm';
        const fileExt = fileType.includes('wav') ? 'wav' : (fileType.includes('ogg') ? 'ogg' : 'webm');
        const file = new File([blob], `answer.${fileExt}`, { type: fileType });
        console.log('📤 submitAnswer(skip=false) → sending', {
          interviewId,
          questionId: currentQuestionIdRef.current,
          skip: false,
          fileType: file.type,
          fileSize: file.size
        });
        return apiClient.candidates.submitAnswer(interviewId, currentQuestionIdRef.current, false, file);
      })
      .then((resp: any) => {
        console.log('✅ submitAnswer(skip=false) → success', resp?.data);
        setIsSavingAnswer(false);
        setIsTranscribing(false);
        completeQuestion(currentQuestionIndex);
        // Если API явно говорит, что следующего вопроса нет — запускаем completion без лишнего запроса
        if (resp && resp.data && resp.data.nextQuestion === false) {
          console.log('🏁 nextQuestion=false in submitAnswer response — finishing interview');
          // Остановка таймера немедленно, чтобы не тикал во время completion
          setTimerStarted(false);
          const playCompletion = (idx: number): Promise<void> => {
            if (idx >= completionQueueRef.current.length) {
              // Переход к candidate-questions без автозаливки
              setStage('candidate-questions');
              return Promise.resolve();
            }
            const item = completionQueueRef.current[idx];
            setMessages(prev => [...prev, { id: item.id, content: item.text, isVisible: true, isNew: true } as any]);
            setTimeout(() => setMessages(prev => prev.map(m => (m.id === item.id ? { ...m, isNew: false } : m))), 500);
            scrollToBottom();
            if (item.audioUrl) {
              try {
                const fullUrl = getFullAudioUrl(item.audioUrl);
                logAudioUrl(item.audioUrl, fullUrl, 'InterviewProcess:Completion');
                if (audioRef.current) audioRef.current.pause();
                const audio = new Audio(fullUrl);
                audioRef.current = audio;
                setIsAISpeaking(true);
                return new Promise<void>((resolve) => {
                  audio.onended = () => { setIsAISpeaking(false); void playCompletion(idx + 1).then(resolve); };
                  audio.onerror = () => { setIsAISpeaking(false); void playCompletion(idx + 1).then(resolve); };
                  audio.play().catch(() => { setIsAISpeaking(false); void playCompletion(idx + 1).then(resolve); });
                });
              } catch {
                setIsAISpeaking(false);
                return playCompletion(idx + 1);
              }
            } else {
              setIsAISpeaking(false);
              return playCompletion(idx + 1);
            }
          };
          return apiClient.candidates.endInterview(interviewId)
            .catch(() => undefined)
            .then(() => playCompletion(0))
            .then(() => null as any); // Явно возвращаем null, чтобы следующий then пропустил обработку
        }
        console.log('🔄 Fetching next question after answer', { interviewId });
        return apiClient.candidates.getCurrentQuestion(interviewId);
      })
      .then((resp: any) => {
        // Если предыдущая ветка уже завершила интервью, ничего не делаем
        if (!resp || !resp.data) {
          return undefined;
        }
        const { data } = resp;
        console.log('📥 getCurrentQuestion →', data);
        if (!data || !data.questionId) {
          console.log('🏁 No more questions, ending interview', { interviewId });
          // Проигрываем completion-сообщения по аналогии с пропуском
          const playCompletion = (idx: number): Promise<void> => {
            if (idx >= completionQueueRef.current.length) {
              // Переход к candidate-questions без автозаливки
              setStage('candidate-questions');
              return Promise.resolve();
            }
            const item = completionQueueRef.current[idx];
            setMessages(prev => [...prev, { id: item.id, content: item.text, isVisible: true, isNew: true } as any]);
            setTimeout(() => setMessages(prev => prev.map(m => (m.id === item.id ? { ...m, isNew: false } : m))), 500);
            scrollToBottom();
            if (item.audioUrl) {
              try {
                const fullUrl = getFullAudioUrl(item.audioUrl);
                logAudioUrl(item.audioUrl, fullUrl, 'InterviewProcess:Completion');
                if (audioRef.current) audioRef.current.pause();
                const audio = new Audio(fullUrl);
                audioRef.current = audio;
                setIsAISpeaking(true);
                return new Promise<void>((resolve) => {
                  audio.onended = () => { setIsAISpeaking(false); void playCompletion(idx + 1).then(resolve); };
                  audio.onerror = () => { setIsAISpeaking(false); void playCompletion(idx + 1).then(resolve); };
                  audio.play().catch(() => { setIsAISpeaking(false); void playCompletion(idx + 1).then(resolve); });
                });
              } catch {
                setIsAISpeaking(false);
                return playCompletion(idx + 1);
              }
            } else {
              setIsAISpeaking(false);
              return playCompletion(idx + 1);
            }
          };
          return apiClient.candidates.endInterview(interviewId)
            .catch(() => undefined)
            .then(() => playCompletion(0));
        }
        setCurrentQuestionId(data.questionId || null);
        currentQuestionIdRef.current = (data.questionId as any) ?? null;
        console.log('🆔 Set currentQuestionId from getCurrentQuestion (after answer):', currentQuestionIdRef.current);
        const qNumber = (((data as any).index ?? (currentQuestionIndex + 2)) as number) - 1;
        setCurrentQuestionNumber((data as any).index || (qNumber + 1));
        setTotalQuestions((data as any).total || totalQuestions);
        setCurrentQuestionIndex(Math.max(0, qNumber));
        addQuestionCard(Math.max(0, qNumber), data.text || '');
        const cardId = `question-card-${Math.max(0, qNumber)}`;
        setTimeout(() => setQuestionCards(prev => prev.map(card => card.id === cardId ? { ...card, isNew: false } : card)), 500);
        scrollToBottom();
        setStage('question');
        setTimerStarted(false);
        setTimeRemaining(answerTimeSec);
        // Если у следующего вопроса есть аудио — воспроизводим его и запускаем таймер по окончании, иначе сразу стартуем таймер
        if (data.audioUrl) {
          try {
            const fullUrl = getFullAudioUrl(data.audioUrl);
            logAudioUrl(data.audioUrl, fullUrl, 'InterviewProcess:Question');
            if (audioRef.current) audioRef.current.pause();
            const audio = new Audio(fullUrl);
            audioRef.current = audio;
            setIsAISpeaking(true);
            audio.onended = () => { setIsAISpeaking(false); setTimerStarted(true); };
            audio.onerror = () => { setIsAISpeaking(false); setTimerStarted(true); };
            audio.play().catch(() => { setIsAISpeaking(false); setTimerStarted(true); });
          } catch {
            setIsAISpeaking(false);
            setTimerStarted(true);
          }
        } else {
          setTimerStarted(true);
        }
        return undefined;
      })
      .catch((e: any) => {
        const errorMessage = e?.response?.data?.message || e?.message || 'Ошибка отправки ответа';
        console.error('❌ submitAnswer(chain) failed:', errorMessage, e);
        showError(errorMessage);
      })
      .finally(() => {
        setIsSavingAnswer(false);
        setIsTranscribing(false);
        isStopInProgressRef.current = false;
      });
  }, [currentQuestionIndex, interviewId, stopRecording, showError, scrollToBottom, completeQuestion, totalQuestions, addQuestionCard]);

  const handleCandidateQuestionsComplete = useCallback(() => {
    console.log('🎉 Interview completed');
    setIsAISpeaking(false);
  }, []);

  // Добавляем AI сообщение в чат
  const handleAddAiMessage = useCallback((content: string) => {
    const msg = { 
      id: `ai-${Date.now()}`, 
      content, 
      isVisible: true, 
      isNew: true 
    } as AIMessage;
    setMessages(prev => [...prev, msg]);
    
    // Агрессивный скролл после добавления сообщения
    setTimeout(() => scrollToBottom(), 10);
    setTimeout(() => scrollToBottom(), 100);
    setTimeout(() => scrollToBottom(), 300);
    
    setTimeout(() => {
      setMessages(prev => prev.map(m => (m.id === msg.id ? { ...m, isNew: false } : m)));
    }, 500);
  }, [scrollToBottom]);

  // Добавляем пользовательское сообщение в чат
  const handleAddUserMessage = useCallback((content: string) => {
    const msg = { 
      id: `user-${Date.now()}`, 
      content, 
      isVisible: true, 
      isNew: true, 
      isUser: true 
    } as any;
    setMessages(prev => [...prev, msg]);
    
    // Агрессивный скролл после добавления сообщения
    setTimeout(() => scrollToBottom(), 10);
    setTimeout(() => scrollToBottom(), 100);
    setTimeout(() => scrollToBottom(), 300);
    
    setTimeout(() => {
      setMessages(prev => prev.map(m => (m.id === msg.id ? { ...m, isNew: false } : m)));
    }, 500);
  }, [scrollToBottom]);

  // Обработка AI речи для candidate-questions этапа
  useEffect(() => {
    if (stage === 'candidate-questions') {
      console.log('💬 Starting candidate questions phase');
      setIsAISpeaking(true);
      
      const speakingTimer = setTimeout(() => {
        setIsAISpeaking(false);
      }, 8000);
      
      return () => clearTimeout(speakingTimer);
    }
  }, [stage]);

  const handleAISpeakingChange = useCallback((isSpeaking: boolean) => {
    setIsAISpeaking(isSpeaking);
  }, []);

  const handleNewMessage = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  // Timer logic (placed after handlers to avoid use-before-declare)
  useEffect(() => {
    if ((stage === 'question' || stage === 'recording-answer') && timerStarted && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          console.log(`⏰ Timer tick: ${newTime} seconds remaining`, { stage, timerStarted });
        setQuestionCards(prev => updateQuestionTime(prev, newTime));
          return newTime;
        });
      }, 1000);
    } else if (timeRemaining === 0 && (stage === 'question' || stage === 'recording-answer') && timerStarted) {
      // Время истекло — если запись идёт, автоматически останавливаем запись и отправляем ответ; иначе пропуск
      console.log('⏰ Time up for question', currentQuestionIndex + 1, {
        interviewId,
        currentQuestionId,
        stage,
      });
      // Отключаем таймер, чтобы избежать повторных вызовов
      setTimerStarted(false);
      if (stage === 'recording-answer') {
        console.log('⏹️ Auto-stopping recording due to timeout');
        // Останавливаем запись и инициируем отправку ответа
        handleStopRecording();
      } else {
        if (skipQuestionFnRef.current) {
          console.log('⏭️ Calling skipQuestion() due to time up');
          skipQuestionFnRef.current();
        } else {
          console.warn('⚠️ skipQuestionFnRef is not set');
        }
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeRemaining, stage, timerStarted, currentQuestionIndex, handleStopRecording]);

  // Debug info for current state
  console.log('🎯 Current state:', {
    stage,
    currentQuestionIndex,
    isRecording,
    isTranscribing,
    isSavingAnswer,
    isAISpeaking,
    timerStarted,
    timeRemaining
  });

  // Функция для определения, нужно ли показывать аватар
  const shouldShowAvatar = () => {
    // Показываем аватар когда AI говорит
    if (isAISpeaking && !isTranscribing && !isSavingAnswer) {
      return true;
    }
    
    // Показываем аватар в состоянии молчания на этапе candidate-questions
    if (stage === 'candidate-questions' && !isTranscribing && !isSavingAnswer) {
      return true;
    }
    
    return false;
  };

  // Единый рендеринг всех сообщений
  const renderMessages = () => {
    return (
      <div className="flex flex-col space-y-4">
        {messages.map((message) => (
          message.isVisible && (
            <div key={message.id}>
              {('type' in message && message.type === 'microphone-card') ? (
                <div className="flex justify-start">
                  <MicrophoneTestCard />
                </div>
              ) : ('type' in message && message.type === 'reading-card') ? (
                <div className="flex justify-start">
                  <ReadingTestCard />
                </div>
              ) : ('type' in message && message.type === 'question-card' && 'questionCard' in message) ? (
                <div key={(message.questionCard as any).id}>
                  <QuestionProgressIndicator questionIndex={(message.questionCard as any).questionIndex} />
                                     <QuestionCardComponent 
                     questionCard={{
                       ...(message.questionCard as any),
                       timeRemaining: (message.questionCard as any).questionIndex === currentQuestionIndex && (stage === 'question' || stage === 'recording-answer') ? timeRemaining : null,
                       status: (message.questionCard as any).questionIndex === currentQuestionIndex && (stage === 'question' || stage === 'recording-answer') ? 'active' : 'completed'
                     }} 
                   />
                </div>
              ) : (
                <div className={`flex ${('isUser' in message && message.isUser) ? 'justify-end' : 'justify-start'}`}>
                  {message.id === 'test-msg' ? (
                    <ReadingTestCard />
                  ) : (
                    <MessageBubble 
                      content={message.content} 
                      isNew={message.isNew} 
                      isUser={'isUser' in message ? message.isUser : false}
                    />
                  )}
                </div>
              )}
            </div>
          )
        ))}
        
        {/* Показываем CandidateQuestions только на соответствующем этапе */}
        {stage === 'candidate-questions' && (
          <CandidateQuestions 
            onComplete={handleCandidateQuestionsComplete}
            onAISpeakingChange={handleAISpeakingChange}
            onNewMessage={handleNewMessage}
            onAddAiMessage={handleAddAiMessage}
            onAddUserMessage={handleAddUserMessage}
            questionsOverride={(additionalQuestionsRef.current || [])
              .map((item, idx) => ({
                id: `api-q-${idx}`,
                question: item?.question || '',
                answer: item?.answer || ''
              }))
              .filter(q => !!q.question)}
          />
        )}
      </div>
    );
  };

  // Render stage content
  const renderStageContent = () => {
    console.log(`🎬 Rendering stage: ${stage}`);
    
    switch (stage) {
      case 'welcome':
      case 'recording-test':
      case 'question':
      case 'recording-answer':
      case 'question-completed':
      case 'candidate-questions':
        return renderMessages();

      default:
        return null;
    }
  };

  // Кастомная кнопка "Остановить запись" по образцу из Figma
  const RecordingButton = () => (
    <button
      onClick={stage === 'recording-answer' ? handleStopRecording : handleStopMicrophoneTest}
      className="bg-[#df1c41] relative rounded-[60px] h-16 w-auto hover:bg-[#c7193a] transition-colors duration-200 pulse-recording"
    >
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start pl-2 pr-8 py-2 relative size-full">
          {/* Белый круг с красным квадратом */}
          <div className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2.5 items-center justify-center overflow-clip p-[8px] relative rounded-[100px] shrink-0 size-12">
            <div className="bg-[#df1c41] rounded shrink-0 size-5" />
          </div>
          {/* Текст */}
          <div className="flex flex-col font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[18px] text-center text-nowrap tracking-[-0.27px]">
            <p className="block leading-[24px] whitespace-pre font-Inter">Остановить запись</p>
          </div>
        </div>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--interview-bg)' }}>
      <div className="w-full h-full flex flex-col">
        <div className="flex flex-col gap-4 p-6 w-full h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between w-full h-16">
            <Logo size="medium" />
            <HelpButton onClick={() => setIsHelpModalOpen(true)} />
          </div>

          {/* Main Content Area - с правильной высотой и z-index */}
          <div 
            className="overflow-hidden relative z-40"
            style={{ 
              height: 'calc(100vh - 64px - 96px - 128px - 48px)', // 100vh - header(64px) - downbar(96px) - footer(128px) - padding(48px)
              maxHeight: 'calc(100vh - 64px - 96px - 128px - 48px)'
            }}
          >
            <div 
              ref={scrollContainerRef}
              className="h-full overflow-y-auto px-6 pb-4 custom-scroll-container"
            >
              <div className="max-w-4xl mx-auto">
                {renderStageContent()}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          {/* Fixed Downbar - с анимацией */}
          <div className="fixed bottom-32 left-0 right-0 pointer-events-none z-50">
            <div className="w-full max-w-2xl mx-auto px-6 pointer-events-auto">
              <AnimatePresence mode="wait">
                {/* AI Avatar */}
                {shouldShowAvatar() && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4 }}
                    className="flex justify-center"
                    key="avatar"
                  >
                    <AIAvatarWithWaves 
                      size={stage === 'question-completed' ? 'small' : 'large'} 
                      isSpeaking={isAISpeaking}
                    />
                  </motion.div>
                )}
                
                {/* Loader */}
                {(isTranscribing || isSavingAnswer) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4 }}
                    className="flex justify-center"
                    key="loader"
                  >
                    <div className="text-white rounded-full h-16 w-16 flex items-center justify-center shadow-lg" style={{ backgroundColor: 'var(--interview-accent)' }}>
                      <Loader2 className="w-12 h-12 animate-spin" strokeWidth={2} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Fixed Footer - с кнопками */}
          <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-50">
            {/* Gradient Background */}
            <div className="bottom-controls-gradient h-32" />
            
            {/* Controls Container */}
            <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
              <div className="w-full max-w-2xl mx-auto px-6 pb-8 pointer-events-auto">
                {/* Action Buttons */}
                <div className="flex justify-center">
                  {/* Welcome Stage */}
                  {stage === 'welcome' && showMicrophoneCard && !isAISpeaking && !isTranscribing && !isSavingAnswer && (
                    <Button
                      onClick={handleMicrophoneTest}
                      className="bg-[var(--interview-accent)] hover:bg-[var(--interview-accent-hover)] text-white px-8 py-4 font-medium shadow-md transition-all duration-200 hover:shadow-lg text-lg"
                      style={{ borderRadius: '30px', height: '56px' }}
                    >
                      Тест микрофона
                    </Button>
                  )}

                  {/* Recording Test Stage */}
                  {stage === 'recording-test' && showContinueButton && !isAISpeaking && !isTranscribing && !isSavingAnswer && (
                    <Button
                      onClick={handleContinueToInstructions}
                      className="bg-[var(--interview-accent)] hover:bg-[var(--interview-accent-hover)] text-white px-8 py-4 font-medium shadow-md transition-all duration-200 hover:shadow-lg text-lg"
                      style={{ borderRadius: '30px', height: '56px' }}
                    >
                      Продолжить
                    </Button>
                  )}

                  {/* Question Stage */}
                  {stage === 'question' && !isAISpeaking && !isRecording && !isTranscribing && !isSavingAnswer && (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={handleRecordAnswer}
                        className="bg-[var(--interview-accent)] hover:bg-[var(--interview-accent-hover)] text-white px-8 py-4 font-medium shadow-md transition-all duration-200 hover:shadow-lg text-lg"
                        style={{ borderRadius: '30px', height: '56px' }}
                      >
                        Записать ответ
                      </Button>
                      <Button
                        onClick={handleSkipQuestion}
                        className="border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 px-8 py-4 font-medium shadow-md transition-all duration-200 bg-white text-lg"
                        style={{ borderRadius: '30px', height: '56px' }}
                      >
                        Пропустить
                      </Button>
                    </div>
                  )}

                  {/* Recording Buttons */}
                  {stage === 'recording-answer' && isRecording && (
                    <RecordingButton />
                  )}
                  {stage === 'recording-test' && isRecording && (
                    <RecordingButton />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HelpModal 
        isOpen={isHelpModalOpen} 
        onClose={() => setIsHelpModalOpen(false)} 
      />

      <InstructionsModal
        isOpen={isInstructionsModalOpen}
        onClose={() => setIsInstructionsModalOpen(false)}
        onStartInterview={handleStartInterview}
        questionsCount={totalQuestions || 3}
        answerTimeSec={answerTimeSec}
      />

      {/* Модальное окно ошибки */}
      {isErrorModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Ошибка</h3>
            </div>
            <p className="text-gray-700 mb-6">{error}</p>
            <div className="flex justify-end space-x-3">
              <Button
                onClick={hideError}
                variant="outline"
                className="px-4 py-2"
              >
                Закрыть
              </Button>
              <Button
                onClick={retryLoading}
                className="px-4 py-2 bg-[#e16349] text-white hover:bg-[#d14a31]"
              >
                Попробовать снова
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
