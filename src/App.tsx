import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Candidate Pages
import CandidateApp from './candidate/App';
import CandidateLogin from './candidate/pages/CandidateLogin';

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
        {/* Главная страница с редиректом на логин кандидата */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Публичные страницы для кандидата */}
        <Route path="/login" element={<CandidateLogin />} />
        
        {/* Страницы кандидатов */}
        <Route path="/candidate/*" element={<CandidateApp />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App; 