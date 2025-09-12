import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthForm } from './components/AuthForm';
import { EmailVerification } from './components/EmailVerification';
import { InterviewProcess } from './components/InterviewProcess';
import './styles/globals.css';
import { candidateAuthService } from './services/candidateAuthService';

type AppStage = 'auth' | 'email-verification' | 'interview';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  interviewId?: number;
  jobPosition?: JobPosition; // Добавляем данные о вакансии
  candidateId?: string; // сохраняем id кандидата
}

interface JobPosition {
  title: string;
  department: string;
  company: string;
  type: string;
  questionsCount: number;
}



export default function App() {
  const { interviewId: urlInterviewId } = useParams<{ interviewId: string }>();
  
  const [currentStage, setCurrentStage] = useState<AppStage>('auth');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [interviewId, setInterviewId] = useState<number>(parseInt(urlInterviewId || '1', 10));
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [jobPosition, setJobPosition] = useState<JobPosition | null>(null);

  // Правильное разделение: positionId != interviewId. На этапе логина берём positionId из URL.
  // Для совместимости используем urlInterviewId как positionId, если маршрут такой.
  const positionId = Number.isNaN(Number(urlInterviewId)) ? 1 : parseInt(urlInterviewId || '1', 10);

  // Централизованная загрузка summary позиции
  useEffect(() => {
    let isCancelled = false;
    const load = async () => {
      try {
        const summary = await candidateAuthService.getPositionSummary(positionId);
        if (isCancelled) return;
        const next: JobPosition = {
          title: summary.title,
          department: summary.department,
          company: summary.company,
          type: summary.type,
          questionsCount: summary.questionsCount
        };
        setJobPosition(next);
        try { localStorage.setItem('position_summary', JSON.stringify(next)); } catch {}
      } catch (e) {
        if (isCancelled) return;
        // Не перезаполняем заглушками — пусть UI отобразит отсутствие
        setJobPosition(null);
      }
    };
    if (positionId) {
      void load();
    }
    return () => { isCancelled = true; };
  }, [positionId]);

  const handleAuthComplete = async (data: UserData) => {
    console.log('🔐 Auth completed:', data);
    
    // Если login вернул interviewId — фиксируем его как актуальный
    if (typeof data.interviewId === 'number') {
      setInterviewId(data.interviewId);
    }

    setUserData(data);
    if (data.jobPosition) {
      setJobPosition(data.jobPosition);
    }
    // Определяем следующую стадию в зависимости от наличия токена и локального флага верификации
    try {
      const hasToken = !!candidateAuthService.getAuthToken();
      const shouldVerify = (candidateAuthService as any).constructor.EMAIL_VERIFICATION_ENABLED === true;
      if (hasToken || !shouldVerify) {
        setCurrentStage('interview');
      } else {
        setCurrentStage('email-verification');
      }
    } catch {
      // На всякий случай — если что-то пошло не так, оставляем прежнее поведение
      setCurrentStage('email-verification');
    }
  };

  const handleGoBackToAuth = () => {
    console.log('⬅️ Going back to auth');
    setCurrentStage('auth');
  };

  const handleEmailVerified = async (verificationCode: string, token?: string, interviewId?: number) => {
    console.log('✅ Email verification completed, starting interview');
    
    // Сохраняем токен и interviewId из ответа верификации
    if (token) {
      setAuthToken(token);
    }
    if (interviewId) {
      setInterviewId(interviewId);
    }
    
    // Переходим к стадии интервью
    setCurrentStage('interview');
  };

  const renderCurrentStage = () => {
    switch (currentStage) {
      case 'auth':
        return (
          <AuthForm 
            onContinue={handleAuthComplete}
            positionId={positionId}
            jobPosition={jobPosition || undefined}
          />
        );
      
      case 'email-verification':
        return (
          <EmailVerification 
            email={userData?.email || ''} 
            onContinue={handleEmailVerified}
            onGoBack={handleGoBackToAuth}
            interviewId={interviewId}
            jobPosition={jobPosition || undefined}
          />
        );
      
      case 'interview':
        return <InterviewProcess interviewId={interviewId} token={authToken || undefined} jobPosition={jobPosition || undefined} />;
      
      default:
        return <div>Unknown stage</div>;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--interview-bg)' }}>
      {renderCurrentStage()}
    </div>
  );
}
