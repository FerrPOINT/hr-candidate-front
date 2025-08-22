import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Candidate Pages
import CandidateApp from './candidate/App';
import { AuthForm } from './candidate/components/AuthForm';
import CandidateEmailVerification from './candidate/pages/CandidateEmailVerification';

// Обёртка для AuthForm с получением interviewId из URL и загрузкой информации о вакансии
const InterviewEntry: React.FC = () => {
  const [step, setStep] = useState<'data' | 'verification'>('data');
  const [userData, setUserData] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
  const location = useLocation();
  
  // Получаем interviewId из URL параметров
  const interviewId = parseInt(location.pathname.split('/').pop() || '1', 10);

  const handleContinue = (data: { firstName: string; lastName: string; email: string }) => {
    setUserData(data);
    setStep('verification');
  };

  if (step === 'verification' && userData) {
    // Переходим на страницу верификации с параметрами email и interviewId
    window.location.href = `/candidate/verify-email?email=${encodeURIComponent(userData.email)}&interviewId=${interviewId}`;
    return null;
  }

  return <AuthForm onContinue={handleContinue} interviewId={interviewId} />;
};

// --- Новый компонент для разделения инициализации сессии ---
const SessionInitializer: React.FC<{ zone: 'crm' | 'candidate' }> = ({ zone }) => {
  const { restoreSession } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    console.log('🔍 SessionInitializer - zone:', zone, 'pathname:', location.pathname);
    
    // Для CRM-зоны инициализируем только если путь начинается с /recruiter, /admin, /login
    if (zone === 'crm' && (/^\/(recruiter|admin|login)/.test(location.pathname) || location.pathname === '/')) {
      console.log('🔍 SessionInitializer - Initializing CRM session');
      restoreSession().catch(error => {
        console.error('Failed to restore CRM session:', error);
      });
    }
    // Для candidate-зоны инициализируем только если путь начинается с /interview, /session, /candidate
    if (zone === 'candidate' && (/^\/(interview|session|candidate)/.test(location.pathname))) {
      console.log('🔍 SessionInitializer - Initializing candidate session');
      restoreSession().catch(error => {
        console.error('Failed to restore candidate session:', error);
      });
    }
  }, [zone, location.pathname, restoreSession]);
  return null;
};

function App() {
  console.log('🔍 App - Rendering, current pathname:', window.location.pathname);
  
  return (
    <Router>
      {/* Инициализация сессии для CRM */}
      <SessionInitializer zone="crm" />
      {/* Инициализация сессии для кандидата */}
      <SessionInitializer zone="candidate" />
      <Routes>
        {/* Главная страница с редиректом на интервью */}
        <Route path="/" element={<Navigate to="/interview/1" replace />} />
        
        {/* Публичные страницы для кандидата */}
        <Route path="/interview/:interviewId" element={<InterviewEntry />} />
        <Route path="/candidate/verify-email" element={<CandidateEmailVerification />} />
        
        {/* Страницы кандидатов */}
        <Route path="/candidate/*" element={<CandidateApp />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App; 