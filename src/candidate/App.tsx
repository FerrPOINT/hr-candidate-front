import { useState } from 'react';
import { AuthForm } from './components/AuthForm';
import { EmailVerification } from './components/EmailVerification';
import { InterviewProcess } from './components/InterviewProcess';
import './styles/globals.css';

type AppStage = 'auth' | 'email-verification' | 'interview';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

interface JobPosition {
  title: string;
  department: string;
  company: string;
  type: string;
  questionsCount: number;
}

const defaultJobPosition: JobPosition = {
  title: "Frontend Developer",
  department: "Engineering", 
  company: "ВМТ Группа",
  type: "Full-time",
  questionsCount: 3
};

export default function App() {
  const [currentStage, setCurrentStage] = useState<AppStage>('auth');
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleAuthComplete = (data: UserData) => {
    console.log('🔐 Auth completed:', data);
    setUserData(data);
    setCurrentStage('email-verification');
  };

  const handleGoBackToAuth = () => {
    console.log('⬅️ Going back to auth');
    setCurrentStage('auth');
  };

  const handleEmailVerified = () => {
    console.log('✅ Email verified, starting interview');
    setCurrentStage('interview');
  };

  const renderCurrentStage = () => {
    switch (currentStage) {
      case 'auth':
        return (
          <AuthForm 
            onContinue={handleAuthComplete}
            jobPosition={defaultJobPosition}
          />
        );
      
      case 'email-verification':
        return (
          <EmailVerification 
            email={userData?.email || ''} 
            onContinue={handleEmailVerified}
            onGoBack={handleGoBackToAuth}
            jobPosition={defaultJobPosition}
          />
        );
      
      case 'interview':
        return <InterviewProcess />;
      
      default:
        return (
          <AuthForm 
            onContinue={handleAuthComplete}
            jobPosition={defaultJobPosition}
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
