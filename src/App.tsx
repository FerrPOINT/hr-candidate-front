import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Candidate Pages - используем только Single Page контейнер
import CandidateApp from './candidate/App';

// --- Новый компонент для разделения инициализации сессии ---
const SessionInitializer: React.FC<{ zone: 'crm' | 'candidate' }> = ({ zone }) => {
  const { restoreSession } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    console.log('🔍 SessionInitializer - zone:', zone, 'pathname:', location.pathname);
    
    // Для CRM-зоны инициализируем только если путь начинается с /recruiter, /admin, /login
    if (zone === 'crm' && (/^\/(recruiter|admin|login)/.test(location.pathname))) {
      console.log('🔍 SessionInitializer - Initializing CRM session');
      restoreSession().catch(error => {
        console.error('Failed to restore CRM session:', error);
      });
    }
    // Для candidate-зоны инициализируем только если путь начинается с /candidate/interview, /session, /candidate
    if (zone === 'candidate' && (/^\/(candidate\/interview|session|candidate)/.test(location.pathname))) {
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
        {/* Single Page для кандидата - только по конкретному ID интервью */}
        <Route path="/candidate/interview/:interviewId" element={<CandidateApp />} />
        
        {/* Fallback - 404 без редиректов */}
        <Route path="*" element={<div>404 - Страница не найдена</div>} />
      </Routes>
    </Router>
  );
}

export default App; 