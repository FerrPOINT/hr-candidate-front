import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from './';
import { HelpModal, HelpButton, WMTLogo } from './';
import { InstructionsModal } from './InstructionsModal';
import { AIAvatarWithWaves } from './AIAvatarWithWaves';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import types and utilities
import { ProcessStage, AIMessage, QuestionCard } from './interview/types';
import { processQuestions, readingText } from './interview/constants';
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

export function InterviewProcess() {
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
  const [totalQuestions, setTotalQuestions] = useState<number | null>(null);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState<number | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<any | null>(null);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const skipQuestionFnRef = useRef<(() => void) | null>(null);

  // Аудио воспроизведение welcome-сообщений из API
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const welcomeQueueRef = useRef<{ id: string; text: string; audioUrl?: string }[]>([]);
  const completionQueueRef = useRef<{ id: string; text: string; audioUrl?: string }[]>([]);
  const testMessageRef = useRef<{ text?: string; audioUrl?: string } | null>(null);
  const positiveResponsesRef = useRef<{ text?: string; audioUrl?: string }[]>([]);
  const negativeResponsesRef = useRef<{ text?: string; audioUrl?: string }[]>([]);
  const additionalQuestionsRef = useRef<{ question?: string; answer?: string }[]>([]);

  // Получаем interviewId из URL (без изменения роутинга)
  const location = useLocation();
  const interviewId = useMemo(() => {
    const parts = location.pathname.split('/');
    const idx = parts.indexOf('interview');
    if (idx !== -1 && parts[idx + 1]) {
      const parsed = parseInt(parts[idx + 1], 10);
      return Number.isFinite(parsed) ? parsed : 1;
    }
    return 1;
  }, [location.pathname]);

  // НАДЕЖНАЯ функция автоскролла с несколькими попытками
  const scrollToBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Несколько попыток скролла для надежности
    const scroll = () => {
      container.scrollTop = container.scrollHeight;
    };

    // Немедленная попытка
    scroll();
    
    // Попытка через requestAnimationFrame
    requestAnimationFrame(scroll);
    
    // Попытка через setTimeout
    setTimeout(scroll, 50);
    
    // Финальная попытка через больший timeout
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
        // Получаем все данные одним запросом
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

        const playIndex = async (index: number) => {
          if (isCancelled) return;
          if (index >= welcomeQueueRef.current.length) {
            // After all messages, show microphone card
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
            // Воспроизводим тестовое сообщение, если есть audioUrl
            const t = testMessageRef.current;
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
            // Scroll updates
            setTimeout(() => scrollToBottom(), 10);
            setTimeout(() => scrollToBottom(), 100);
            setTimeout(() => scrollToBottom(), 300);
            return;
          }

          const item = welcomeQueueRef.current[index];
          setCurrentMessageIndex(index);
          // Show message bubble
          setMessages(prev => [...prev, { id: item.id, content: item.text, isVisible: true, isNew: true } as any]);
          setTimeout(() => setMessages(prev => prev.map(m => (m.id === item.id ? { ...m, isNew: false } : m))), 500);
          scrollToBottom();

          // Play audio if available
          if (item.audioUrl) {
            const fullUrl = getFullAudioUrl(item.audioUrl);
            logAudioUrl(item.audioUrl, fullUrl, 'InterviewProcess:Welcome');
            try {
              if (audioRef.current) {
                audioRef.current.pause();
              }
              const audio = new Audio(fullUrl);
              audioRef.current = audio;
              setIsAISpeaking(true);
              audio.onended = () => {
                setIsAISpeaking(false);
                playIndex(index + 1);
              };
              audio.onerror = () => {
                setIsAISpeaking(false);
                playIndex(index + 1);
              };
              await audio.play();
            } catch (e) {
              setIsAISpeaking(false);
              playIndex(index + 1);
            }
          } else {
            // No audio — proceed immediately
            setIsAISpeaking(false);
            playIndex(index + 1);
          }
        };

        playIndex(0);
      } catch (e) {
        // On failure, don't block UI: show microphone card
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
      }
    };

    loadAndPlayWelcome();
    return () => {
      isCancelled = true;
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current.pause();
      }
    };
  }, [scrollToBottom]);

  // Простой автоскролл при изменении контента
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);



  // Timer logic
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
      // Время истекло — действуем как «пропуск вопроса»
      console.log('⏰ Time up for question', currentQuestionIndex + 1);
      if (skipQuestionFnRef.current) {
        skipQuestionFnRef.current();
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeRemaining, stage, timerStarted, currentQuestionIndex]);

  const addQuestionCard = useCallback((questionIndex: number, textOverride?: string) => {
    console.log(`➕ Adding question card ${questionIndex + 1}`);
    const base = createQuestionCard(questionIndex, processQuestions);
    const newQuestionCard = { ...base, text: textOverride ?? base.text } as QuestionCard;
    setQuestionCards(prev => [...prev, newQuestionCard]);
    
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
  }, []);

  const completeQuestion = useCallback((questionIndex: number) => {
    console.log(`✅ Completing question ${questionIndex + 1}`);
    setQuestionCards(prev => markQuestionAsCompleted(prev, questionIndex));
  }, []);

  // Event handlers
  const { isRecording: isRec, startRecording, stopRecording, audioBlob, clearAudio } = useAudioRecording();

  const handleMicrophoneTest = useCallback(() => {
    console.log('🎤 Starting microphone test');
    setStage('recording-test');
    setIsRecording(true);
    void startRecording();
    setIsAISpeaking(false);
    
    // Добавляем сообщение с просьбой прочитать предложение (появляется после нажатия кнопки)
    const readingMessage = { 
      id: 'reading-message', 
      content: 'Прочитай предложение "Хотите понять других – пристальнее смотрите в самого себя."', 
      isVisible: true, 
      isNew: true
    } as any;
    setMessages(prev => [...prev, readingMessage]);
    
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
    console.log('⏹️ Stopping microphone test');
    setIsRecording(false);
    try {
      stopRecording();
    } catch {}
    setIsTranscribing(true);

    // Дожидаемся появления blob из хука
    const waitForBlob = async (retries = 20): Promise<Blob | null> => {
      for (let i = 0; i < retries; i++) {
        if (audioBlob) return audioBlob;
        await new Promise(r => setTimeout(r, 50));
      }
      return audioBlob || null;
    };
    const blob = await waitForBlob();
    try {
      let resp: any = { data: {} };
      if (blob) {
        const file = new File([blob], 'mic-test.wav', { type: 'audio/wav' });
        resp = await apiClient.candidates.testMicrophone(interviewId, file);
      }
      setIsTranscribing(false);

      // Показываем пользовательское сообщение (эмуляция текста, без аудио)
      if (blob) {
        const userMsg = { 
          id: 'user-response', 
          content: 'Тестовая запись отправлена', 
          isVisible: true, 
          isNew: true, 
          isUser: true 
        } as any;
        setMessages(prev => [...prev, userMsg]);
        setTimeout(() => scrollToBottom(), 10);
      }

      const isOk = (resp.data as any)?.isReadyForInterview === true;
      const responses = isOk ? positiveResponsesRef.current : negativeResponsesRef.current;

      // Проигрываем один ответ из списка (первый), затем, если ok, показываем кнопку продолжения
      const item = responses[0];
      if (item?.text) {
        const id = `test-feedback-${Date.now()}`;
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
          audio.onended = () => { setIsAISpeaking(false); };
          audio.onerror = () => { setIsAISpeaking(false); };
          await audio.play();
        } catch { setIsAISpeaking(false); }
      }

      if (isOk) {
        setShowContinueButton(true);
      } else {
        // Разрешаем повтор теста — просто оставляем кнопку «Тест микрофона» видимой
        setShowMicrophoneCard(true);
      }
      clearAudio();
    } catch (e) {
      setIsTranscribing(false);
      setShowMicrophoneCard(true);
      clearAudio();
    }
  }, [audioBlob, clearAudio, interviewId, scrollToBottom, stopRecording]);

  const handleStartInterview = useCallback(async () => {
    console.log('🚀 Starting interview');
    setIsInstructionsModalOpen(false);
    setStage('question');
    setTimeRemaining(150);
    setCurrentQuestionIndex(0);
    setIsAISpeaking(true);
    setTimerStarted(false); // Запускаем таймер после озвучки вопроса

    try {
      await apiClient.candidates.startInterview(interviewId);
    } catch (e: any) {
      // Показать ошибку и не начинать интервью (без смены экрана)
      setIsAISpeaking(false);
      const errText = e?.message || 'Ошибка запуска интервью';
      setMessages(prev => [...prev, { id: `err-${Date.now()}`, content: errText, isVisible: true, isNew: true } as any]);
      setTimeout(() => setMessages(prev => prev.map(m => m.id.startsWith('err-') ? { ...m, isNew: false } : m)), 500);
      return;
    }

    const fetchAndPlay = async () => {
      try {
        const { data } = await apiClient.candidates.getCurrentQuestion(interviewId);
        if (!data || !data.questionId) {
          try { await apiClient.candidates.endInterview(interviewId); } catch {}
          const playCompletion = async (idx: number) => {
            if (idx >= completionQueueRef.current.length) {
              // После completion — дополнительные вопросы
              const list = additionalQuestionsRef.current || [];
              list.forEach((item, i) => {
                if (item?.question) {
                  const idQ = `add-q-${i}-${Date.now()}`;
                  setMessages(prev => [...prev, { id: idQ, content: item.question!, isVisible: true, isNew: true } as any]);
                  setTimeout(() => setMessages(prev => prev.map(m => (m.id === idQ ? { ...m, isNew: false } : m))), 500);
                }
                if (item?.answer) {
                  const idA = `add-a-${i}-${Date.now()}`;
                  setMessages(prev => [...prev, { id: idA, content: item.answer!, isVisible: true, isNew: true, isUser: true } as any]);
                  setTimeout(() => setMessages(prev => prev.map(m => (m.id === idA ? { ...m, isNew: false } : m))), 500);
                }
              });
              setTimeout(() => scrollToBottom(), 10);
              setTimeout(() => scrollToBottom(), 100);
              setTimeout(() => scrollToBottom(), 300);
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
      } catch {}
    };

    fetchAndPlay();
  }, [addQuestionCard, interviewId, scrollToBottom]);

  const handleRecordAnswer = useCallback(() => {
    console.log('🎙️ Starting to record answer for question', currentQuestionIndex + 1);
    setStage('recording-answer');
    setIsRecording(true);
    setIsAISpeaking(false);
    void startRecording();
    // НЕ трогаем таймер - он должен продолжать работать как есть
  }, [currentQuestionIndex, startRecording]);

  const handleSkipQuestion = useCallback(async () => {
    console.log(`⏭️ Skipping question ${currentQuestionIndex + 1}`);
    completeQuestion(currentQuestionIndex);
    setTimerStarted(false);
    setTimeRemaining(150);
    try {
      if (currentQuestionId != null) {
        // Пропуск: skip=true без аудио
        await apiClient.candidates.submitAnswer(interviewId, currentQuestionId, true);
      }
    } catch {}

    try {
      const { data } = await apiClient.candidates.getCurrentQuestion(interviewId);
      if (!data || !data.questionId) {
        try { await apiClient.candidates.endInterview(interviewId); } catch {}
        const playCompletion = async (idx: number) => {
          if (idx >= completionQueueRef.current.length) {
            const list = additionalQuestionsRef.current || [];
            list.forEach((item, i) => {
              if (item?.question) {
                const idQ = `add-q-${i}-${Date.now()}`;
                setMessages(prev => [...prev, { id: idQ, content: item.question!, isVisible: true, isNew: true } as any]);
                setTimeout(() => setMessages(prev => prev.map(m => (m.id === idQ ? { ...m, isNew: false } : m))), 500);
              }
              if (item?.answer) {
                const idA = `add-a-${i}-${Date.now()}`;
                setMessages(prev => [...prev, { id: idA, content: item.answer!, isVisible: true, isNew: true, isUser: true } as any]);
                setTimeout(() => setMessages(prev => prev.map(m => (m.id === idA ? { ...m, isNew: false } : m))), 500);
              }
            });
            setTimeout(() => scrollToBottom(), 10);
            setTimeout(() => scrollToBottom(), 100);
            setTimeout(() => scrollToBottom(), 300);
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
      const qNumber = (((data as any).index ?? (currentQuestionIndex + 2)) as number) - 1;
      setCurrentQuestionNumber((data as any).index || (qNumber + 1));
      setTotalQuestions((data as any).total || totalQuestions);
      setCurrentQuestionIndex(Math.max(0, qNumber));
      addQuestionCard(Math.max(0, qNumber), data.text || '');
      const cardId = `question-card-${Math.max(0, qNumber)}`;
      setTimeout(() => setQuestionCards(prev => prev.map(card => card.id === cardId ? { ...card, isNew: false } : card)), 500);
      scrollToBottom();

      setIsAISpeaking(false);
      setTimerStarted(false);
      setTimeRemaining(150);
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
        } catch {
          setIsAISpeaking(false);
          setTimerStarted(true);
        }
      } else {
        setTimerStarted(true);
      }
    } catch {}
  }, [currentQuestionIndex, completeQuestion, addQuestionCard, currentQuestionId, interviewId, totalQuestions, scrollToBottom]);

  // Даем таймеру доступ к логике пропуска
  useEffect(() => {
    skipQuestionFnRef.current = () => { void handleSkipQuestion(); };
  }, [handleSkipQuestion]);

  const handleStopRecording = useCallback(async () => {
    console.log('⏹️ Stopping recording for question', currentQuestionIndex + 1);
    setIsRecording(false);
    try { stopRecording(); } catch {}
    setIsTranscribing(true);

    // Дождаться blob
    const waitForBlob = async (retries = 20): Promise<Blob | null> => {
      for (let i = 0; i < retries; i++) {
        if (audioBlob) return audioBlob;
        await new Promise(r => setTimeout(r, 50));
      }
      return audioBlob || null;
    };
    const blob = await waitForBlob();

    try {
      setIsSavingAnswer(true);
      if (currentQuestionId != null && blob) {
        const file = new File([blob], 'answer.wav', { type: 'audio/wav' });
        await apiClient.candidates.submitAnswer(interviewId, currentQuestionId, false, file);
      }
      setIsSavingAnswer(false);
      setIsTranscribing(false);
      completeQuestion(currentQuestionIndex);

      // Получаем следующий вопрос
      const { data } = await apiClient.candidates.getCurrentQuestion(interviewId);
      if (!data || !data.questionId) {
        try { await apiClient.candidates.endInterview(interviewId); } catch {}
        const playCompletion = async (idx: number) => {
          if (idx >= completionQueueRef.current.length) {
            const list = additionalQuestionsRef.current || [];
            list.forEach((item, i) => {
              if (item?.question) {
                const idQ = `add-q-${i}-${Date.now()}`;
                setMessages(prev => [...prev, { id: idQ, content: item.question!, isVisible: true, isNew: true } as any]);
                setTimeout(() => setMessages(prev => prev.map(m => (m.id === idQ ? { ...m, isNew: false } : m))), 500);
              }
              if (item?.answer) {
                const idA = `add-a-${i}-${Date.now()}`;
                setMessages(prev => [...prev, { id: idA, content: item.answer!, isVisible: true, isNew: true, isUser: true } as any]);
                setTimeout(() => setMessages(prev => prev.map(m => (m.id === idA ? { ...m, isNew: false } : m))), 500);
              }
            });
            setTimeout(() => scrollToBottom(), 10);
            setTimeout(() => scrollToBottom(), 100);
            setTimeout(() => scrollToBottom(), 300);
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
            } catch { setIsAISpeaking(false); playCompletion(idx + 1); }
          } else { setIsAISpeaking(false); playCompletion(idx + 1); }
        };
        playCompletion(0);
        return;
      }

      setCurrentQuestionId(data.questionId || null);
      const qNumber = (((data as any).index ?? (currentQuestionIndex + 2)) as number) - 1;
      setCurrentQuestionNumber((data as any).index || (qNumber + 1));
      setTotalQuestions((data as any).total || totalQuestions);
      setCurrentQuestionIndex(Math.max(0, qNumber));
      addQuestionCard(Math.max(0, qNumber), data.text || '');
      const cardId = `question-card-${Math.max(0, qNumber)}`;
      setTimeout(() => setQuestionCards(prev => prev.map(card => card.id === cardId ? { ...card, isNew: false } : card)), 500);
      scrollToBottom();

      setIsAISpeaking(false);
      setTimerStarted(false);
      setTimeRemaining(150);
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
        setTimerStarted(true);
      }
    } catch {
      setIsTranscribing(false);
      setIsSavingAnswer(false);
    }
  }, [addQuestionCard, audioBlob, completeQuestion, currentQuestionId, currentQuestionIndex, interviewId, scrollToBottom, stopRecording, totalQuestions]);

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
                  {message.id === 'reading-message' ? (
                    <div className="bg-white rounded-br-[24px] rounded-tl-[24px] rounded-tr-[24px] border border-[#e2e4e9] px-8 py-6 max-w-[421px]">
                      <h3 className="text-[#e16349] text-[16px] leading-[24px] tracking-[0.96px] uppercase font-medium font-Inter mb-3">
                        Прочитай предложение
                      </h3>
                      <p className="text-[#0a0d14] text-[16px] leading-[24px] tracking-[-0.176px] font-medium font-Inter">
                        {message.content}
                      </p>
                    </div>
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
      onClick={stage === 'recording-test' ? handleStopMicrophoneTest : handleStopRecording}
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
            <WMTLogo size="medium" />
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
                  {((stage === 'recording-answer' && isRecording) || (stage === 'recording-test' && isRecording)) && (
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
      />
    </div>
  );
}
