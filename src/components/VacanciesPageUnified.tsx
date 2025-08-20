import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  SuitcaseLineIconV7,
  PieChartLineIconV7,
  TeamLineIconV7,
  Notification4LineIconV7,
  AddFillIconV7,
  Search2LineIconV7,
  AccountCircleLineIcon,
} from "./ui/figma-icons-v7";
import { SynergyLogoFigma } from "./ui/synergy-logo-figma";
import { apiService } from "../services/apiService";
import type { Position as ApiPosition, Interview as ApiInterview } from "../api/models";

interface VacanciesPageUnifiedProps {
  activeTab: string;
  onTabChange: (id: string) => void;
  onCreateVacancy: () => void;
  onEditVacancy: () => void;
  onUserProfileClick: () => void;
  onCreateInterview: (positionId: number) => void;
  onCandidateClick: (candidateId: number) => void;
}

export function VacanciesPageUnified({
  activeTab = "vacancies",
  onTabChange,
  onCandidateClick,
  onCreateVacancy,
  onEditVacancy,
  onUserProfileClick,
  onCreateInterview,
}: VacanciesPageUnifiedProps) {

  const [searchValue, setSearchValue] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [positions, setPositions] = React.useState<ApiPosition[]>([]);
  const [interviews, setInterviews] = React.useState<ApiInterview[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedPositionId, setSelectedPositionId] = React.useState<number | null>(null);

  // Load data on component mount
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Используем правильный метод API
        const positionsResponse = await apiService.getPositions();
        const interviewsResponse = await apiService.getInterviews();
        
        setPositions(positionsResponse?.items || []);
        setInterviews(interviewsResponse?.items || []);
        
        // Set first position as selected if available
        if (positionsResponse?.items && positionsResponse.items.length > 0 && !selectedPositionId) {
          setSelectedPositionId(positionsResponse.items[0].id);
        }
      } catch (err) {
        console.error('Error loading vacancies data:', err);
        setError('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate candidate counts for each position
  const positionCandidateCounts = React.useMemo(() => {
    const counts: Record<number, number> = {};
    interviews.forEach(interview => {
      if (interview.positionId) {
        counts[interview.positionId] = (counts[interview.positionId] || 0) + 1;
      }
    });
    return counts;
  }, [interviews]);

  // Helper functions
  const getVacancyLevel = (title: string, description: string): string => {
    const text = `${title} ${description}`.toLowerCase();
    if (text.includes('senior') || text.includes('lead') || text.includes('head')) return 'Senior';
    if (text.includes('middle') || text.includes('mid')) return 'Middle';
    if (text.includes('junior') || text.includes('entry')) return 'Junior';
    return 'Middle';
  };

  const mapPositionStatusToUi = (status: string): string => {
    switch (status) {
      case 'ACTIVE': return 'active';
      case 'DRAFT': return 'draft';
      case 'CLOSED': return 'closed';
      default: return 'draft';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-gray-500">Загрузка вакансий...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-red-500">Ошибка: {error}</div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SynergyLogoFigma />
              <nav className="flex space-x-8">
                <button
                  onClick={() => onTabChange('vacancies')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'vacancies' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <SuitcaseLineIconV7 className="w-5 h-5" />
                  <span>Вакансии</span>
                </button>
                <button
                  onClick={() => onTabChange('statistics')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'statistics' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <PieChartLineIconV7 className="w-5 h-5" />
                  <span>Статистика</span>
                </button>
                <button
                  onClick={() => onTabChange('team')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'team' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <TeamLineIconV7 className="w-5 h-5" />
                  <span>Команда</span>
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Notification4LineIconV7 className="w-6 h-6" />
              </button>
              <button onClick={onUserProfileClick} className="p-2 text-gray-400 hover:text-gray-600">
                <AccountCircleLineIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex">
          {/* Left Sidebar - Vacancies List */}
          <div className="w-80 bg-white border-r border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Вакансии</h2>
              <button
                onClick={onCreateVacancy}
                className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                <AddFillIconV7 className="w-4 h-4" />
                <span>Создать</span>
              </button>
            </div>

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search2LineIconV7 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Поиск вакансий..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Vacancies List */}
            <div className="space-y-3">
              {positions.map((position) => {
                const uiStatus = mapPositionStatusToUi(position.status || 'DRAFT');
                const interviewCount = positionCandidateCounts[position.id] ?? 0;
                const vacancyLevel = getVacancyLevel(position.title || '', position.description || '');
                
                return (
                  <div
                    key={position.id}
                    onClick={() => setSelectedPositionId(position.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPositionId === position.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{position.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        uiStatus === 'active' ? 'bg-green-100 text-green-800' :
                        uiStatus === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {uiStatus === 'active' ? 'Активна' : uiStatus === 'draft' ? 'Черновик' : 'Закрыта'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{position.company}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{vacancyLevel}</span>
                      <span>{interviewCount} кандидатов</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6">
            {selectedPositionId ? (
              <div className="space-y-6">
                {/* Vacancy Details */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {positions.find(p => p.id === selectedPositionId)?.title}
                    </h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={onEditVacancy}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={() => onCreateInterview(selectedPositionId)}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      >
                        Создать интервью
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Компания:</span>
                      <span className="ml-2 text-gray-900">{positions.find(p => p.id === selectedPositionId)?.company}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Статус:</span>
                      <span className="ml-2 text-gray-900">
                        {mapPositionStatusToUi(positions.find(p => p.id === selectedPositionId)?.status || 'DRAFT') === 'active' ? 'Активна' : 'Черновик'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Кандидатов:</span>
                      <span className="ml-2 text-gray-900">{positionCandidateCounts[selectedPositionId] || 0}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-gray-500">Описание:</span>
                    <p className="mt-1 text-gray-900">{positions.find(p => p.id === selectedPositionId)?.description}</p>
                  </div>
                </div>
                
                {/* Candidates List */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Кандидаты</h3>
                  <div className="text-center py-8 text-gray-500">
                    Список кандидатов будет отображаться здесь
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <SuitcaseLineIconV7 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Выберите вакансию</h3>
                  <p className="text-gray-500">Выберите вакансию из списка слева для просмотра деталей</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}