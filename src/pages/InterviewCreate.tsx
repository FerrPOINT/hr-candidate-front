import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { apiService } from '../services/apiService';
import toast from 'react-hot-toast';
import { PositionStatusEnum } from '../api/models';
import { useAuthStore } from '../store/authStore';
import { useRecruiterState } from '../utils/recruiterStateManager';

const InterviewCreate: React.FC = () => {
  const navigate = useNavigate();
  useAuthStore();
  const [searchParams] = useSearchParams();
  const positionId = searchParams.get('positionId');

  // Используем состояние рекрутера для сохранения формы
  const { state: recruiterState, updateInterviewCreate } = useRecruiterState();

  const [formData, setFormData] = useState({
    firstName: recruiterState.interviewCreate.formData.firstName,
    lastName: recruiterState.interviewCreate.formData.lastName,
    email: recruiterState.interviewCreate.formData.email,
    vacancyId: positionId || recruiterState.interviewCreate.formData.vacancyId,
    scheduledDate: recruiterState.interviewCreate.formData.scheduledDate
  });
  const [isLoading, setIsLoading] = useState(false);
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [loadingVacancies, setLoadingVacancies] = useState(true);

  // Сохраняем состояние формы при изменениях
  useEffect(() => {
    updateInterviewCreate({
      formData: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        vacancyId: formData.vacancyId,
        scheduledDate: formData.scheduledDate,
      },
    });
  }, [formData, updateInterviewCreate]);

  useEffect(() => {
    console.log('🔍 InterviewCreate: positionId from URL:', positionId);
    console.log('🔍 InterviewCreate: formData.vacancyId:', formData.vacancyId);
  }, [positionId, formData.vacancyId]);

  useEffect(() => {
    setLoadingVacancies(true);
    (async () => {
      try {
        const res = await apiService.getPositions({ status: PositionStatusEnum.ACTIVE });
        console.log('🔍 InterviewCreate: loaded vacancies:', res.items);
        setVacancies(res.items);
      } catch (error: any) {
        console.error('Error loading vacancies:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error message:', error.message);
        toast.error('Ошибка загрузки вакансий');
      } finally {
        setLoadingVacancies(false);
      }
    })();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('🔍 InterviewCreate: Submitting form with data:', formData);

    // Проверяем, что вакансия выбрана
    if (!formData.vacancyId) {
      toast.error('Пожалуйста, выберите вакансию для собеседования');
      setIsLoading(false);
      return;
    }

    try {
      const interviewData = {
        positionId: parseInt(formData.vacancyId),
        candidateEmail: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
      };
      
      console.log('🔍 InterviewCreate: Creating interview with data:', interviewData);
      
      // Создание интервью (без старта)
      await apiService.createInterview(interviewData);

      toast.success('Собеседование создано');
      navigate('/recruiter/vacancies');
    } catch (error) {
      console.error('Error creating interview:', error);
      toast.error('Ошибка создания собеседования');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <button onClick={() => navigate('/')} className="mb-4 flex items-center text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-5 w-5 mr-2" /> Назад
      </button>
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-lg w-full flex flex-col gap-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Новое собеседование</h2>
        <div className="text-gray-500 text-base mb-6">
          Заполните все поля для создания собеседования
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">Имя кандидата *</label>
            <input
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Имя"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Фамилия кандидата *</label>
            <input
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Фамилия"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Email"
            />
          </div>
          <div>
            <label htmlFor="vacancyId" className="block text-sm font-medium text-gray-700 mb-2">
              Вакансия * <span className="text-red-500">(обязательно)</span>
            </label>
            {loadingVacancies ? (
              <div className="text-gray-400 text-sm">Загрузка вакансий...</div>
            ) : (
              <select
                id="vacancyId"
                name="vacancyId"
                required
                value={formData.vacancyId}
                onChange={handleInputChange}
                className={`input-field ${!formData.vacancyId ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
              >
                <option value="">Выберите вакансию</option>
                {vacancies.map((vacancy) => (
                  <option key={vacancy.id} value={vacancy.id}>
                    {vacancy.title} ({vacancy.level || ''})
                  </option>
                ))}
              </select>
            )}
            {!formData.vacancyId && (
              <p className="text-red-500 text-sm mt-1">Необходимо выбрать вакансию для создания собеседования</p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-2">Запланированная дата и время</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="datetime-local"
                id="scheduledDate"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button type="submit" className="btn-primary h-11 px-8 text-base" disabled={isLoading}>{isLoading ? 'Создание...' : 'Создать собеседование'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewCreate; 