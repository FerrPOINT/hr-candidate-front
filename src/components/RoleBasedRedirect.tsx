// src/components/RoleBasedRedirect.tsx
/**
 * RoleBasedRedirect
 * Компонент для автоматического перенаправления пользователя на нужный интерфейс в зависимости от статуса авторизации и роли.
 *
 * Sequence diagram (Mermaid):
 *
 * ```mermaid
 * sequenceDiagram
 *   participant UI as Frontend UI
 *   participant Store as AuthStore
 *   participant Redirect as RoleBasedRedirect
 *
 *   UI->>Store: useAuthStore()
 *   Store-->>Redirect: { isAuth, role }
 *   alt Не авторизован
 *     Redirect-->>UI: <Navigate to="/login" />
 *   else Авторизован
 *     Redirect-->>UI: <Navigate to="/recruiter/vacancies" />
 *   end
 *
 *   Note over Redirect,UI: В будущем можно добавить логику по ролям (admin, candidate, viewer)
 * ```
 *
 * Бизнес-логика:
 * - Если пользователь не авторизован — редирект на /login
 * - Если авторизован — редирект на /recruiter/vacancies (по умолчанию)
 * - В будущем: можно добавить ролевую логику (admin → /admin, candidate → /interview/:id и т.д.)
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const RoleBasedRedirect: React.FC = () => {
  const { isAuth } = useAuthStore();
  const pathname = window.location.pathname;
  
  console.log('🔍 RoleBasedRedirect - isAuth:', isAuth, 'pathname:', pathname);
  
  // Не перехватываем кандидатские маршруты
  if (pathname.startsWith('/candidate/')) {
    console.log('🔍 RoleBasedRedirect - Skipping candidate route, staying on current path');
    return <Navigate to={pathname} replace />;
  }
  
  if (!isAuth) {
    console.log('🔍 RoleBasedRedirect - Redirecting to /login');
    return <Navigate to="/login" replace />;
  }
  
  // По умолчанию все попадают на страницу вакансий в рекрутерском интерфейсе
  console.log('🔍 RoleBasedRedirect - Redirecting to /recruiter/vacancies');
  return <Navigate to="/recruiter/vacancies" replace />;
};

export default RoleBasedRedirect; 