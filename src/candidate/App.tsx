import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthForm } from './components/AuthForm';
import { EmailVerification } from './components/EmailVerification';
import { InterviewProcess } from './components/InterviewProcess';
import { candidateAuthService } from './services/candidateAuthService';
import './styles/globals.css';

type AppStage = 'auth' | 'email-verification' | 'interview-start' | 'interview';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  interviewId?: number;
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
  const location = useLocation();
  
  const [currentStage, setCurrentStage] = useState<AppStage>('auth');
  const [userData, setUserData] = useState<UserData | null>(null);

  // Получаем interviewId из URL
  const getInterviewIdFromUrl = (): number => {
    const pathParts = location.pathname.split('/');
    const interviewIndex = pathParts.indexOf('interview');
    if (interviewIndex !== -1 && pathParts[interviewIndex + 1]) {
      return parseInt(pathParts[interviewIndex + 1], 10);
    }
    return 1; // По умолчанию
  };

  const interviewId = getInterviewIdFromUrl();

  // Обновляем стадию при изменении URL
  useEffect(() => {
    const getInitialStage = (): AppStage => {
      if (location.pathname.includes('/interview/')) {
        return 'interview';
      }
      if (location.pathname.includes('/verify-email')) {
        return 'email-verification';
      }
      return 'auth';
    };
    
    const newStage = getInitialStage();
    setCurrentStage(newStage);
  }, [location.pathname]);

  const handleAuthComplete = async (data: UserData) => {
    console.log('🔐 Auth completed:', data);
    
    try {
      // Проверяем наличие собеседования по email
      const checkResponse = await candidateAuthService.checkInterviewExists(data.email);
      
      if (checkResponse.exists && checkResponse.interviewId) {
        setUserData({ ...data, interviewId: checkResponse.interviewId });
        setCurrentStage('email-verification');
      } else {
        // Собеседование не найдено
        console.error('Interview not found:', checkResponse.message);
        alert(checkResponse.message || 'Собеседование не найдено для данного email');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Произошла ошибка при проверке собеседования');
    }
  };

  const handleGoBackToAuth = () => {
    console.log('⬅️ Going back to auth');
    setCurrentStage('auth');
  };

  const handleEmailVerified = async (verificationCode: string) => {
    console.log('✅ Email verification started:', verificationCode);
    
    try {
      // Верифицируем email и получаем JWT токен
      const verifyResponse = await candidateAuthService.verifyEmail(userData?.email || '', verificationCode);
      
      if (verifyResponse.success) {
        console.log('✅ Email verified, starting interview');
        
        // Получаем токен из localStorage
        const token = candidateAuthService.getAuthToken();
        if (!token) {
          throw new Error('Токен авторизации не найден');
        }
        
        // Запускаем собеседование
        if (userData?.interviewId) {
          const startResponse = await candidateAuthService.startInterview(userData.interviewId, token);
          
          if (startResponse.success) {
            console.log('✅ Interview started, moving to interview process');
            setCurrentStage('interview');
          } else {
            throw new Error(startResponse.message || 'Ошибка запуска собеседования');
          }
        } else {
          throw new Error('ID собеседования не найден');
        }
      } else {
        // Обработка ошибки верификации
        console.error('Email verification failed:', verifyResponse.error);
        alert(verifyResponse.error || 'Ошибка верификации email');
      }
    } catch (error: any) {
      console.error('Email verification error:', error);
      alert(error.message || 'Произошла ошибка при верификации email');
    }
  };

  const renderCurrentStage = () => {
    switch (currentStage) {
      case 'auth':
        return (
          <AuthForm 
            onContinue={handleAuthComplete}
            interviewId={interviewId}
          />
        );
      
      case 'email-verification':
        return (
          <EmailVerification 
            email={userData?.email || ''} 
            onContinue={handleEmailVerified}
            onGoBack={handleGoBackToAuth}
            interviewId={interviewId}
          />
        );
      
      case 'interview-start':
        return (
          <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--interview-bg)' }}>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Запуск собеседования...</h2>
              <p className="text-gray-600">Пожалуйста, подождите</p>
            </div>
          </div>
        );
      
      case 'interview':
        return <InterviewProcess />;
      
      default:
        return (
          <AuthForm 
            onContinue={handleAuthComplete}
            interviewId={interviewId}
          />
        );
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
