import { useState, useEffect, useCallback } from 'react';
import { optimizedApiService } from '../services/optimizedApiService';
import type { Position, Interview, Candidate, Question } from '../api/models';

// Интерфейс параметров фильтрации (пример, можно расширить)
export interface VacanciesFilterParams {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export const useVacanciesData = (params?: VacanciesFilterParams) => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [stats, setStats] = useState<Record<number, number>>({});
  const [questions, setQuestions] = useState<Record<number, Question[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await optimizedApiService.getVacanciesPageData(params ? { ...params } : undefined);
      setPositions(data.positions as Position[]);
      setInterviews(data.interviews as Interview[]);
      setStats(data.stats as Record<number, number>);
      setQuestions(data.questions as Record<number, Question[]>);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Ошибка загрузки данных';
      console.error('Error loading vacancies data:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    positions,
    interviews,
    stats,
    questions,
    loading,
    error,
    refresh
  };
};

export interface DashboardFilterParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export const useDashboardData = (params?: DashboardFilterParams) => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await optimizedApiService.getDashboardPageData(params ? { ...params } : undefined);
      setPositions(data.positions as Position[]);
      setInterviews(data.interviews as Interview[]);
      setCandidates(data.candidates as Candidate[]);
      setStats(data.stats as Record<string, number>);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Ошибка загрузки данных';
      console.error('Error loading dashboard data:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    positions,
    interviews,
    candidates,
    stats,
    loading,
    error,
    refresh
  };
};

export interface InterviewsFilterParams {
  search?: string;
  positionId?: number;
  candidateId?: number;
  page?: number;
  pageSize?: number;
}

export const useInterviewsData = (params?: InterviewsFilterParams) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const key = JSON.stringify(params || {});

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await optimizedApiService.getInterviewsPageData(params ? { ...params } : undefined);
      setInterviews(data.interviews as Interview[]);
      setPositions(data.positions as Position[]);
      setCandidates(data.candidates as Candidate[]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Ошибка загрузки данных';
      console.error('Error loading interviews data:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    interviews,
    positions,
    candidates,
    loading,
    error,
    refresh
  };
}; 