// src/config/version.ts
import { RoleEnum } from '../api/models';

export const APP_VERSION = process.env.REACT_APP_VERSION || 'new';

export const isLegacyVersion = APP_VERSION === 'legacy';
export const isNewVersion = APP_VERSION === 'new';

// Определение версии по роли пользователя
export const getVersionByRole = (role?: string) => {
  if (role === RoleEnum.ADMIN) return 'new';
  if (role === RoleEnum.RECRUITER || role === RoleEnum.VIEWER) return 'legacy';
  return 'new'; // по умолчанию
};

// Определение версии по URL
export const getVersionByUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('version') || 'new';
};

// Получение текущей версии
export const getCurrentVersion = (userRole?: string) => {
  return getVersionByUrl() || getVersionByRole(userRole);
}; 