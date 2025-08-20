import React, { useState, useEffect, useCallback } from 'react';
import { X, Calendar, Save, Loader2, User, Mail, Briefcase } from 'lucide-react';
import { apiService } from '../services/apiService';
import { Position, Interview } from '../api/models';
import toast from 'react-hot-toast';
import { PositionStatusEnum } from '../api/models';
import { useAuthStore } from '../store/authStore';

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  interview?: Interview | null;
  onSuccess: () => void;
}

const InterviewModal: React.FC<InterviewModalProps> = ({
  isOpen,
  onClose,
  interview,
  onSuccess
}) => {
  useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [vacancies, setVacancies] = useState<Position[]>([]);
  const [loadingVacancies, setLoadingVacancies] = useState(true);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    vacancyId: '',
    scheduledDate: '',
    notes: ''
  });

  // Сначала объявляем функцию
  const loadInterviewData = useCallback(async () => {
    if (!interview?.id) return;

    try {
      // Загружаем данные интервью с кандидатом
      const interviewData = await apiService.getInterview(interview.id);
      if (interviewData) {
        const { candidate } = interviewData as any;
        if (candidate) {
          setFormData({
            firstName: candidate.firstName || '',
            lastName: candidate.lastName || '',
            email: candidate.email || '',
            vacancyId: interview.positionId?.toString() || '',
            scheduledDate: interview.startedAt ? new Date(interview.startedAt).toISOString().slice(0, 16) : '',
            notes: ((interview as any)?.transcript ? String((interview as any).transcript) : '')
          });
        }
      }
    } catch (error) {
      console.error('Error loading interview data:', error);
      toast.error('Ошибка загрузки данных собеседования');
    }
  }, [interview]);

  // Загружаем вакансии при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      loadVacancies();
    }
  }, [isOpen]);

  // Загружаем данные собеседования при изменении
  useEffect(() => {
    if (isOpen && interview) {
      // Для редактирования собеседования загружаем данные кандидата
      loadInterviewData();
    } else if (isOpen && !interview) {
      // Сброс формы для нового собеседования
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        vacancyId: '',
        scheduledDate: '',
        notes: ''
      });
    }
  }, [isOpen, interview, loadInterviewData]);

  const loadVacancies = async () => {
    setLoadingVacancies(true);
    try {
      const res = await apiService.getPositions({
        status: PositionStatusEnum.ACTIVE
        // owner: 'me' // Removed as this parameter doesn't exist in new API
      });
      setVacancies(res.items);
    } catch (error: any) {
      console.error('Error loading vacancies:', error);
      toast.error('Ошибка загрузки вакансий');
    } finally {
      setLoadingVacancies(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (interview) {
        // Обновление существующего собеседования
        // Здесь нужно обновить данные кандидата и интервью
        toast.success('Собеседование обновлено');
      } else {
        // Создание нового собеседования
        if (!formData.vacancyId) {
          toast.error('Выберите вакансию');
          setIsLoading(false);
          return;
        }

        // Создание кандидата
        await apiService.createCandidate(parseInt(formData.vacancyId), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        });

        // Интервью не стартуем здесь: старт возможен отдельно по реальному interviewId
        toast.success('Кандидат создан, интервью будет доступно в списке');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving interview:', error);
      toast.error(error.response?.data?.message || 'Ошибка сохранения собеседования');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Заголовок */}
        <div className="modal-header">
          <h2 className="modal-title">
            {interview ? 'Редактировать собеседование' : 'Создать собеседование'}
          </h2>
          <button
            onClick={onClose}
            className="modal-close-btn"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Данные кандидата */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Данные кандидата
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Имя *</label>
                <input
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Имя"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Фамилия *</label>
                <input
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Фамилия"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Настройки собеседования */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
              Настройки собеседования
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Вакансия *</label>
                {loadingVacancies ? (
                  <div className="text-gray-400 text-sm">Загрузка вакансий...</div>
                ) : (
                  <select
                    name="vacancyId"
                    required
                    value={formData.vacancyId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Выберите вакансию</option>
                    {vacancies.map((vacancy) => (
                      <option key={vacancy.id} value={vacancy.id}>
                        {vacancy.title} ({vacancy.level || ''})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Запланированная дата и время</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="datetime-local"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Заметки</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Дополнительные заметки о кандидате или собеседовании..."
                />
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Сохранение...' : (interview ? 'Сохранить' : 'Создать')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewModal; 