import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { VacanciesPageUnified } from '../components/VacanciesPage';

const VacancyList: React.FC = () => {
  const { isAuth, isLoading } = useAuthStore();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-96 text-gray-500">Загрузка...</div>;
  }

  if (!isAuth) {
    return null;
  }

  return (
    <VacanciesPageUnified
      activeTab="vacancies"
      onTabChange={(id: string) => {
        if (id === 'vacancies') navigate('/recruiter/vacancies');
        if (id === 'statistics') navigate('/recruiter/reports');
        if (id === 'team') navigate('/recruiter/team');
      }}
      onCreateVacancy={() => {
        // Не перенаправляем, а показываем форму создания в той же странице
        console.log('🔍 onCreateVacancy: показываем форму создания в той же странице');
      }}
      onEditVacancy={() => {
        // Не перенаправляем, а показываем форму редактирования в той же странице
        console.log('🔍 onEditVacancy: показываем форму редактирования в той же странице');
      }}
      onUserProfileClick={() => navigate('/recruiter/account')}
      onCreateInterview={(positionId: number) => navigate(`/recruiter/interviews/create?positionId=${positionId}`)}
      onCandidateClick={(candidateId: string) => navigate(`/recruiter/candidates/${candidateId}`)}
    />
  );
};

export default VacancyList; 
