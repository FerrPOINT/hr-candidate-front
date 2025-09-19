import { authService } from '../authService';
import { useAuthStore } from '../../store/authStore';

// Мокаем authStore
jest.mock('../../store/authStore', () => ({
  useAuthStore: {
    getState: jest.fn(),
  },
}));

const mockAuthStore = useAuthStore as jest.Mocked<typeof useAuthStore>;

describe('authService', () => {
  let mockGetState: jest.Mock;
  let mockLoginAdmin: jest.Mock;
  let mockLogout: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockLoginAdmin = jest.fn();
    mockLogout = jest.fn();
    
    mockGetState = jest.fn(() => ({
      isAuth: false,
      user: null,
      loginAdmin: mockLoginAdmin,
      logout: mockLogout,
    }));
    
    mockAuthStore.getState = mockGetState;
  });

  it('имеет правильную структуру', () => {
    expect(authService).toBeDefined();
    expect(typeof authService).toBe('object');
    expect(typeof authService.isAuthenticated).toBe('function');
    expect(typeof authService.getCurrentUser).toBe('function');
    expect(typeof authService.login).toBe('function');
    expect(typeof authService.logout).toBe('function');
  });

  describe('isAuthenticated', () => {
    it('возвращает false когда пользователь не авторизован', () => {
      mockGetState.mockReturnValue({
        isAuth: false,
        user: null,
        loginAdmin: mockLoginAdmin,
        logout: mockLogout,
      });

      expect(authService.isAuthenticated()).toBe(false);
    });

    it('возвращает true когда пользователь авторизован', () => {
      mockGetState.mockReturnValue({
        isAuth: true,
        user: { id: '1', email: 'test@example.com' },
        loginAdmin: mockLoginAdmin,
        logout: mockLogout,
      });

      expect(authService.isAuthenticated()).toBe(true);
    });
  });

  describe('getCurrentUser', () => {
    it('возвращает null когда пользователь не авторизован', async () => {
      mockGetState.mockReturnValue({
        isAuth: false,
        user: null,
        loginAdmin: mockLoginAdmin,
        logout: mockLogout,
      });

      const user = await authService.getCurrentUser();
      expect(user).toBeNull();
    });

    it('возвращает данные пользователя когда авторизован', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      mockGetState.mockReturnValue({
        isAuth: true,
        user: mockUser,
        loginAdmin: mockLoginAdmin,
        logout: mockLogout,
      });

      const user = await authService.getCurrentUser();
      expect(user).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('вызывает loginAdmin из authStore', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const expectedResult = { success: true, user: { id: '1', email } };
      
      mockLoginAdmin.mockResolvedValue(expectedResult);

      const result = await authService.login(email, password);

      expect(mockLoginAdmin).toHaveBeenCalledWith(email, password);
      expect(result).toEqual(expectedResult);
    });

    it('передает ошибки из authStore', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';
      const error = new Error('Invalid credentials');
      
      mockLoginAdmin.mockRejectedValue(error);

      await expect(authService.login(email, password)).rejects.toThrow('Invalid credentials');
      expect(mockLoginAdmin).toHaveBeenCalledWith(email, password);
    });
  });

  describe('logout', () => {
    it('вызывает logout из authStore', async () => {
      await authService.logout();

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('не возвращает значение', async () => {
      const result = await authService.logout();
      expect(result).toBeUndefined();
    });
  });
});