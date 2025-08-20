import React from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  SuitcaseLineIconV7,
  PieChartLineIconV7,
  TeamLineIconV7,
  Notification4LineIconV7,
  AddFillIconV7,
  ArrowDownSLineIconV7,
  Search2LineIconV7,
  FilePdf2LineIconV7,
  LinkIconV7,
  ChartLegendDotsIcon,
  AccountCircleLineIcon,
  Filter3LineIcon,
  SortDescIcon,
  ExpandUpDownFillIcon,
} from "./ui/figma-icons-v7";
import { SynergyLogoFigma } from "./ui/synergy-logo-figma";
import { VacancyCard } from "./ui/vacancy-card";
import { VacancyTextTab } from "./vacancy-text-tab";
import { QuestionsTab } from "./questions_tab";
import { TabToggle } from "./ui/tab-toggle";
import { QuestionCard } from "./vacancies/QuestionCard";
import { VacancyHeader } from "./vacancies/VacancyHeader";
import { VacancyCreationForm } from "./vacancies/VacancyCreationForm";
import { VacancyDetails } from "./vacancies/VacancyDetails";
import { CandidateResults } from "./vacancies/CandidateResults";
import { VacanciesSidebar } from "./vacancies/VacanciesSidebar";
import { InterviewCreationForm } from "./vacancies/InterviewCreationForm";
// import { CandidateAnswersPage } from "../../components/CandidateAnswersPage"; // Удален в процессе очистки
import {
  VacanciesPageUnifiedProps,
  Candidate,
  ContentTab,
  ViewMode,
  StatusTab,
  FilterTab,
  ColumnFilters,
  SortField,
  NavigationItem,
} from "./vacancies/types";
import {
  defaultTopics,
  timeOptions,
  levelOptions,
  questionCountOptions,
  questionTypeOptions,
  defaultSortFieldsOrder,
  itemsPerPage,
} from "./vacancies/constants";
import {
  getVacancyStatusLabel,
  filterAndSortCandidates,
} from "./vacancies/helpers";
import { Checkbox } from "./vacancies/components/checkbox";
import { StatusDropdown } from "./vacancies/components/status-dropdown";
import { ColumnFiltersDropdown } from "./vacancies/components/column-filters-dropdown";
import { Pagination } from "./vacancies/components/pagination";
import { SortDropdown } from "./vacancies/components/sort-dropdown";
import { apiService } from "../services/apiService";
import type { Position as ApiPosition, Candidate as ApiCandidate, Interview as ApiInterview } from "../api/models";
import { mapCandidateStatusEnum, mapPositionStatusEnum } from "../utils/enumMapper";
import { optimizedApiService } from "../services/optimizedApiService";


// Drag & Drop constants
const ITEM_TYPE = "question";

interface DragItem {
  id: string;
  index: number;
}

// Fallback transparent image for avatar (data URI)
const imgImage = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

/**
 * Unified Vacancies Page Component
 * Единая структура со всеми остальными страницами - хедер вверху, контент по центру
 */
export function VacanciesPageUnified({
  activeTab = "vacancies",
  onTabChange,
  onCandidateClick,
  onCreateVacancy,
  onEditVacancy,
  onUserProfileClick,
  onCreateInterview,
}: VacanciesPageUnifiedProps) {

  const [contentTab, setContentTab] = React.useState<ContentTab>("candidates");
  const [viewMode, setViewMode] = React.useState<ViewMode>("list");
  
  console.log('🔍 VacanciesPageUnified: Рендерится с viewMode =', viewMode);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [selectedCandidate, setSelectedCandidate] = React.useState<any>(null);
  const [expandedAnswers, setExpandedAnswers] = React.useState<{[key: number]: boolean}>({
    1: false, // Вопрос 1 - свернут
    2: false, // Вопрос 2 - свернут (по умолчанию)
    3: false  // Вопрос 3 - свернут
  });
  const [activeStatusTab, setActiveStatusTab] = React.useState<StatusTab>("all");

  const [filterTab, setFilterTab] = React.useState<FilterTab>("all");
  const [statusDropdownOpen, setStatusDropdownOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  // Column filters state
  const [columnFiltersOpen, setColumnFiltersOpen] = React.useState(false);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFilters>({
    name: "",
    status: "all",
    rating: "all",
    date: "all"
  });
  const [localFilters, setLocalFilters] = React.useState<ColumnFilters>({
    name: "",
    status: "all",
    rating: "all",
    date: "all"
  });

  // Sort state
  const [sortDropdownOpen, setSortDropdownOpen] = React.useState(false);
  const [sortFieldsOrder, setSortFieldsOrder] = React.useState<SortField[]>(defaultSortFieldsOrder);
  const [draggedItem, setDraggedItem] = React.useState<number | null>(null);

  // Vacancy status dropdown state
  const [vacancyStatusDropdownOpen, setVacancyStatusDropdownOpen] = React.useState(false);
  const [currentVacancyStatus, setCurrentVacancyStatus] = React.useState<"active" | "paused" | "archived">("active");

  // Disable local header: use global header from Layout
  const SHOW_LOCAL_HEADER = false;

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPositions, setTotalPositions] = React.useState(0);

  // Create vacancy form state
  const [jobDescription, setJobDescription] = React.useState("");
  const [jobName, setJobName] = React.useState("");
  const [selectedTopics, setSelectedTopics] = React.useState(defaultTopics);
  const [newTag, setNewTag] = React.useState("");
  const [minScore, setMinScore] = React.useState(5);
  const [timePerAnswer, setTimePerAnswer] = React.useState("1 мин");
  const [level, setLevel] = React.useState("Junior");
  const [questionCount, setQuestionCount] = React.useState(5);
  const [questionType, setQuestionType] = React.useState("В основном хард-скиллы");
  
  // Questions state
  const [questions, setQuestions] = React.useState<Array<{
    id: string;
    text: string;
    evaluationCriteria: string;
    weight: number;
    isRequired: boolean;
    order: number;
  }>>([
    {
      id: 'initial-question',
      text: '',
      evaluationCriteria: '',
      weight: 1,
      isRequired: true,
      order: 0
    }
  ]);
  
  // Weight dropdown state
  const [openWeightDropdowns, setOpenWeightDropdowns] = React.useState<Set<string>>(new Set());

  // Interview form handlers
  const handleInterviewFieldChange = (field: string, value: string) => {
    setInterviewFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateInterviewSubmit = async () => {
    if (!selectedPositionId) {
      return;
    }

    if (!interviewFormData.candidateFirstName || !interviewFormData.candidateLastName || !interviewFormData.candidateEmail) {
      return;
    }

    try {
      // Создаем интервью через API
      const interviewData = {
        positionId: selectedPositionId,
        candidateEmail: interviewFormData.candidateEmail,
        firstName: interviewFormData.candidateFirstName,
        lastName: interviewFormData.candidateLastName
      };

      console.log('Создание интервью:', interviewData);
      
      // Вызываем API для создания интервью
      const createdInterview = await apiService.createInterview(interviewData);
      
      console.log('Интервью создано:', createdInterview);
      
      // Сбрасываем форму
      setInterviewFormData({
        candidateFirstName: '',
        candidateLastName: '',
        candidateEmail: ''
      });
      
      // Возвращаемся к списку вакансий
      setViewMode("list");
      
      // Обновляем список кандидатов для выбранной вакансии
      if (selectedPositionId) {
        // Здесь можно добавить обновление списка кандидатов
        console.log('Обновляем список кандидатов для вакансии:', selectedPositionId);
      }
      
    } catch (error) {
      console.error('Ошибка создания интервью:', error);
    }
  };

  // Состояние для редактирования вакансии
  const [editVacancyData, setEditVacancyData] = React.useState<any>(null);

  // API data state
  const [positions, setPositions] = React.useState<ApiPosition[]>([]);
  const [positionsLoading, setPositionsLoading] = React.useState(false);

  // Interview creation form state
  const [interviewFormData, setInterviewFormData] = React.useState({
    candidateFirstName: '',
    candidateLastName: '',
    candidateEmail: ''
  });
  const [positionsError, setPositionsError] = React.useState<string | null>(null);
  const [selectedPositionId, setSelectedPositionId] = React.useState<number | null>(null);
  const selectedPosition = React.useMemo(() => positions.find(p => p.id === selectedPositionId) || null, [positions, selectedPositionId]);
  const [candidates, setCandidates] = React.useState<Candidate[]>([]);
  const [positionCandidateCounts, setPositionCandidateCounts] = React.useState<Record<number, number>>({});

  const handleCandidateSelect = (candidateId: string) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId
          ? { ...candidate, selected: !candidate.selected }
          : candidate,
      ),
    );
  };

  const handleSelectAllCandidates = () => {
    const allSelected = candidates.every(candidate => candidate.selected);
    setCandidates((prev) =>
      prev.map((candidate) => ({
        ...candidate,
        selected: !allSelected,
      })),
    );
  };

  const areAllCandidatesSelected = candidates.length > 0 && candidates.every(candidate => candidate.selected);

  // Helper: map API enums to UI strings
  const mapPositionStatusToUi = (status?: string) => {
    const mapped = mapPositionStatusEnum(status);
    switch (mapped) {
      case "ACTIVE": return "active" as const;
      case "PAUSED": return "paused" as const;
      case "ARCHIVED": return "archived" as const;
      default: return "active" as const;
    }
  };

  // Load positions from API (paged)
  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setPositionsLoading(true);
      setPositionsError(null);
      try {
        const resp = await apiService.getPositions({
          search: searchValue || undefined,
          page: currentPage,
          size: itemsPerPage,
        });
        if (cancelled) return;
        
        console.log('🔍 API Positions Response:', resp);
        console.log('🔍 Positions items:', resp.items);
        
        setPositions(resp.items || []);
        setTotalPositions(resp.total || 0);
        if (!selectedPositionId && resp.items && resp.items.length > 0) {
          setSelectedPositionId(resp.items[0].id);
        }
      } catch (e: any) {
        if (!cancelled) setPositionsError(e?.message || "Ошибка загрузки вакансий");
      } finally {
        if (!cancelled) setPositionsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [searchValue, currentPage]);

  // Update current vacancy status when selection changes
  React.useEffect(() => {
    setCurrentVacancyStatus(mapPositionStatusToUi(selectedPosition?.status as any));
  }, [selectedPosition]);

  // Load candidate counts for visible positions
  React.useEffect(() => {
    let cancelled = false;
    const loadCounts = async () => {
      if (!positions || positions.length === 0) return;
      console.log('🔍 Loading interview counts for positions:', positions.map(p => p.id));
      
      const entries = await Promise.all(
        positions.map(async (p) => {
          try {
            // Загружаем интервью и считаем общее количество
            const interviews = await apiService.getPositionInterviews(p.id);
            console.log(`🔍 Position ${p.id}: ${interviews.length} interviews total`);
            return [p.id, interviews.length] as const;
          } catch {
            return [p.id, 0] as const;
          }
        })
      );
      if (!cancelled) {
        const map: Record<number, number> = {};
        entries.forEach(([id, count]) => { map[id] = count; });
        setPositionCandidateCounts(map);
      }
    };
    loadCounts();
    return () => { cancelled = true; };
  }, [positions]);

  // Load candidates for selected position and enrich with interview info
  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!selectedPositionId) { setCandidates([]); return; }
      try {
        console.log('🔍 Loading interviews for position:', selectedPositionId);
        
        // Загружаем интервью для выбранной позиции
        const interviews: ApiInterview[] = await apiService.getPositionInterviews(selectedPositionId);
        
        console.log('🔍 Loaded interviews:', interviews);
        
        if (cancelled) return;
        
        // Каждое интервью - отдельная строка в таблице
        const uiCandidates: Candidate[] = interviews.map((interview: any) => {
          const candidate = interview.candidate;
          const scoreRaw = interview.aiScore ?? 0;
          const score = Number.isFinite(scoreRaw) ? Number(scoreRaw) : 0;
          
          // Дата завершения или создания
          const completedAt = interview.finishedAt || interview.createdAt || interview.startedAt;
          const dt = completedAt ? new Date(completedAt) : null;
          const completed = dt ? `${String(dt.getDate()).padStart(2,'0')}.${String(dt.getMonth()+1).padStart(2,'0')}.${dt.getFullYear()}` : "—";
          
          // Статус кандидата
          const statusEnum = mapCandidateStatusEnum(candidate?.status as any);
          const status = ((): string => {
            switch (statusEnum) {
              case "REJECTED": return "rejected";
              case "HIRED": return "offer";
              case "FINISHED": return "interview";
              case "NEW":
              case "IN_PROGRESS":
              default: return "screening";
            }
          })();
          
          const result = interview.result || undefined;
          const interviewStatus = interview.status || undefined;
          const archived = interview.status === 'FINISHED' && result === 'UNSUCCESSFUL';
          
          // Имя из candidate или fallback
          const name = candidate?.name || `${candidate?.firstName || ""} ${candidate?.lastName || ""}`.trim() || `Candidate #${candidate?.id}`;
          
          return {
            id: `${interview.id}_${candidate?.id}`, // Уникальный ID для строки
            name,
            email: candidate?.email || '',
            rating: score,
            status,
            completed,
            selected: false,
            result,
            interviewStatus,
            archived,
            // Дополнительные поля для отладки
            interviewId: interview.id,
            candidateId: candidate?.id,
          } as Candidate;
        });
        
        console.log('🔍 Mapped UI candidates:', uiCandidates);
        setCandidates(uiCandidates);
      } catch (e) {
        console.error('🔍 Error loading candidates:', e);
        if (!cancelled) setCandidates([]);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [selectedPositionId]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if ((columnFiltersOpen || sortDropdownOpen || vacancyStatusDropdownOpen) && event.target instanceof Element) {
        const filtersDropdown = event.target.closest('[data-dropdown="column-filters"]');
        const sortDropdown = event.target.closest('[data-dropdown="sort"]');
        const statusDropdown = event.target.closest('[data-dropdown="vacancy-status"]');
        
        if (columnFiltersOpen && !filtersDropdown) {
          setColumnFiltersOpen(false);
        }
        if (sortDropdownOpen && !sortDropdown) {
          setSortDropdownOpen(false);
        }
        if (vacancyStatusDropdownOpen && !statusDropdown) {
          setVacancyStatusDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [columnFiltersOpen, sortDropdownOpen, vacancyStatusDropdownOpen]);

  // Paginated vacancies (from API)
  const totalPages = Math.ceil((totalPositions || 0) / itemsPerPage);
  const paginatedPositions = positions;

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterTab, searchValue]);

  // Filter and sort candidates
  const filteredAndSortedCandidates = React.useMemo(() => {
    let base = candidates;
    if (activeStatusTab !== 'all') {
      base = base.filter((c) => {
        const status = (c as any).interviewStatus;
        const result = (c as any).result;
        switch (activeStatusTab) {
          case 'successful':
            return result === 'SUCCESSFUL';
          case 'failed':
            return result === 'UNSUCCESSFUL' || result === 'ERROR';
          case 'finished':
            return status === 'FINISHED';
          default:
            return true;
        }
      });
    }
    return filterAndSortCandidates(base, columnFilters, sortFieldsOrder);
  }, [candidates, columnFilters, sortFieldsOrder, activeStatusTab]);

  const handleCandidateNameClick = (candidateId: string) => {
    onCandidateClick?.(candidateId);
  };

  const handleCreateVacancy = () => {
    console.log('🔍 handleCreateVacancy: setting viewMode to "create"');
    
    // Сбрасываем режим редактирования и данные
    setIsEditMode(false);
    setEditVacancyData(null);
    
    // Очищаем форму
    setJobName('');
    setJobDescription('');
    setSelectedTopics(defaultTopics);
    setQuestions([]);
    
    setViewMode("create");
    onCreateVacancy?.();
  };

  const handleEditVacancy = () => {
    if (!selectedPosition) {
      console.warn('🔍 handleEditVacancy: нет выбранной вакансии для редактирования');
      return;
    }
    
    console.log('🔍 handleEditVacancy: редактируем вакансию:', selectedPosition);
    
    // Загружаем данные вакансии для редактирования
    setEditVacancyData({
      id: selectedPosition.id,
      title: selectedPosition.title,
      description: selectedPosition.description || '',
      status: selectedPosition.status,
      // Добавим другие поля по мере необходимости
    });
    
    // Заполняем форму данными вакансии
    setJobName(selectedPosition.title || '');
    setJobDescription(selectedPosition.description || '');
    
    setIsEditMode(true);
    setViewMode("create");
    onEditVacancy ? onEditVacancy() : onCreateVacancy?.();
  };

  const handleBackToList = () => {
    console.log('🔍 handleBackToList: setting viewMode to "list"');
    
    // Сбрасываем режим редактирования и данные
    setIsEditMode(false);
    setEditVacancyData(null);
    
    setViewMode("list");
  };

  const handleCandidateClick = (candidate: any) => {
    console.log('🔍 handleCandidateClick: клик на кандидата:', candidate);
    setSelectedCandidate(candidate);
    setViewMode("candidate-answers");
  };

  const handleBackToCandidates = () => {
    console.log('🔍 handleBackToCandidates: возврат к списку кандидатов');
    setSelectedCandidate(null);
    setViewMode("list");
  };

  const toggleAnswer = (questionNumber: number) => {
    setExpandedAnswers(prev => ({
      ...prev,
      [questionNumber]: !prev[questionNumber]
    }));
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTopics((prev) =>
      prev.filter((tag) => tag !== tagToRemove),
    );
  };

  const addTag = () => {
    if (
      newTag.trim() &&
      !selectedTopics.includes(newTag.trim())
    ) {
      setSelectedTopics((prev) => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTag();
    }
  };

  const moveQuestion = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setQuestions((prev) => {
        const newQuestions = [...prev];
        const draggedQuestion = newQuestions[dragIndex];
        newQuestions.splice(dragIndex, 1);
        newQuestions.splice(hoverIndex, 0, draggedQuestion);
        return newQuestions.map((q, index) => ({
          ...q,
          order: index + 1,
        }));
      });
    },
    [],
  );

  // Enhanced drag preview with visual feedback
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

  const handleToggleWeightDropdown = (questionId: string) => {
    setOpenWeightDropdowns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.clear(); // Close all others
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleAddQuestionManually = () => {
    const newQuestion = {
      id: `${Date.now()}`,
      text: "Новый вопрос",
      evaluationCriteria: "",
      weight: 5,
      isRequired: false,
      order: questions.length + 1,
    };
    setQuestions((prev) => [...prev, newQuestion]);
    console.log('🔍 Добавлен новый вопрос:', newQuestion);
  };

  const navigationItems: NavigationItem[] = [
    {
      id: "vacancies",
      label: "Вакансии",
      icon: SuitcaseLineIconV7,
    },
    {
      id: "statistics",
      label: "Статистика",
      icon: PieChartLineIconV7,
    },
    {
      id: "team",
      label: "Управление",
      icon: TeamLineIconV7,
    },
  ];

  // Drag handlers for sort dropdown
  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  // QuestionCard Component - теперь используем вынесенный компонент
  const QuestionCardWrapper = ({ question, index }: { question: any; index: number }) => {
    return (
      <QuestionCard
        question={question}
        index={index}
        questions={questions}
        setQuestions={setQuestions}
        moveQuestion={moveQuestion}
      />
    );
  };

  // Create Vacancy Form Component
  const renderCreateVacancyForm = () => (
    <div className="flex flex-col gap-6 w-full">
      {/* AI Assistant Section */}
      <div className="bg-[#f5f6f1] rounded-[44px] p-6 w-full">
        <div className="space-y-6">
          {/* Back button and title */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToList}
              className="bg-white border border-[#e2e4e9] rounded-lg p-2 hover:bg-[#f6f8fa] transition-colors shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)] flex items-center justify-center"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 16 16"
                stroke="#525866"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 12L6 8L10 4" />
              </svg>
            </button>
            <h2 className="text-[20px] font-medium text-[#000000]">
              {isEditMode ? `Редактирование: ${editVacancyData?.title || 'Вакансия'}` : 'Добавить позицию'}
            </h2>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0">
              <SynergyLogoFigma />
            </div>
            <div className="bg-[#ffdac2] rounded-br-3xl rounded-tl-3xl rounded-tr-3xl p-4 max-w-md">
              <p className="text-[#000000] text-[16px] leading-[24px]">
                Я помогу! Введите описание вакансии в поле ниже и нажмите Сгенерировать
              </p>
            </div>
          </div>

          <div className="bg-[#f6f8fa] rounded-[32px] border border-[#e2e4e9] min-h-[210px] p-6">
            <textarea
              value={jobDescription}
              onChange={(e) =>
                setJobDescription(e.target.value)
              }
              placeholder="Введите описание или ключевые навыки"
              className="w-full h-full min-h-[160px] resize-none border-none outline-none bg-transparent text-[#868c98] text-[16px] leading-[24px]"
            />
          </div>

          <button
            onClick={() => {
              // TODO: Implement AI generation logic
              console.log(
                "Generating with AI:",
                jobDescription,
              );
            }}
            className="bg-gradient-to-b from-[#e16349] to-[#df1c41] text-white px-6 py-4 rounded-[20px] font-medium"
          >
            Сгенерировать
          </button>
        </div>
      </div>

      {/* Job Details Section */}
      <div className="bg-[#f5f6f1] rounded-[44px] p-6 w-full">
        <h3 className="text-[20px] font-medium text-[#000000] mb-6">
          Детали вакансии
        </h3>
        <div className="bg-[#ffffff] rounded-[32px] p-6 space-y-6">
          {/* Job Name */}
          <div className="space-y-1">
            <label className="text-[14px] font-medium text-[#0a0d14]">
              Название
            </label>
            <input
              type="text"
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              className="w-full p-4 border border-[#e2e4e9] rounded-[20px] text-[14px] text-[#868c98]"
              placeholder="Название вакансии"
            />
          </div>

          {/* Topics */}
          <div className="space-y-1">
            <label className="text-[14px] font-medium text-[#0a0d14]">
              Топик
            </label>
            <input
              type="text"
              className="w-full p-4 border border-[#e2e4e9] rounded-[20px] text-[14px] text-[#525866]"
              placeholder="Добавить топик"
            />
            <div className="flex gap-2 pt-2">
              {selectedTopics.map((topic) => (
                <div
                  key={topic}
                  className="bg-[#ffffff] border border-[#e2e4e9] rounded-xl px-2 py-1 flex items-center gap-1"
                >
                  <span className="text-[12px] text-[#525866]">
                    {topic}
                  </span>
                  <button
                    onClick={() => removeTag(topic)}
                    className="text-[#868c98] hover:text-[#df1c41]"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 12 12"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 3L3 9M3 3l6 6"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Search Tags */}
          <div className="space-y-1">
            <label className="text-[14px] font-medium text-[#0a0d14]">
              Теги для поиска{" "}
              <span className="text-[#525866] font-normal">
                (Опционально)
              </span>
            </label>
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-4 border border-[#e2e4e9] rounded-[20px] text-[14px] text-[#868c98]"
              placeholder="Введите или создайте тег"
            />
          </div>
        </div>
      </div>

      {/* Conditions Section */}
      <div className="bg-[#f5f6f1] rounded-[44px] p-6 w-full">
        <h3 className="text-[20px] font-medium text-[#000000] mb-6">
          Условия
        </h3>
        <div className="bg-[#ffffff] rounded-[32px] p-6 space-y-8">
          {/* Minimum Score */}
          <div className="space-y-6">
            <label className="text-[14px] font-medium text-[#0a0d14]">
              Минимальная оценка
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                <button
                  key={score}
                  onClick={() => setMinScore(score)}
                  className={`w-12 h-12 rounded-lg font-medium text-[16px] ${
                    minScore === score
                      ? "bg-[#e16349] text-white"
                      : "bg-[#f6f8fa] text-[#0a0d14]"
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>

          {/* Time per Answer */}
          <div className="space-y-6">
            <label className="text-[14px] font-medium text-[#0a0d14]">
              Время на один ответ
            </label>
            <div className="flex gap-2 flex-wrap">
              {timeOptions.map((time) => (
                <button
                  key={time}
                  onClick={() => setTimePerAnswer(time)}
                  className={`px-4 py-3 rounded-3xl font-medium text-[16px] ${
                    timePerAnswer === time
                      ? "bg-[#e16349] text-white"
                      : "bg-[#f6f8fa] text-[#0a0d14]"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Level */}
          <div className="space-y-6">
            <label className="text-[14px] font-medium text-[#0a0d14]">
              Уровень
            </label>
            <div className="flex gap-2">
              {levelOptions.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`px-4 py-3 rounded-3xl font-medium text-[16px] ${
                    level === lvl
                      ? "bg-[#e16349] text-white"
                      : "bg-[#f6f8fa] text-[#0a0d14]"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interview Questions Section */}
      <div className="bg-[#f5f6f1] rounded-[44px] p-8 w-full">
        <h3 className="text-[20px] font-medium text-[#000000] mb-8">
          Вопросы для интервью {questions.length > 0 && `(${questions.length})`}
        </h3>
        <div className="bg-[#ffffff] rounded-[32px] p-6 space-y-8">
          {/* Question Count */}
          <div className="flex items-center gap-4 flex-wrap">
            <label className="text-[14px] font-medium text-[#0a0d14]">
              Сколько вопросов сгенерировать?
            </label>
            {questionCountOptions.map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`w-12 h-12 rounded-lg font-medium text-[16px] ${
                  questionCount === count
                    ? "bg-[#e16349] text-white"
                    : "bg-[#f6f8fa] text-[#0a0d14]"
                }`}
              >
                {count}
              </button>
            ))}
          </div>

          {/* Question Type */}
          <div className="space-y-1">
            <label className="text-[14px] font-medium text-[#0a0d14]">
              Что проверяем?
            </label>
            <div className="relative">
              <select
                value={questionType}
                onChange={(e) =>
                  setQuestionType(e.target.value)
                }
                className="w-full p-4 border border-[#e2e4e9] rounded-[20px] text-[14px] text-[#525866] appearance-none bg-white"
              >
                {questionTypeOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <ArrowDownSLineIconV7 className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Questions List */}
        {questions.length > 0 && (
          <div className="mt-8 space-y-6">
            {questions.map((question, index) => (
                              <QuestionCardWrapper
                  key={question.id}
                  question={question}
                  index={index}
                />
            ))}
          </div>
        )}

        {/* Action Buttons - moved after questions */}
        <div className="flex gap-2 mt-8">
          <button
            onClick={() => {
              // TODO: Implement AI question generation
              console.log("Generating questions with AI");
            }}
            className="bg-gradient-to-b from-[#e16349] to-[#df1c41] text-white px-6 py-5 rounded-3xl font-medium"
          >
            Сгенерировать с AI
          </button>
          <button
            onClick={handleAddQuestionManually}
            className="bg-[#ffffff] border border-[#e16349] text-[#e16349] px-6 py-5 rounded-3xl font-medium flex items-center gap-2"
          >
            <AddFillIconV7 />
            Добавить вручную
          </button>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex gap-2 justify-start">
        <button
          onClick={handleBackToList}
          className="bg-[#e16349] text-white px-6 py-4 rounded-3xl font-medium"
        >
          {isEditMode ? 'Сохранить изменения' : 'Создать вакансию'}
        </button>
        <button
          onClick={handleBackToList}
          className="bg-[#ffffff] text-[#525866] px-6 py-4 rounded-3xl font-medium"
        >
          Отмена
        </button>
      </div>
    </div>
  );

  // Функция для определения уровня вакансии
  const getVacancyLevel = (title: string, description?: string): string => {
    const text = `${title} ${description || ''}`.toLowerCase();
    
    if (text.includes('senior') || text.includes('lead') || text.includes('руководитель')) {
      return 'Lead';
    } else if (text.includes('middle') || text.includes('средний')) {
      return 'Middle';
    } else if (text.includes('junior') || text.includes('младший')) {
      return 'Junior';
    } else if (text.includes('intern') || text.includes('стажер')) {
      return 'Intern';
    }
    
    return 'Middle'; // По умолчанию
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-[#e9eae2] relative min-h-screen">
      <div className="relative">
        <div className="[flex-flow:wrap] box-border content-start flex gap-6 items-start justify-start p-0 relative w-full">
                    {/* Локальный хедер отключён — используется глобальный из Layout */}
          {SHOW_LOCAL_HEADER && (
            <VacancyHeader
              activeTab={activeTab}
              onTabChange={onTabChange}
              onUserProfileClick={onUserProfileClick}
              navigationItems={navigationItems}
            />
          )}

          {/* Центрирующий контейнер для контента (ширина и отступы задаёт Layout) */}
          <div className="w-full">
            <div className="flex gap-6 w-full">
              {/* Vacancies Sidebar - ВСЕГДА ВИДНА */}
              <div className="bg-[#f5f6f1] box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative rounded-[44px] shrink-0 w-[460px]">
                {/* Sidebar Header */}
                <div className="box-border content-stretch flex flex-col gap-8 items-start justify-start p-0 relative shrink-0 w-full">
                  <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
                    <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-2 py-0 relative shrink-0">
                                             <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative text-[#000000] text-[32px] text-left truncate max-w-[680px]">
                        <p className="block leading-[40px] line-clamp-2 whitespace-normal break-words">
                          Вакансии
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleCreateVacancy}
                      className="bg-[#e16349] box-border content-stretch flex flex-row gap-2 items-center justify-center overflow-clip p-[14px] relative rounded-3xl shadow-[0px_1px_2px_0px_rgba(55,93,251,0.08)] shrink-0 hover:bg-[#d14a31] transition-colors"
                    >
                      <AddFillIconV7 />
                    </button>
                  </div>

                  {/* Filters */}
                  <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start p-0 relative shrink-0 w-full">
                    {/* Toggle Filter */}
                    <div className="bg-[#f5f6f1] relative rounded-3xl shrink-0 w-full">
                      <div className="overflow-clip relative size-full">
                        <TabToggle
                          options={[
                            { id: "all", label: "Все" },
                            { id: "my", label: "Мои" },
                          ]}
                          activeTab={filterTab}
                          onTabChange={setFilterTab}
                          className="w-full"
                          radius="rounded-3xl"
                        />
                      </div>
                      <div
                        aria-hidden="true"
                        className="absolute border border-[#cdd0d5] border-solid inset-0 pointer-events-none rounded-3xl"
                      />
                    </div>

                    {/* Status Dropdown */}
                    <button
                      onClick={() =>
                        setStatusDropdownOpen(
                          !statusDropdownOpen,
                        )
                      }
                      className="bg-[#ffffff] relative rounded-3xl shrink-0 w-full cursor-pointer transition-all hover:bg-[#f6f8fa]"
                    >
                      <div className="flex flex-row items-center overflow-clip relative size-full">
                        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start pl-3.5 pr-3 py-3.5 relative w-full">
                          <div className="basis-0 css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#525866] text-[16px] text-left tracking-[-0.176px]">
                            <p className="block leading-[24px]">
                              Все статусы
                            </p>
                          </div>
                          <ArrowDownSLineIconV7
                            className={`${statusDropdownOpen ? "rotate-180" : ""}`}
                          />
                        </div>
                      </div>
                      <div
                        aria-hidden="true"
                        className="absolute border border-[#cdd0d5] border-solid inset-0 pointer-events-none rounded-3xl shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)]"
                      />
                    </button>

                    {/* Search */}
                    <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full">
                      <div className="basis-0 bg-[#ffffff] grow min-h-px min-w-px relative rounded-3xl shrink-0">
                        <div className="flex flex-row items-center overflow-clip relative size-full">
                          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-[14px] relative w-full">
                            <Search2LineIconV7 className="shrink-0" />
                            <input
                              type="text"
                              value={searchValue}
                              onChange={(e) =>
                                setSearchValue(e.target.value)
                              }
                              placeholder="Поиск..."
                              className="basis-0 css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#525866] text-[16px] text-left tracking-[-0.176px] bg-transparent border-none outline-none placeholder:text-[#525866]"
                            />
                          </div>
                        </div>
                        <div
                          aria-hidden="true"
                          className="absolute border border-[#cdd0d5] border-solid inset-0 pointer-events-none rounded-3xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vacancies List (API data) */}
                <div className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 min-h-[440px]">
                  {paginatedPositions.map((p) => {
                    const uiStatus = mapPositionStatusToUi(p.status as any);
                    const interviewCount = positionCandidateCounts[p.id] ?? 0;
                    const vacancyLevel = getVacancyLevel(p.title, p.description);
                    
                    console.log(`🔍 Rendering vacancy ${p.id}:`, {
                      title: p.title,
                      company: p.company,
                      status: p.status,
                      uiStatus,
                      interviewCount,
                      vacancyLevel
                    });
                    
                    return (
                      <VacancyCard
                        key={p.id}
                        id={p.id.toString()}
                        title={p.title}
                        department={p.company}
                        level={vacancyLevel}
                        status={uiStatus}
                        candidateCount={interviewCount}
                        isSelected={selectedPositionId === p.id}
                        onClick={() => setSelectedPositionId(p.id)}
                      />
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center w-full">
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>

              {/* Main Content - Правая колонка всегда видна */}
              				<div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-[1110px]">
                {/* DEBUG: viewMode = {viewMode} */}
                {/* Условный рендеринг контента правой колонки */}
                {viewMode === "create" ? (
                  // Форма создания вакансии в правой колонке
                  (() => {
                    console.log('🔍 RENDERING: Показываем форму создания вакансии');
                    return renderCreateVacancyForm();
                  })()
                ) : viewMode === "create-interview" ? (
                  // Форма создания интервью в правой колонке
                  (() => {
                    console.log('🔍 RENDERING: Показываем форму создания интервью');
                    return (
                      <InterviewCreationForm
                        selectedPositionId={selectedPositionId}
                        interviewFormData={interviewFormData}
                        handleInterviewFieldChange={handleInterviewFieldChange}
                        handleCreateInterviewSubmit={handleCreateInterviewSubmit}
                        onBack={() => setViewMode("list")}
                      />
                    );
                  })()
                ) : viewMode === "candidate-answers" ? (
                  // Результаты собеседования кандидата в правой колонке
                  (() => {
                    console.log('🔍 RENDERING: Показываем результаты кандидата:', selectedCandidate);
                    return (
                      <div className="flex flex-col gap-6 w-full">
                        {/* Карточка 1: Имя кандидата и действия */}
                        <div className="bg-[#f5f6f1] relative rounded-[44px] shrink-0 w-full">
                          <div className="relative size-full">
                            <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative w-full">
                              {/* Header with Actions */}
                              <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
                                <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#000000] text-[32px] text-center text-nowrap">
                                  <p className="block leading-[40px] whitespace-pre">
                                    {selectedCandidate?.name || 'Виктор Хомула'}
                                  </p>
                                </div>
                                
                                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
                                  {/* Download PDF */}
                                  <button className="bg-[#ffffff] relative rounded-3xl shrink-0 hover:bg-[#f6f8fa] transition-colors cursor-pointer">
                                    <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip px-2.5 py-3.5 relative">
                                      <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                                        <div className="css-1tg14q font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#e16349] text-[16px] text-center text-nowrap tracking-[-0.176px]">
                                          <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">Скачать pdf</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="absolute border border-[#e16349] border-solid inset-0 pointer-events-none rounded-3xl" />
                                  </button>
                                  
                                  {/* Share Button */}
                                  <button className="bg-[#e16349] box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative rounded-3xl shrink-0 hover:bg-[#d14a31] transition-colors cursor-pointer">
                                    <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                                      <div className="css-rpndqk font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-center text-nowrap tracking-[-0.176px]">
                                        <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">Поделиться</p>
                                      </div>
                                    </div>
                                  </button>
                                  
                                  {/* Interview Link */}
                                  <button className="bg-[#ffffff] box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative rounded-3xl shrink-0 hover:bg-[#f6f8fa] transition-colors cursor-pointer">
                                    <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                                      <div className="css-bbeeyw font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[16px] text-center text-nowrap tracking-[-0.176px]">
                                        <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">Ссылка на интервью</p>
                                      </div>
                                    </div>
                                  </button>
                                  
                                  {/* Create Interview */}
                                  <button 
                                    onClick={() => {
                                      if (!selectedPositionId) {
                                        alert('Сначала выберите вакансию из списка слева');
                                        return;
                                      }
                                      setViewMode("create-interview");
                                    }}
                                    className="bg-[#ffffff] box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative rounded-3xl shrink-0 hover:bg-[#f6f8fa] transition-colors cursor-pointer border border-[#e16349]"
                                  >
                                    <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                                      <div className="css-1tg14q font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#e16349] text-[16px] text-center text-nowrap tracking-[-0.176px]">
                                        <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">Создать интервью</p>
                                      </div>
                                    </div>
                                  </button>
                                </div>
                              </div>

                              {/* Candidate Stats */}
                              <div className="bg-[#ffffff] relative rounded-3xl shrink-0 w-full">
                                <div className="relative size-full">
                                  <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative w-full">
                                    <div className="box-border content-stretch flex flex-row gap-16 items-center justify-start p-0 relative shrink-0 w-full">
                                      {/* Rating */}
                                      <div className="box-border content-stretch flex flex-col gap-2 items-start justify-center leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-nowrap tracking-[-0.176px]">
                                        <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#525866]">
                                          <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">Оценка</p>
                                        </div>
                                        <div className="css-o3fd0r font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[#38c793]">
                                          <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">7</p>
                                        </div>
                                      </div>

                                      {/* Passed */}
                                      <div className="box-border content-stretch flex flex-col gap-2 items-start justify-center leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-nowrap tracking-[-0.176px]">
                                        <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#525866]">
                                          <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">Пройдено</p>
                                        </div>
                                        <div className="css-o3fd0r font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[#38c793]">
                                          <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">Да</p>
                                        </div>
                                      </div>

                                      {/* Questions Answered */}
                                      <div className="box-border content-stretch flex flex-col gap-2 items-start justify-center leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-nowrap tracking-[-0.176px]">
                                        <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#525866]">
                                          <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">Вопросов отвечено</p>
                                        </div>
                                        <div className="css-8vheua font-['Inter:Semi_Bold',_sans-serif] font-semibold relative shrink-0 text-[#000000]">
                                          <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">10/10</p>
                                        </div>
                                      </div>

                                      {/* Contact Info */}
                                      <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-[211px]">
                                        <div className="box-border content-stretch flex flex-row items-center justify-between leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-nowrap tracking-[-0.176px] w-full">
                                          <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#525866]">
                                            <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">Email</p>
                                          </div>
                                          <div className="css-8vheua font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[#000000]">
                                            <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">torvik331@gmail.com</p>
                                          </div>
                                        </div>
                                        
                                        <div className="box-border content-stretch flex flex-row items-center justify-between leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-nowrap tracking-[-0.176px] w-full">
                                          <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#525866]">
                                            <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">Телефон</p>
                                          </div>
                                          <div className="css-8vheua font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[#000000]">
                                            <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">+79110165306</p>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Timestamps */}
                                      <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-52">
                                        <div className="box-border content-stretch flex flex-row items-center justify-between leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-nowrap tracking-[-0.176px] w-full">
                                          <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#525866]">
                                            <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">Создано</p>
                                          </div>
                                          <div className="css-8vheua font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[#000000]">
                                            <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">18.07.25, 14:04</p>
                                          </div>
                                        </div>
                                        
                                        <div className="box-border content-stretch flex flex-row items-center justify-between leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-nowrap tracking-[-0.176px] w-full">
                                          <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal relative shrink-0 text-[#525866]">
                                            <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">Завершено</p>
                                          </div>
                                          <div className="css-8vheua font-['Inter:Medium',_sans-serif] font-medium relative shrink-0 text-[#000000]">
                                            <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">19.07.25, 19:20</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Карточка 2: Краткие итоги */}
                        <div className="bg-[#f5f6f1] relative rounded-[44px] shrink-0 w-full">
                          <div className="relative size-full">
                            <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-[24px] relative w-full">
                              <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#000000] text-[20px] text-left w-full">
                                <p className="block leading-[28px]">Краткие итоги</p>
                              </div>
                              
                              <div className="bg-[#ffffff] relative rounded-[32px] shrink-0 w-full">
                                <div className="flex flex-row items-center justify-center relative size-full">
                                  <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center p-[24px] relative w-full">
                                    <div className="basis-0 css-5cyu6a font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#000000] text-[14px] text-left tracking-[-0.084px]">
                                      <p className="block leading-[20px]">
                                        Кандидат продемонстрировал хороший опыт работы и понимание ключевых технологий, однако в ответах не хватало глубины и конкретики. Он четко объяснил причины смены работы и критерии выбора нового работодателя. Тем не менее, в некоторых ответах наблюдается подглядывание, что вызывает определенные сомнения. Общая оценка 7 из 10, что соответствует минимальным требованиям для позиции. Рекомендуется обратить внимание на углубление знаний в некоторых областях.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Карточка 3: Детали */}
                        <div className="bg-[#f5f6f1] relative rounded-[44px] shrink-0 w-full">
                          <div className="relative size-full">
                            <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative w-full">
                              <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#000000] text-[20px] text-left w-full">
                                <p className="block leading-[28px]">Детали</p>
                              </div>
                              
                              {/* Вопрос 1 */}
                              <div className="bg-[#ffffff] relative rounded-[32px] shrink-0 w-full">
                                <div className="flex flex-row items-center justify-center relative size-full">
                                  <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-[24px] relative w-full">
                                    <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
                                      <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left">
                                        <p className="block leading-[24px]">Вопрос 1</p>
                                      </div>
                                      <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left">
                                        <p className="block leading-[20px]">Вес вопроса: 7</p>
                                      </div>
                                    </div>
                                    
                                    <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left">
                                      <p className="block leading-[20px]">
                                        Расскажите о вашем опыте работы и о проектах на последних двух местах работы.
                                      </p>
                                    </div>
                                    
                                    <div className="bg-[#f8f9fa] relative rounded-[20px] shrink-0 w-full">
                                      <div className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-[16px] relative w-full">
                                        <div className="css-bbeeyw font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left">
                                          <p className="block leading-[20px]">ИИ комментарий</p>
                                        </div>
                                        <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left">
                                          <p className="block leading-[20px]">
                                            Кандидат чётко обозначил компанию, период работы и свою роль. Описал задачи: разработка и оптимизация веб-интерфейса, интеграция ВМС с ERP, внедрение дешбордов. Привёл конкретные результаты: снижение ручного ввода на 40%, рост ключевых метрик на 52%. Хорошо, что упомянуты бизнес-эффекты и технические направления. Однако не раскрыты используемые технологии и стек, а также не упомянут второй проект, что немного снижает полноту ответа.
                                          </p>
                                        </div>
                                        <div className="css-bbeeyw font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#38c793] text-[14px] text-left">
                                          <p className="block leading-[20px]">Оценка: 7</p>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Ответ кандидата (скрыт по умолчанию) */}
                                    {expandedAnswers[1] && (
                                      <div className="bg-[#f8f9fa] relative rounded-[20px] shrink-0 w-full">
                                        <div className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-[16px] relative w-full">
                                          <div className="css-bbeeyw font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left">
                                            <p className="block leading-[20px]">Ответ кандидата</p>
                                          </div>
                                          <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left">
                                            <p className="block leading-[20px]">
                                              Работал в компании "ТехСтрой" с 2022 по 2024 год в должности Frontend разработчика. Основные задачи: разработка и оптимизация веб-интерфейса для системы управления строительными проектами, интеграция с внешними API, внедрение новых компонентов UI. Достижения: снижение времени загрузки страниц на 30%, улучшение пользовательского опыта.
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    
                                    <button 
                                      onClick={() => toggleAnswer(1)}
                                      className="css-bbeeyw font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#e16349] text-[14px] text-left cursor-pointer hover:text-[#d14a31] transition-colors"
                                    >
                                      <p className="block leading-[20px]">
                                        {expandedAnswers[1] ? 'Скрыть ответ' : 'Показать ответ'}
                                      </p>
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Вопрос 2 */}
                              <div className="bg-[#ffffff] relative rounded-[32px] shrink-0 w-full">
                                <div className="flex flex-row items-center justify-center relative size-full">
                                  <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-[24px] relative w-full">
                                    <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
                                      <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left">
                                        <p className="block leading-[24px]">Вопрос 2</p>
                                      </div>
                                      <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left">
                                        <p className="block leading-[20px]">Вес вопроса: 7</p>
                                      </div>
                                    </div>
                                    
                                    <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left">
                                      <p className="block leading-[20px]">
                                        Почему решили сейчас поменять работу?
                                      </p>
                                    </div>
                                    
                                    <div className="bg-[#f8f9fa] relative rounded-[20px] shrink-0 w-full">
                                      <div className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-[16px] relative w-full">
                                        <div className="css-bbeeyw font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left">
                                          <p className="block leading-[20px]">ИИ комментарий</p>
                                        </div>
                                        <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left">
                                          <p className="block leading-[20px]">
                                            Кандидат четко объяснил причину смены работы: отсутствие развития на текущем проекте и желание реализовать свои идеи, а также повысить свой профессиональный уровень. Это говорит о мотивации к росту и стремлении к новым задачам. Минус — не упомянуты дополнительные аспекты, такие как командная атмосфера или корпоративная культура, но для короткого ответа информации достаточно.
                                          </p>
                                        </div>
                                        <div className="css-bbeeyw font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#38c793] text-[14px] text-left">
                                          <p className="block leading-[20px]">Оценка: 7</p>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Ответ кандидата (показывается только когда развернут) */}
                                    {expandedAnswers[2] && (
                                      <div className="bg-[#f8f9fa] relative rounded-[20px] shrink-0 w-full">
                                        <div className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-[16px] relative w-full">
                                          <div className="css-bbeeyw font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left">
                                            <p className="block leading-[20px]">Ответ кандидата</p>
                                          </div>
                                          <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left">
                                            <p className="block leading-[20px]">
                                              Проект вышел на плато, доработка планируется приложением, но не будет выпуска новых модулей. Сейчас еще для себя новый проект, чтобы реализовать все свои задумки и повысить свой грейд.
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    
                                    <button 
                                      onClick={() => toggleAnswer(2)}
                                      className="css-bbeeyw font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#e16349] text-[14px] text-left cursor-pointer hover:text-[#d14a31] transition-colors"
                                    >
                                      <p className="block leading-[20px]">
                                        {expandedAnswers[2] ? 'Скрыть ответ' : 'Показать ответ'}
                                      </p>
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Вопрос 3 */}
                              <div className="bg-[#ffffff] relative rounded-[32px] shrink-0 w-full">
                                <div className="flex flex-row items-center justify-center relative size-full">
                                  <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-[24px] relative w-full">
                                    <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
                                      <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left">
                                        <p className="block leading-[24px]">Вопрос 3</p>
                                      </div>
                                      <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left">
                                        <p className="block leading-[20px]">Вес вопроса: 7</p>
                                      </div>
                                    </div>
                                    
                                    <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left">
                                      <p className="block leading-[20px]">
                                        По каким критериям вы будете выбирать новую компанию, если получите 2 оффера на одинаковую заработную плату?
                                      </p>
                                    </div>
                                    
                                    <div className="bg-[#f8f9fa] relative rounded-[20px] shrink-0 w-full">
                                      <div className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-[16px] relative w-full">
                                        <div className="css-bbeeyw font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left">
                                          <p className="block leading-[20px]">ИИ комментарий</p>
                                        </div>
                                        <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left">
                                          <p className="block leading-[20px]">
                                            Кандидат дал развернутый и содержательный ответ, выделив ключевые критерии выбора: репутация и стабильность компании, командные процессы, атмосфера и коммуникация, используемый стек технологий, возможности для карьерного роста и обучения, а также дополнительные бонусы (ДМС, курсы, фитнес, техника). Ответ демонстрирует зрелый подход к выбору работодателя и понимание значимости не только зарплаты, но и нематериальных факторов. Можно было бы чуть подробнее раскрыть приоритеты между этими критериями, но для короткого интервью ответ очень хороший.
                                          </p>
                                        </div>
                                        <div className="css-bbeeyw font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#38c793] text-[14px] text-left">
                                          <p className="block leading-[20px]">Оценка: 7</p>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Ответ кандидата (скрыт по умолчанию) */}
                                    {expandedAnswers[3] && (
                                      <div className="bg-[#f8f9fa] relative rounded-[20px] shrink-0 w-full">
                                        <div className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-[16px] relative w-full">
                                          <div className="css-bbeeyw font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left">
                                            <p className="block leading-[20px]">Ответ кандидата</p>
                                          </div>
                                          <div className="css-bbeeyw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left">
                                            <p className="block leading-[20px]">
                                              При выборе между двумя компаниями с одинаковой зарплатой я буду ориентироваться на: репутацию и стабильность компании, командные процессы и атмосферу, используемый стек технологий, возможности для карьерного роста и обучения, дополнительные бонусы (ДМС, курсы, фитнес, техника). Важно работать в команде профессионалов, где есть возможность развиваться и реализовывать интересные проекты.
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    
                                    <button 
                                      onClick={() => toggleAnswer(3)}
                                      className="css-bbeeyw font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#e16349] text-[14px] text-left cursor-pointer hover:text-[#d14a31] transition-colors"
                                    >
                                      <p className="block leading-[20px]">
                                        {expandedAnswers[3] ? 'Скрыть ответ' : 'Показать ответ'}
                                      </p>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  // Детали вакансии в правой колонке
                  <>
                    {/* Первая карточка - Информация о вакансии */}
                    <div className="bg-[#f5f6f1] box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative rounded-[44px] shrink-0 w-full">
                  <div className="box-border content-stretch flex flex-row items-center justify-between gap-6 p-0 relative shrink-0 w-full">
                    <div className="css-sqkidj font-['Inter_Display:Medium',_sans-serif] leading-[0] not-italic relative text-[#000000] text-[32px] text-left flex-1 min-w-0">
                      <p className="block leading-[40px] line-clamp-2 whitespace-normal break-words" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {selectedPosition?.title || 'Вакансия'}
                      </p>
                    </div>

                    <div className="box-border content-stretch flex flex-row gap-2 items-center justify-end min-h-px min-w-px p-0 relative shrink-0">
                      <button
                        onClick={() => {
                          if (!selectedPositionId) {
                            alert('Сначала выберите вакансию из списка слева, а затем нажмите "Создать интервью"');
                            return;
                          }
                          setViewMode("create-interview");
                        }}
                        className="bg-[#e16349] box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative rounded-3xl shrink-0 hover:bg-[#d14a31] transition-colors"
                      >
                        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                          <div className="css-rpndqk font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-center text-nowrap tracking-[-0.176px]">
                            <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
                              Создать интервью
                            </p>
                          </div>
                        </div>
                      </button>
                      <button className="bg-[#ffffff] box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative rounded-3xl shrink-0 hover:bg-[#f6f8fa] transition-colors">
                        <LinkIconV7 />
                        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                          <div className="css-bbeeyw font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[16px] text-center text-nowrap tracking-[-0.176px]">
                            <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
                              Ссылка на интервью
                            </p>
                          </div>
                        </div>
                      </button>

                      <button 
                        onClick={handleEditVacancy}
                        className="bg-[#ffffff] box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative rounded-3xl shrink-0 hover:bg-[#f6f8fa] transition-colors"
                      >
                        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                          <div className="css-bbeeyw font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[16px] text-center text-nowrap tracking-[-0.176px]">
                            <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
                              Редактировать
                            </p>
                          </div>
                        </div>
                      </button>

                      <div className="relative" data-dropdown="vacancy-status">
                        <button 
                          onClick={() => setVacancyStatusDropdownOpen(!vacancyStatusDropdownOpen)}
                          className="bg-[#ffffff] box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative rounded-3xl shrink-0 hover:bg-[#f6f8fa] transition-colors"
                        >
                          <ChartLegendDotsIcon />
                          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                            <div className="css-bbeeyw font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[16px] text-center text-nowrap tracking-[-0.176px]">
                              <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
                                {getVacancyStatusLabel(currentVacancyStatus)}
                              </p>
                            </div>
                          </div>
                          <ArrowDownSLineIconV7 className={`${vacancyStatusDropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                        
                        {vacancyStatusDropdownOpen && (
                          <div className="absolute top-full right-0 mt-2 w-[160px] bg-[#ffffff] rounded-[20px] border border-[#e2e4e9] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)] z-[9999] p-1">
                            <div className="flex flex-col gap-0.5">
                              {["active", "paused", "archived"].map((status) => (
                                <button
                                  key={status}
                                  onClick={() => {
                                    setCurrentVacancyStatus(status as any);
                                    setVacancyStatusDropdownOpen(false);
                                  }}
                                  className={`flex items-center justify-start px-3 py-2 rounded-[16px] font-['Inter:Medium',_sans-serif] font-medium text-[14px] transition-colors hover:bg-[#f6f8fa] ${
                                    currentVacancyStatus === status 
                                      ? "bg-[#f6f8fa] text-[#e16349]" 
                                      : "text-[#525866]"
                                  }`}
                                >
                                  {getVacancyStatusLabel(status as any)}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#ffffff] relative rounded-3xl shrink-0 w-full">
                    <div className="relative size-full">
                      <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative w-full">
                        <div className="box-border content-stretch flex flex-row items-start justify-between p-0 relative shrink-0 w-full">
                          <div className="box-border content-stretch flex flex-row gap-[68px] items-center justify-start p-0 relative shrink-0">
                            <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-[181px]">
                              <div className="box-border content-stretch flex flex-row font-['Inter:Regular',_sans-serif] font-normal gap-2 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-nowrap tracking-[-0.176px]">
                                <div className="css-bbeeyw relative shrink-0 text-[#525866]">
                                  <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
                                    Созданно
                                  </p>
                                </div>
                                <div className="css-8vheua relative shrink-0 text-[#000000]">
                                  <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
                                    17.07.2025
                                  </p>
                                </div>
                              </div>
                              <div className="box-border content-stretch flex flex-row font-['Inter:Regular',_sans-serif] font-normal gap-2 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-nowrap tracking-[-0.176px] w-full">
                                <div className="css-bbeeyw relative shrink-0 text-[#525866]">
                                  <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
                                    Топик
                                  </p>
                                </div>
                                <div className="css-8vheua relative shrink-0 text-[#000000]">
                                  <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
                                    Разработка
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-[188px]">
                              <div className="box-border content-stretch flex flex-row font-['Inter:Regular',_sans-serif] font-normal gap-2 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-nowrap tracking-[-0.176px] w-full">
                                <div className="css-bbeeyw relative shrink-0 text-[#525866]">
                                  <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
                                    Минимальный балл
                                  </p>
                                </div>
                                <div className="css-8vheua relative shrink-0 text-[#000000]">
                                  <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
                                    5.0
                                  </p>
                                </div>
                              </div>
                              <div className="box-border content-stretch flex flex-row font-['Inter:Regular',_sans-serif] font-normal items-center justify-between leading-[0] not-italic p-0 relative shrink-0 text-[16px] text-left text-nowrap tracking-[-0.176px] w-full">
                                <div className="css-bbeeyw relative shrink-0 text-[#525866]">
                                  <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
                                    Средний балл
                                  </p>
                                </div>
                                <div className="css-8vheua relative shrink-0 text-[#000000]">
                                  <p className="adjustLetterSpacing block leading-[24px] text-nowrap whitespace-pre">
                                    6.5
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative shrink-0">
                            <div className="css-8vheua font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left text-nowrap tracking-[-0.176px]">
                              <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
                                Исполнитель:
                              </p>
                            </div>
                            <div className="box-border content-stretch flex flex-row gap-1.5 items-center justify-center p-0 relative shrink-0">
                              <AccountCircleLineIcon />
                              <div className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0">
                                <div className="css-2x1u1o font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-center text-nowrap tracking-[-0.084px]">
                                  <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                                    Не выбран
                                  </p>
                                </div>
                              </div>
                              <button className="box-border content-stretch flex flex-row gap-2 items-start justify-start overflow-clip p-0 relative rounded-3xl shrink-0 hover:bg-[#f6f8fa] transition-colors">
                                <ArrowDownSLineIconV7 />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  </div>

                  {/* Вторая карточка - Табы с контентом */}
                  <div className="bg-[#f5f6f1] relative rounded-[44px] shrink-0 w-full min-h-[calc(100vh-280px)]">
                    <div className="flex flex-col items-start relative size-full">
                      <div className="box-border content-stretch flex flex-col gap-[21px] items-start justify-start p-[24px] pr-[14px] relative w-full">
                        {/* Content Toggle */}
                        <div className="bg-[#f5f6f1] relative rounded-3xl shrink-0">
                          <div className="box-border content-stretch flex flex-row gap-1 items-start justify-start overflow-clip relative p-1 rounded-3xl">
                            <div
                              onClick={() =>
                                setContentTab("candidates")
                              }
                              className={`${contentTab === "candidates" ? "bg-[#ffffff] shadow-[0px_6px_10px_0px_rgba(27,28,29,0.06),0px_2px_4px_0px_rgba(27,28,29,0.02)]" : "bg-[#f5f6f1]"} box-border content-stretch flex flex-row gap-1.5 items-center justify-center p-[12px] relative rounded-3xl shrink-0 cursor-pointer`}
                            >
                              <div
                                className={`font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[14px] text-left text-nowrap tracking-[-0.084px] ${contentTab === "candidates" ? "text-[#e16349]" : "text-[#868c98]"}`}
                              >
                                <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                                  Собеседования
                                </p>
                              </div>
                            </div>

                            <div
                              onClick={() =>
                                setContentTab("text")
                              }
                              className={`${contentTab === "text" ? "bg-[#ffffff] shadow-[0px_6px_10px_0px_rgba(27,28,29,0.06),0px_2px_4px_0px_rgba(27,28,29,0.02)]" : "bg-[#f5f6f1]"} box-border content-stretch flex flex-row gap-1.5 items-center justify-center overflow-clip p-[12px] relative rounded-3xl shrink-0 cursor-pointer`}
                            >
                              <div
                                className={`font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[14px] text-left text-nowrap tracking-[-0.084px] ${contentTab === "text" ? "text-[#e16349]" : "text-[#868c98]"}`}
                              >
                                <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                                  Текст вакансии
                                </p>
                              </div>
                            </div>

                            <div
                              onClick={() =>
                                setContentTab("questions")
                              }
                              className={`${contentTab === "questions" ? "bg-[#ffffff] shadow-[0px_6px_10px_0px_rgba(27,28,29,0.06),0px_2px_4px_0px_rgba(27,28,29,0.02)]" : "bg-[#f5f6f1]"} box-border content-stretch flex flex-row gap-1.5 items-center justify-center overflow-clip p-[12px] relative rounded-3xl shrink-0 cursor-pointer`}
                            >
                              <div
                                className={`font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[14px] text-left text-nowrap tracking-[-0.084px] ${contentTab === "questions" ? "text-[#e16349]" : "text-[#868c98]"}`}
                              >
                                <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                                  Вопросы собеседования
                                </p>
                              </div>
                            </div>
                          </div>
                          <div
                            aria-hidden="true"
                            className="absolute border border-[#cdd0d5] border-solid inset-0 pointer-events-none rounded-3xl"
                          />
                        </div>

                        {/* Content */}
                        {contentTab === "candidates" && (
                          <div className="box-border content-stretch flex flex-col gap-5 items-start justify-start p-0 relative flex-1 w-full">
                            {/* Actions Bar */}
                            <div className="box-border content-stretch flex flex-row items-start justify-between relative shrink-0 w-full">
                              <div className="bg-[#f5f6f1] relative rounded-[20px] shrink-0 w-[280px]">
                                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start overflow-clip px-2.5 py-3 relative w-[280px] py-[14px] px-[12px] rounded-[30px]">
                                  <Search2LineIconV7 />
                                  <input
                                    type="text"
                                    placeholder="Поиск..."
                                    className="basis-0 css-z8d4os font-['Inter:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#000000] text-[14px] text-left tracking-[-0.084px] bg-transparent border-none outline-none placeholder:text-[#868c98]"
                                    onChange={(e) => {
                                      // TODO: Implement search functionality
                                      console.log("Search:", e.target.value);
                                    }}
                                  />
                                </div>
                                <div
                                  aria-hidden="true"
                                  className="absolute border border-[#cdd0d5] border-solid inset-0 pointer-events-none rounded-[20px]"
                                />
                              </div>

                              <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
                                <button 
                                  onClick={() => {
                                    // TODO: Implement PDF download functionality
                                    console.log("Download PDF clicked");
                                  }}
                                  className="bg-[#ffffff] relative rounded-[20px] shrink-0 cursor-pointer hover:bg-[#f6f8fa] transition-colors"
                                >
                                  <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip px-2.5 py-3.5 relative py-[14px] px-[12px] rounded-[30px]">
                                    <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0 rounded-[0px]">
                                      <div className="css-cf07vu font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#e16349] text-[14px] text-center text-nowrap tracking-[-0.084px]">
                                        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                                          Скачать pdf
                                        </p>
                                      </div>
                                    </div>
                                    <FilePdf2LineIconV7 className="w-6 h-6" />
                                  </div>
                                  <div
                                    aria-hidden="true"
                                    className="absolute border border-[#e16349] border-solid inset-0 pointer-events-none rounded-[20px]"
                                  />
                                </button>

                                <button 
                                  onClick={() => {
                                    // TODO: Implement send email functionality
                                    console.log("Send email clicked");
                                  }}
                                  className="bg-[#e16349] box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip px-2.5 py-3.5 relative rounded-[30px] shrink-0 px-[12px] py-[14px] cursor-pointer hover:bg-[#d14a31] transition-colors"
                                >
                                  <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-1 py-0 relative shrink-0">
                                    <div className="css-dh74q0 font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-center text-nowrap tracking-[-0.084px]">
                                      <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                                        Отправить письмо
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              </div>
                            </div>

                            {/* Candidates Table */}
                            <div className="bg-[#ffffff] relative rounded-3xl w-full min-h-[450px]">
                              <div className="flex flex-col items-end overflow-clip relative size-full">
                                <div className="box-border content-stretch flex flex-col gap-2.5 items-end justify-start p-[24px] relative w-full">
                                  {/* Filter Bar */}
                                  <div className="box-border content-stretch flex flex-row gap-4 items-center justify-between p-0 relative shrink-0 w-full">
                                    {/* Status Filter - Left Side */}
                                    <div className="bg-[#f6f8fa] relative rounded-[10px] shrink-0 w-fit">
                                      <div className="overflow-clip relative size-full">
                                        <div className="box-border content-stretch flex flex-row gap-1 items-start justify-start p-[4px] relative w-full">
                                          <button
                                            onClick={() =>
                                              setActiveStatusTab(
                                                "all",
                                              )
                                            }
                                            className={`relative rounded-md shrink-0 px-3 py-1 cursor-pointer transition-all duration-200 hover:bg-opacity-80 ${
                                              activeStatusTab ===
                                              "all"
                                                ? "bg-[#ffffff] shadow-[0px_6px_10px_0px_rgba(27,28,29,0.06),0px_2px_4px_0px_rgba(27,28,29,0.02)]"
                                                : "bg-[#f6f8fa] hover:bg-[#edeef0]"
                                            }`}
                                          >
                                            <div className="flex flex-row items-center justify-center overflow-clip relative">
                                              <div
                                                className={`font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[14px] text-left text-nowrap tracking-[-0.084px] ${
                                                  activeStatusTab ===
                                                  "all"
                                                    ? "text-[#0a0d14]"
                                                    : "text-[#868c98]"
                                                }`}
                                              >
                                                <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                                                  Все
                                                </p>
                                              </div>
                                            </div>
                                          </button>

                                          <button
                                            onClick={() =>
                                              setActiveStatusTab(
                                                "successful",
                                              )
                                            }
                                            className={`relative rounded-md shrink-0 px-3 py-1 cursor-pointer transition-all duration-200 hover:bg-opacity-80 ${
                                              activeStatusTab ===
                                              "successful"
                                                ? "bg-[#ffffff] shadow-[0px_6px_10px_0px_rgba(27,28,29,0.06),0px_2px_4px_0px_rgba(27,28,29,0.02)]"
                                                : "bg-[#f6f8fa] hover:bg-[#edeef0]"
                                            }`}
                                          >
                                            <div className="flex flex-row items-center justify-center overflow-clip relative">
                                              <div
                                                className={`font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[14px] text-left text-nowrap tracking-[-0.084px] ${
                                                  activeStatusTab ===
                                                  "successful"
                                                    ? "text-[#0a0d14]"
                                                    : "text-[#868c98]"
                                                }`}
                                              >
                                                <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                                                  Успешные
                                                </p>
                                              </div>
                                            </div>
                                          </button>

                                          <button
                                            onClick={() =>
                                              setActiveStatusTab(
                                                "failed",
                                              )
                                            }
                                            className={`relative rounded-md shrink-0 px-3 py-1 cursor-pointer transition-all duration-200 hover:bg-opacity-80 ${
                                              activeStatusTab ===
                                              "failed"
                                                ? "bg-[#ffffff] shadow-[0px_6px_10px_0px_rgba(27,28,29,0.06),0px_2px_4px_0px_rgba(27,28,29,0.02)]"
                                                : "bg-[#f6f8fa] hover:bg-[#edeef0]"
                                            }`}
                                          >
                                            <div className="flex flex-row items-center justify-center overflow-clip relative">
                                              <div
                                                className={`font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[14px] text-left text-nowrap tracking-[-0.084px] ${
                                                  activeStatusTab ===
                                                  "failed"
                                                    ? "text-[#0a0d14]"
                                                    : "text-[#868c98]"
                                                }`}
                                              >
                                                <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                                                  Провал
                                                </p>
                                              </div>
                                            </div>
                                          </button>

                                          <button
                                            onClick={() =>
                                              setActiveStatusTab(
                                                "finished",
                                              )
                                            }
                                            className={`relative rounded-md shrink-0 px-3 py-1 cursor-pointer transition-all duration-200 hover:bg-opacity-80 ${
                                              activeStatusTab ===
                                              "finished"
                                                ? "bg-[#ffffff] shadow-[0px_6px_10px_0px_rgba(27,28,29,0.06),0px_2px_4px_0px_rgba(27,28,29,0.02)]"
                                                : "bg-[#f6f8fa] hover:bg-[#edeef0]"
                                            }`}
                                          >
                                            <div className="flex flex-row items-center justify-center overflow-clip relative">
                                              <div
                                                className={`font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[14px] text-left text-nowrap tracking-[-0.084px] ${
                                                  activeStatusTab ===
                                                  "finished"
                                                    ? "text-[#0a0d14]"
                                                    : "text-[#868c98]"
                                                }`}
                                              >
                                                <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                                                  Завершённые
                                                </p>
                                              </div>
                                            </div>
                                          </button>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Right Side Filters - Stick to Right */}
                                    <div className="box-border content-stretch flex flex-row gap-3 items-center justify-end p-0 relative shrink-0">
                                      <div className="relative" data-dropdown="column-filters">
                                        <button
                                          onClick={() => {
                                            setColumnFiltersOpen(!columnFiltersOpen);
                                            console.log(
                                              "Filter clicked",
                                            );
                                          }}
                                          className="bg-[#ffffff] relative rounded-[20px] shrink-0 cursor-pointer hover:bg-[#f6f8fa] transition-colors duration-200"
                                        >
                                          <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center overflow-clip p-[14px] relative">
                                            <Filter3LineIcon />
                                            <div className="css-2x1u1o font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-center text-nowrap tracking-[-0.084px]">
                                              <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                                                Фильтр
                                              </p>
                                            </div>
                                          </div>
                                          <div
                                            aria-hidden="true"
                                            className={`absolute border border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_1px_2px_0px_rgba(82,88,102,0.06)] ${
                                              columnFiltersOpen
                                                ? "border-[#e16349]"
                                                : "border-[#e2e4e9]"
                                            }`}
                                          />
                                        </button>
                                        <ColumnFiltersDropdown
                                          isOpen={columnFiltersOpen}
                                          localFilters={localFilters}
                                          onLocalFiltersChange={setLocalFilters}
                                          onApplyFilters={setColumnFilters}
                                          onClose={() => setColumnFiltersOpen(false)}
                                        />
                                      </div>

                                      <div className="relative" data-dropdown="sort">
                                        <button
                                          onClick={() => {
                                            setSortDropdownOpen(!sortDropdownOpen);
                                            console.log(
                                              "Sort clicked",
                                            );
                                          }}
                                          className="bg-[#ffffff] relative rounded-[20px] shrink-0 w-fit cursor-pointer hover:bg-[#f6f8fa] transition-colors duration-200"
                                        >
                                        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start overflow-clip p-[14px] relative">
                                          <SortDescIcon />
                                          <div className="css-2x1u1o font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap tracking-[-0.084px]">
                                            <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                                              Сортировать
                                            </p>
                                          </div>
                                          <ArrowDownSLineIconV7
                                            className={`transition-transform duration-200 ${
                                              sortDropdownOpen
                                                ? "rotate-180"
                                                : ""
                                            }`}
                                          />
                                        </div>
                                        <div
                                          aria-hidden="true"
                                          className={`absolute border border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)] ${
                                            sortDropdownOpen
                                              ? "border-[#e16349]"
                                              : "border-[#e2e4e9]"
                                          }`}
                                        />
                                      </button>
                                      <SortDropdown
                                        isOpen={sortDropdownOpen}
                                        sortFieldsOrder={sortFieldsOrder}
                                        onSortFieldsChange={setSortFieldsOrder}
                                        onClose={() => setSortDropdownOpen(false)}
                                        draggedItem={draggedItem}
                                        onDragStart={handleDragStart}
                                        onDragOver={handleDragOver}
                                        onDragEnd={handleDragEnd}
                                      />
                                    </div>
                                    </div>
                                  </div>

                                  {/* Table Header */}
                                  <div className="bg-[#f6f8fa] box-border content-stretch flex flex-row h-9 items-start justify-start overflow-clip p-0 relative rounded-lg shrink-0 w-full">
                                    <div className="basis-0 bg-[#f6f8fa] grow min-h-px min-w-px relative shrink-0">
                                      <div className="flex flex-row items-center overflow-clip relative size-full">
                                        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start px-3 py-2 relative w-full">
                                          <Checkbox
                                            checked={areAllCandidatesSelected}
                                            onChange={handleSelectAllCandidates}
                                          />
                                          <div className="basis-0 box-border content-stretch flex flex-row gap-0.5 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
                                            <div className="css-2x1u1o font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap tracking-[-0.084px]">
                                              <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                                                Имя
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="basis-0 bg-[#f6f8fa] grow min-h-px min-w-px relative shrink-0">
                                      <div className="flex flex-row items-center overflow-clip relative size-full">
                                        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start px-3 py-2 relative w-full">
                                          <div className="basis-0 box-border content-stretch flex flex-row gap-0.5 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
                                            <div className="css-2x1u1o font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap tracking-[-0.084px]">
                                              <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                                                Оценка
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="basis-0 bg-[#f6f8fa] grow min-h-px min-w-px relative shrink-0">
                                      <div className="flex flex-row items-center overflow-clip relative size-full">
                                        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start px-3 py-2 relative w-full">
                                          <div className="basis-0 box-border content-stretch flex flex-row gap-0.5 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
                                            <div className="css-2x1u1o font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap tracking-[-0.084px]">
                                              <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                                                Статус
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Result Header */}
                                    <div className="basis-0 bg-[#f6f8fa] grow min-h-px min-w-px relative shrink-0">
                                      <div className="flex flex-row items-center overflow-clip relative size-full">
                                        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start px-3 py-2 relative w-full">
                                          <div className="basis-0 box-border content-stretch flex flex-row gap-0.5 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
                                            <div className="css-2x1u1o font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap tracking-[-0.084px]">
                                              <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                                                Результат
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="basis-0 bg-[#f6f8fa] grow min-h-px min-w-px relative shrink-0">
                                      <div className="flex flex-row items-center overflow-clip relative size-full">
                                        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start px-3 py-2 relative w-full">
                                          <div className="basis-0 box-border content-stretch flex flex-row gap-0.5 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
                                            <div className="css-2x1u1o font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#525866] text-[14px] text-left text-nowrap tracking-[-0.084px]">
                                              <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                                                Завершено
                                              </p>
                                            </div>
                                            <ExpandUpDownFillIcon />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Table Content */}
                                  <div className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-full">
                                    {filteredAndSortedCandidates.map(
                                      (candidate, index) => (
                                        <React.Fragment
                                          key={candidate.id}
                                        >
                                          <div className="bg-[#ffffff] box-border content-stretch flex flex-row items-center justify-start overflow-clip p-0 relative rounded-xl shrink-0 w-full">
                                            {/* Name Column */}
                                            <div className="basis-0 bg-[#ffffff] grow h-16 min-h-px min-w-px relative shrink-0">
                                              <div className="flex flex-row items-center overflow-clip relative size-full">
                                                <div className="box-border content-stretch flex flex-row gap-3 h-16 items-center justify-start pl-3 pr-5 py-3 relative w-full">
                                                  <Checkbox
                                                    checked={
                                                      candidate.selected
                                                    }
                                                    onChange={() =>
                                                      handleCandidateSelect(
                                                        candidate.id,
                                                      )
                                                    }
                                                  />
                                                  <div className="basis-0 box-border content-stretch flex flex-col gap-1 grow h-10 items-start justify-center leading-[0] min-h-px min-w-px not-italic p-0 relative shrink-0 text-left text-nowrap">
                                                    <div
                                                      className="css-vov616 font-['Inter:Medium',_sans-serif] font-medium overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0d14] text-[14px] tracking-[-0.084px] w-full cursor-pointer hover:text-[#e16349] transition-colors"
                                                      onClick={() =>
                                                        handleCandidateClick(candidate)
                                                      }
                                                    >
                                                      <p className="[text-overflow:inherit] [text-wrap-mode:inherit]' [white-space-collapse:inherit] block leading-[20px] overflow-inherit">
                                                        {
                                                          candidate.name
                                                        }
                                                      </p>
                                                    </div>
                                                    <div className="css-u1gx4j font-['Inter:Regular',_sans-serif] font-normal overflow-ellipsis overflow-hidden relative shrink-0 text-[#525866] text-[12px] w-full">
                                                      <p className="[text-overflow:inherit] [text-wrap-mode:inherit]' [white-space-collapse:inherit] block leading-[16px] overflow-inherit">
                                                        {
                                                          candidate.email
                                                        }
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            {/* Rating Column */}
                                            <div className="basis-0 bg-[#ffffff] grow h-16 min-h-px min-w-px relative shrink-0">
                                              <div className="flex flex-row items-center overflow-clip relative size-full">
                                                <div className="box-border content-stretch flex flex-row gap-3 h-16 items-center justify-start pl-3 pr-5 py-3 relative w-full">
                                                  <div className="basis-0 box-border content-stretch flex flex-col gap-1 grow items-start justify-center min-h-px min-w-px p-0 relative shrink-0">
                                                    <div className="css-vov616 font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0d14] text-[14px] text-left text-nowrap tracking-[-0.084px] w-full">
                                                      <p className="[text-overflow:inherit] [text-wrap-mode:inherit]' [white-space-collapse:inherit] block leading-[20px] overflow-inherit">
                                                        {
                                                          candidate.rating
                                                        }
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            {/* Status Column */}
                                            <div className="basis-0 grow h-16 min-h-px min-w-px relative shrink-0">
                                              <div className="flex flex-col justify-center relative size-full">
                                                <div className="box-border content-stretch flex flex-col gap-2.5 h-16 items-start justify-center p-[12px] relative w-full">
                                                  <div className="css-vov616 font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0d14] text-[14px] text-left text-nowrap tracking-[-0.084px] w-full">
                                                    <p className="[text-overflow:inherit] [text-wrap-mode:inherit]' [white-space-collapse:inherit] block leading-[20px] overflow-inherit">
                                                      {((candidate as any).interviewStatus === 'NOT_STARTED' && 'Не начато')
                                                        || ((candidate as any).interviewStatus === 'IN_PROGRESS' && 'В процессе')
                                                        || ((candidate as any).interviewStatus === 'FINISHED' && 'Завершено')
                                                        || ((candidate as any).interviewStatus === 'CANCELLED' && 'Отменено')
                                                        || '—'}
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            {/* Result Column */}
                                            <div className="basis-0 bg-[#ffffff] grow h-16 min-h-px min-w-px relative shrink-0">
                                              <div className="flex flex-row items-center overflow-clip relative size-full">
                                                <div className="box-border content-stretch flex flex-row gap-3 h-16 items-center justify-start pl-3 pr-5 py-3 relative w-full">
                                                  <div className="basis-0 box-border content-stretch flex flex-col gap-1 grow items-start justify-center min-h-px min-w-px p-0 relative shrink-0">
                                                    <div className="css-vov616 font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0d14] text-[14px] text-left text-nowrap tracking-[-0.084px] w-full">
                                                      <p className="[text-overflow:inherit] [text-wrap-mode:inherit]' [white-space-collapse:inherit] block leading-[20px] overflow-inherit">
                                                        {((candidate as any).result === 'SUCCESSFUL' && 'Успешно') || ((candidate as any).result === 'UNSUCCESSFUL' && 'Провал') || ((candidate as any).result === 'ERROR' && 'Ошибка') || '—'}
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            {/* Date Column */}
                                            <div className="basis-0 bg-[#ffffff] grow h-16 min-h-px min-w-px relative shrink-0">
                                              <div className="flex flex-row items-center overflow-clip relative size-full">
                                                <div className="box-border content-stretch flex flex-row gap-3 h-16 items-center justify-start pl-3 pr-5 py-3 relative w-full">
                                                  <div className="basis-0 box-border content-stretch flex flex-col gap-1 grow items-start justify-center min-h-px min-w-px p-0 relative shrink-0">
                                                    <div className="css-vov616 font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#0a0d14] text-[14px] text-left text-nowrap tracking-[-0.084px] w-full">
                                                      <p className="[text-overflow:inherit] [text-wrap-mode:inherit]' [white-space-collapse:inherit] block leading-[20px] overflow-inherit">
                                                        {
                                                          candidate.completed
                                                        }
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          {/* Divider between rows */}
                                          {index <
                                            filteredAndSortedCandidates.length -
                                              1 && (
                                            <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-0 py-[1.5px] relative shrink-0 w-full">
                                              <div className="basis-0 bg-[#e2e4e9] grow h-px min-h-px min-w-px shrink-0" />
                                            </div>
                                          )}
                                        </React.Fragment>
                                      ),
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {contentTab === "text" && (
                          <VacancyTextTab />
                        )}

                        {contentTab === "questions" && (
                          <QuestionsTab
                            activeTab={contentTab}
                            onTabChange={setContentTab}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}


            </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    </DndProvider>
  );
} 