// src/hooks/useRoleAccess.ts
import { useAuthStore } from '../store/authStore';
import { RoleEnum } from '../api/models';

export const useRoleAccess = () => {
  const { user } = useAuthStore();

  return {
    isAdmin: user && 'role' in user && user.role === RoleEnum.ADMIN,
    isRecruiter: user && 'role' in user && user.role === RoleEnum.RECRUITER,
    isViewer: user && 'role' in user && user.role === RoleEnum.VIEWER,
    isCandidate: user && (!('role' in user) || user.role === undefined),
    canCreate: user && 'role' in user && (user.role === RoleEnum.ADMIN || user.role === RoleEnum.RECRUITER),
    canEdit: user && 'role' in user && (user.role === RoleEnum.ADMIN || user.role === RoleEnum.RECRUITER),
    canDelete: user && 'role' in user && user.role === RoleEnum.ADMIN,
    canManageTeam: user && 'role' in user && user.role === RoleEnum.ADMIN,
    canManageSettings: user && 'role' in user && user.role === RoleEnum.ADMIN,
  };
}; 