import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';

import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect';
import { ThemeProvider } from './components/ThemeProvider';
import { useAuthStore } from './store/authStore';
// import { EditorLayout } from './components/EditorLayout'; // Удалено

// Pages
import Login from './pages/Login';

import VacancyList from './pages/VacancyList';
import { VacancyCreate } from './pages/VacancyCreate';
import InterviewList from './pages/InterviewList';
import InterviewCreate from './pages/InterviewCreate';
import InterviewSession from './pages/InterviewSession';

import ThankYouPage from './pages/ThankYouPage';
import StatisticsPage from './components/StatisticsPage';

import { PersonalInfoPage } from './components/PersonalInfoPage';

import { TeamManagementPage } from './components/TeamManagementPage';
import { BrandingPage } from './components/BrandingPage';
import { QuestionsPage } from './components/QuestionsPage';
import SessionPage from './pages/SessionPage';

// Candidate Pages
import CandidateApp from './candidate/App';
import CandidateLogin from './candidate/pages/CandidateLogin';
import CandidateEmailVerification from './candidate/pages/CandidateEmailVerification';
import CandidateInterview from './candidate/pages/CandidateInterview';
import CandidateComplete from './candidate/pages/CandidateComplete';
// import TestPage from './pages/TestPage';

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
    <ThemeProvider>
      <Router>
        {/* Инициализация сессии для CRM */}
        <SessionInitializer zone="crm" />
        {/* Инициализация сессии для кандидата */}
        <SessionInitializer zone="candidate" />
        <Routes>
          {/* Главная страница с редиректом на логин кандидата */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Публичные страницы для кандидата (без CRM Layout) */}
          <Route path="/interview/:id/session" element={<InterviewSession />} />
          <Route path="/thank-you" element={<ThankYouPage />} />

          {/* Публичные страницы (без Layout) */}
          <Route path="/login" element={<CandidateLogin />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/recruiter/login" element={<Login />} />
          
          {/* Страницы кандидатов (с CandidateLayout) */}
          <Route path="/candidate/*" element={<CandidateApp />} />
          <Route path="/session/:sessionId" element={<SessionPage />} />
          
          {/* Админский интерфейс (строгий дизайн) */}
          <Route path="/admin" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<StatisticsPage />} />
            <Route path="vacancies" element={<VacancyList />} />
            <Route path="vacancies/create" element={<VacancyCreate onClose={() => {}} />} />
            <Route path="vacancies/:id/edit" element={<VacancyCreate onClose={() => {}} />} />
            <Route path="vacancies/:id" element={<VacancyCreate onClose={() => {}} />} />
            <Route path="interviews" element={<InterviewList />} />
            <Route path="interviews/create" element={<InterviewCreate />} />
            <Route path="reports" element={<StatisticsPage />} />
            <Route path="stats" element={<StatisticsPage />} />
            <Route path="account" element={<PersonalInfoPage />} />
            <Route path="team" element={<TeamManagementPage />} />
            <Route path="branding" element={<BrandingPage />} />
            <Route path="learn" element={<BrandingPage />} />
            <Route path="questions" element={<QuestionsPage />} />
          </Route>
            
          {/* Рекрутерский интерфейс (простой дизайн) */}
          <Route path="/recruiter" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<StatisticsPage />} />
            <Route path="vacancies" element={<VacancyList />} />
            <Route path="vacancies/create" element={<VacancyCreate onClose={() => {}} />} />
            <Route path="vacancies/:id/edit" element={<VacancyCreate onClose={() => {}} />} />
            <Route path="vacancies/:id" element={<VacancyCreate onClose={() => {}} />} />
            <Route path="interviews" element={<InterviewList />} />
            <Route path="interviews/create" element={<InterviewCreate />} />
            <Route path="reports" element={<StatisticsPage />} />
            <Route path="stats" element={<StatisticsPage />} />
            <Route path="account" element={<PersonalInfoPage />} />
            <Route path="team" element={<TeamManagementPage />} />
            <Route path="branding" element={<BrandingPage />} />
            <Route path="learn" element={<BrandingPage />} />
            <Route path="questions" element={<QuestionsPage />} />
          </Route>
            
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 