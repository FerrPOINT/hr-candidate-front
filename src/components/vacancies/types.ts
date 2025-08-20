export type NavigationTab = "vacancies" | "statistics" | "team";
export type ContentTab = "candidates" | "text" | "questions";
export type ViewMode = "list" | "create" | "candidate-answers" | "create-interview";
export type StatusTab = "all" | "successful" | "failed" | "finished";
export type FilterTab = "all" | "my";
export type VacancyStatus = "active" | "paused" | "archived";

export interface VacanciesPageUnifiedProps {
  activeTab?: NavigationTab;
  onTabChange?: (tab: NavigationTab) => void;
  onCandidateClick?: (candidateId: string) => void;
  onCreateVacancy?: () => void;
  onEditVacancy?: () => void;
  onUserProfileClick?: () => void;
  onCreateInterview?: (positionId: number) => void;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  rating: number;
  status: string;
  completed: string;
  selected: boolean;
  result?: string;
  interviewStatus?: string;
}

export interface Vacancy {
  id: string;
  title: string;
  department?: string;
  manager: string;
  candidateCount: number;
  status: VacancyStatus;
}

export interface ColumnFilters {
  name: string;
  status: string;
  rating: string;
  date: string;
}

export interface SortField {
  key: string;
  active: boolean;
  direction: "asc" | "desc";
}

export interface NavigationItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ color?: string }>;
} 