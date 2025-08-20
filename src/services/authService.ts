import { useAuthStore } from '../store/authStore';

class AuthService {
  // Проверяем, авторизован ли пользователь
  isAuthenticated(): boolean {
    return useAuthStore.getState().isAuth;
  }

  // Получаем информацию о текущем пользователе
  async getCurrentUser() {
    const { user } = useAuthStore.getState();
    return user;
  }

  // Вход в систему (используем authStore)
  async login(email: string, password: string): Promise<any> {
    return useAuthStore.getState().loginAdmin(email, password);
  }

  // Выход из системы (используем authStore)
  async logout(): Promise<void> {
    useAuthStore.getState().logout();
  }
}

// Экспортируем единственный экземпляр сервиса
export const authService = new AuthService(); 