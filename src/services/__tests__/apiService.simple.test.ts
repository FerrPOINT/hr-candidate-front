import { apiService } from '../apiService';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';

// Mock authStore
jest.mock('../../store/authStore', () => ({
  useAuthStore: {
    getState: jest.fn(() => ({
      token: 'mock-token'
    }))
  }
}));

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

// Mock generated API classes
jest.mock('../../../generated-src/client', () => ({
  Configuration: jest.fn(),
  CandidatesApi: jest.fn(),
}));

describe('ApiService - Simple Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create API service instance', () => {
    expect(apiService).toBeDefined();
    expect(typeof apiService.getApiClient).toBe('function');
    expect(typeof apiService.getPublicApiClient).toBe('function');
    expect(typeof apiService.refreshApiClient).toBe('function');
  });

  it('should have HTTP methods', () => {
    expect(typeof apiService.get).toBe('function');
    expect(typeof apiService.post).toBe('function');
    expect(typeof apiService.put).toBe('function');
    expect(typeof apiService.delete).toBe('function');
  });

  it('should get API client with token', () => {
    const client = apiService.getApiClient();
    
    expect(client).toBeDefined();
    expect(client.candidates).toBeDefined();
  });

  it('should get public API client without token', () => {
    const client = apiService.getPublicApiClient();
    
    expect(client).toBeDefined();
    expect(client.candidates).toBeDefined();
  });

  it('should handle GET requests', async () => {
    const mockResponse = { data: 'test' };
    (axios.get as jest.Mock).mockResolvedValue(mockResponse);
    
    const result = await apiService.get('/test');
    
    expect(axios.get).toHaveBeenCalledWith('/api/v1/test', undefined);
    expect(result).toBe(mockResponse);
  });

  it('should handle POST requests', async () => {
    const mockResponse = { data: 'test' };
    const mockData = { name: 'test' };
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);
    
    const result = await apiService.post('/test', mockData);
    
    expect(axios.post).toHaveBeenCalledWith('/api/v1/test', mockData, undefined);
    expect(result).toBe(mockResponse);
  });

  it('should handle PUT requests with authorization', async () => {
    const mockResponse = { data: 'test' };
    const mockData = { name: 'test' };
    (axios.put as jest.Mock).mockResolvedValue(mockResponse);
    
    const result = await apiService.put('/test', mockData);
    
    expect(axios.put).toHaveBeenCalledWith('/api/v1/test', mockData, {
      headers: { Authorization: 'Bearer mock-token' }
    });
    expect(result).toBe(mockResponse);
  });

  it('should handle DELETE requests with authorization', async () => {
    const mockResponse = { data: 'test' };
    (axios.delete as jest.Mock).mockResolvedValue(mockResponse);
    
    const result = await apiService.delete('/test');
    
    expect(axios.delete).toHaveBeenCalledWith('/api/v1/test', {
      headers: { Authorization: 'Bearer mock-token' }
    });
    expect(result).toBe(mockResponse);
  });

  it('should handle requests without token', async () => {
    (useAuthStore.getState as jest.Mock).mockReturnValue({ token: null });
    
    const mockResponse = { data: 'test' };
    (axios.put as jest.Mock).mockResolvedValue(mockResponse);
    
    const result = await apiService.put('/test', {});
    
    expect(axios.put).toHaveBeenCalledWith('/api/v1/test', {}, {
      headers: {}
    });
    expect(result).toBe(mockResponse);
  });

  it('should handle custom headers', async () => {
    const mockResponse = { data: 'test' };
    const customHeaders = { 'Custom-Header': 'value' };
    (axios.put as jest.Mock).mockResolvedValue(mockResponse);
    
    const result = await apiService.put('/test', {}, { headers: customHeaders });
    
    // Проверяем, что axios.put был вызван с правильными параметрами
    expect(axios.put).toHaveBeenCalledWith('/api/v1/test', {}, {
      headers: customHeaders
    });
    expect(result).toBe(mockResponse);
  });

  it('should handle different URL formats', async () => {
    const mockResponse = { data: 'test' };
    (axios.get as jest.Mock).mockResolvedValue(mockResponse);
    
    // Test relative URL
    await apiService.get('test');
    expect(axios.get).toHaveBeenCalledWith('/api/v1/test', undefined);
    
    // Test absolute URL
    await apiService.get('https://api.example.com/test');
    expect(axios.get).toHaveBeenCalledWith('https://api.example.com/test', undefined);
    
    // Test URL starting with /
    await apiService.get('/test');
    expect(axios.get).toHaveBeenCalledWith('/api/v1/test', undefined);
  });

  it('should handle environment variables', () => {
    const originalEnv = process.env.REACT_APP_API_BASE_URL;
    
    // Test with default value
    delete process.env.REACT_APP_API_BASE_URL;
    const client1 = apiService.getApiClient();
    expect(client1).toBeDefined();
    
    // Test with custom value
    process.env.REACT_APP_API_BASE_URL = 'https://api.example.com';
    const client2 = apiService.getApiClient();
    expect(client2).toBeDefined();
    
    // Restore original value
    process.env.REACT_APP_API_BASE_URL = originalEnv;
  });

  it('should handle refresh API client', () => {
    // This method is currently empty, but we can test it doesn't throw
    expect(() => apiService.refreshApiClient()).not.toThrow();
  });
});
