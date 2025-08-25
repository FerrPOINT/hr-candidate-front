import { apiService } from '../services/apiService';
import { candidateApiService } from '../candidate/services/candidateApiService';

describe('API Debug Tests', () => {
  it('should check API configuration', () => {
    console.log('🔧 API Configuration Debug:');
    console.log('REACT_APP_API_BASE_URL:', process.env.REACT_APP_API_BASE_URL);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    const publicClient = apiService.getPublicApiClient();
    console.log('Public client created:', !!publicClient);
    console.log('Candidates API available:', !!publicClient.candidates);
    console.log('Login method available:', typeof publicClient.candidates.loginCandidate);
  });

  it('should test loginCandidate method structure', () => {
    const publicClient = apiService.getPublicApiClient();
    
    // Проверяем, что метод существует
    expect(typeof publicClient.candidates.loginCandidate).toBe('function');
    
    // Проверяем, что это асинхронная функция
    expect(publicClient.candidates.loginCandidate.constructor.name).toBe('AsyncFunction');
  });
});
