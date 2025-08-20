import { Configuration } from '../../generated-src/client/configuration';
import { AuthApi } from '../../generated-src/client/apis/auth-api';
import { AccountApi } from '../../generated-src/client/apis/account-api';
import { CandidatesApi } from '../../generated-src/client/apis/candidates-api';
import { InterviewsApi } from '../../generated-src/client/apis/interviews-api';
import { PositionsApi } from '../../generated-src/client/apis/positions-api';
import { QuestionsApi } from '../../generated-src/client/apis/questions-api';
import { TeamUsersApi } from '../../generated-src/client/apis/team-users-api';
import { AnalyticsReportsApi } from '../../generated-src/client/apis/analytics-reports-api';
import { SettingsApi } from '../../generated-src/client/apis/settings-api';
import { AIApi } from '../../generated-src/client/apis/aiapi';
import { VoiceApi } from '../../generated-src/client/apis/voice-api';
import { VoiceInterviewsApi } from '../../generated-src/client/apis/voice-interviews-api';
import { GenerationApi } from '../../generated-src/client/apis/generation-api';
// Professional: Always import the auth store for token access
import { useAuthStore } from '../store/authStore';
import axios from 'axios';

export interface ApiClient {
    auth: AuthApi;
    account: AccountApi;
    candidates: CandidatesApi;
    interviews: InterviewsApi;
    positions: PositionsApi;
    questions: QuestionsApi;
    teamUsers: TeamUsersApi;
    analyticsReports: AnalyticsReportsApi;
    settings: SettingsApi;
    ai: AIApi;
    voice: VoiceApi;
    voiceInterviews: VoiceInterviewsApi;
    generation: GenerationApi;
}

// Helper to get sanitized API base and path
function getApiBase() {
    const raw = (process.env.REACT_APP_API_BASE_URL || '/api/v1').toString();
    const base = raw.trim().replace(/\/+$/, '');
    return base;
}
function getApiPath() {
    try {
        const base = getApiBase();
        // If absolute, extract pathname; else take as-is
        if (/^https?:\/\//i.test(base)) {
            return new URL(base).pathname.replace(/\/+$/, '');
        }
        return base.replace(/\/+$/, '');
    } catch {
        return '/api';
    }
}

// Inject Authorization header only for requests to our backend API
axios.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (!token) return config;

    const apiBase = getApiBase();
    const apiPath = getApiPath();

    const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
    const url = fullUrl.toString();

    const isAbsolute = /^https?:\/\//i.test(url);
    const matchesApiBase = isAbsolute ? url.startsWith(apiBase) : false;
    const matchesApiPath = !isAbsolute && (url.startsWith(apiPath + '/') || url === apiPath);

    if (matchesApiBase || matchesApiPath) {
        config.headers = config.headers || {};
        if (!('Authorization' in config.headers)) {
            (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
        }
    }

    return config;
});

/**
 * Professional API client factory.
 * - Always injects the current JWT token from zustand store into all requests via OpenAPI Configuration's accessToken property.
 * - Removes all Basic Auth logic (username/password).
 * - Ensures Authorization: Bearer <token> is set for all protected endpoints.
 * - If token is null, requests are sent without Authorization (for public endpoints).
 * - To update token after login/logout, simply re-create the client (or use a singleton pattern if desired).
 */
export function createApiClient(
    basePath: string = process.env.REACT_APP_API_BASE_URL || '/api/v1'
): ApiClient {
    const sanitizedBasePath = (basePath || '')
        .toString()
        .trim()
        .replace(/\/+$/, '');
    // Always provide a function to access the latest token from zustand
    const config = new Configuration({
        basePath: sanitizedBasePath,
        accessToken: () => useAuthStore.getState().token || '',
        // baseOptions can be extended here if needed
    });

    return {
        auth: new AuthApi(config),
        account: new AccountApi(config),
        candidates: new CandidatesApi(config),
        interviews: new InterviewsApi(config),
        positions: new PositionsApi(config),
        questions: new QuestionsApi(config),
        teamUsers: new TeamUsersApi(config),
        analyticsReports: new AnalyticsReportsApi(config),
        settings: new SettingsApi(config),
        ai: new AIApi(config),
        voice: new VoiceApi(config),
        voiceInterviews: new VoiceInterviewsApi(config),
        generation: new GenerationApi(config)
    };
}

// Global axios interceptor for 401/403 errors
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.log(`🔍 ${error.response.status} ${error.response.status === 401 ? 'Unauthorized' : 'Forbidden'} detected`);
            console.log(`🔍 Request URL: ${error.config?.url}`);
            console.log(`🔍 Request method: ${error.config?.method}`);
            console.log(`🔍 Request headers:`, error.config?.headers);

            // Don't show modal if we're already on login page or if it's a login request
            const isLoginRequest = error.config?.url?.includes('/auth/login') ||
                error.config?.url?.includes('/candidates/auth');
            const isOnLoginPage = window.location.pathname === '/login';

            if (!isLoginRequest && !isOnLoginPage) {
                // Show session expired modal instead of immediate redirect
                useAuthStore.getState().showSessionExpired();
            }
        }
        return Promise.reject(error);
    }
);

/**
 * Global API client instance.
 * Use this singleton instance throughout the application instead of creating new clients.
 */
export const apiClient = createApiClient(); 