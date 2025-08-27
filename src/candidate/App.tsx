import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthForm } from './components/AuthForm';
import { EmailVerification } from './components/EmailVerification';
import { InterviewProcess } from './components/InterviewProcess';
import './styles/globals.css';

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

const defaultJobPosition: JobPosition = {
  title: "Software Engineer",
  department: "Engineering",
  company: "WMT group",
  type: "Full-time",
  questionsCount: 3
};

export default function App() {
  const { interviewId: urlInterviewId } = useParams<{ interviewId: string }>();
  
  const [currentStage, setCurrentStage] = useState<AppStage>('auth');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [interviewId, setInterviewId] = useState<number>(parseInt(urlInterviewId || '1', 10));
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [jobPosition, setJobPosition] = useState<JobPosition | null>(null);

  // Для AuthForm нужен positionId (ID вакансии), используем тот же interviewId как positionId
  // В реальном приложении это должны быть разные параметры
  const positionId = parseInt(urlInterviewId || '1', 10);

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
    setCurrentStage('email-verification');
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
      {/* Debug Info - показываем только в development режиме */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-stage">
          App Stage: {currentStage}
        </div>
      )}
      {renderCurrentStage()}
    </div>
  );
}
