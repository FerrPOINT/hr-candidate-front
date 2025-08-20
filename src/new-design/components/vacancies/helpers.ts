import { Candidate, SortField, ColumnFilters } from './types';

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "active":
      return "#38C793";
    case "paused":
      return "#F27B2C";
    case "archived":
      return "#DF1C41";
    default:
      return "#38C793";
  }
};

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case "active":
      return "Активная";
    case "paused":
      return "Пауза";
    case "archived":
      return "Архив";
    default:
      return "Активная";
  }
};

export const getVacancyStatusLabel = (status: "active" | "paused" | "archived"): string => {
  switch (status) {
    case "active":
      return "Активная";
    case "paused":
      return "Пауза";
    case "archived":
      return "Архив";
  }
};

export const filterAndSortCandidates = (
  candidates: Candidate[],
  columnFilters: ColumnFilters,
  sortFieldsOrder: SortField[]
): Candidate[] => {
  let filtered = candidates.filter(candidate => {
    if (columnFilters.name && !candidate.name.toLowerCase().includes(columnFilters.name.toLowerCase())) {
      return false;
    }
    if (columnFilters.status !== "all" && candidate.status !== columnFilters.status) {
      return false;
    }
    if (columnFilters.rating !== "all") {
      if (columnFilters.rating === "high" && candidate.rating < 7) return false;
      if (columnFilters.rating === "medium" && (candidate.rating < 5 || candidate.rating >= 7)) return false;
      if (columnFilters.rating === "low" && candidate.rating >= 5) return false;
    }
    return true;
  });

  return filtered.sort((a, b) => {
    const activeFields = sortFieldsOrder.filter(field => field.active);
    
    for (const field of activeFields) {
      let aValue: string | number = "";
      let bValue: string | number = "";

      switch (field.key) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "email":
          aValue = a.email;
          bValue = b.email;
          break;
        case "rating":
          aValue = a.rating;
          bValue = b.rating;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "completed":
          aValue = a.completed;
          bValue = b.completed;
          break;
      }

      let comparison = 0;
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = field.direction === "asc" 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = field.direction === "asc" 
          ? aValue - bValue 
          : bValue - aValue;
      }

      if (comparison !== 0) {
        return comparison;
      }
    }
    
    return 0;
  });
};

export const generatePageNumbers = (currentPage: number, totalPages: number): (number | string)[] => {
  const maxVisiblePages = 5;
  const sidePages = 2;
  const pages: (number | string)[] = [];
  
  if (totalPages <= maxVisiblePages + 2) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    
    const startPage = Math.max(2, currentPage - sidePages);
    const endPage = Math.min(totalPages - 1, currentPage + sidePages);
    
    if (startPage > 2) {
      pages.push('...');
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    
    if (totalPages > 1) {
      pages.push(totalPages);
    }
  }
  
  return pages;
}; 