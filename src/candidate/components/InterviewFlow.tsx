import { useState } from 'react';
import { AuthForm } from './AuthForm';
import { EmailVerification } from './EmailVerification';

import { InterviewProcess } from './InterviewProcess';

type FlowStage = 'auth' | 'email-verification' | 'interview';

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

export function InterviewFlow() {
  const [stage, setStage] = useState<FlowStage>('auth');
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: ''
  });

  // Данные о позиции - можно получать из API или пропсов
  const jobPosition: JobPosition = {
    title: 'Software Engineer',
    department: 'Engineering',
    company: 'WMT group',
    type: 'Full-time',
    questionsCount: 8
  };

  const handleAuthSuccess = (data: UserData) => {
    setUserData(data);
    setStage('email-verification');
  };

  const handleEmailVerified = () => {
    setStage('interview');
  };

  // Общий контейнер с фоном интервью
  const renderStageContent = () => {
    switch (stage) {
      case 'auth':
        return (
          <AuthForm 
            onContinue={handleAuthSuccess}
            interviewId={1}
          />
        );
      
      case 'email-verification':
        return (
          <EmailVerification
            email={userData.email}
            onContinue={handleEmailVerified}
            onGoBack={() => setStage('auth')}
            interviewId={1}
          />
        );
      

      
      case 'interview':
        return (
          <InterviewProcess />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {renderStageContent()}
    </div>
  );
}
