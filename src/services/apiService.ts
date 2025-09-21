import { type ApiClient } from '../api/apiClient';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Configuration, CandidatesApi } from '../../generated-src/client';

class ApiService {
	getApiClient(): ApiClient {
		const currentToken = useAuthStore.getState().token;
		const config = new Configuration({
			basePath: (process.env.REACT_APP_API_BASE_URL || '/api/v1').toString().trim().replace(/\/+$/, ''),
			accessToken: () => currentToken || ''
		});
		return { candidates: new CandidatesApi(config) } as unknown as ApiClient;
	}

	getPublicApiClient(): ApiClient {
		const basePath = (process.env.REACT_APP_API_BASE_URL || '/api/v1').toString().trim().replace(/\/+$/, '');
		const config = new Configuration({ basePath });
		return { candidates: new CandidatesApi(config) } as unknown as ApiClient;
	}

	refreshApiClient() {}

	private resolveUrl(url: string): string {
		if (/^https?:\/\//i.test(url)) return url;
		const base = (process.env.REACT_APP_API_BASE_URL || '/api/v1').toString().trim().replace(/\/+$/, '');
		if (url.startsWith('/')) return `${base}${url}`;
		return `${base}/${url}`;
	}

	async get(url: string, config?: any): Promise<any> { return axios.get(this.resolveUrl(url), config); }
	async post(url: string, data?: any, config?: any): Promise<any> { return axios.post(this.resolveUrl(url), data, config); }
	async put(url: string, data?: any, config?: any): Promise<any> {
		const token = useAuthStore.getState().token;
		const headers = token ? { Authorization: `Bearer ${token}` } : {};
		return axios.put(this.resolveUrl(url), data, { ...config, headers: { ...config?.headers, ...headers } });
	}
	async delete(url: string, config?: any): Promise<any> {
		const token = useAuthStore.getState().token;
		const headers = token ? { Authorization: `Bearer ${token}` } : {};
		return axios.delete(this.resolveUrl(url), { ...config, headers: { ...config?.headers, ...headers } });
	}
}

export const apiService = new ApiService(); 
