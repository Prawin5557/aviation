import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';
import { ENV } from '@/src/config/env';
import { logger } from '@/src/utils/logger';

const networkErrorLogTimestamps = new Map<string, number>();
const NETWORK_ERROR_LOG_THROTTLE_MS = 10000;

const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosRetry(apiClient, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    const status = error.response?.status;
    if (status === 429) {
      return true;
    }

    return typeof status === 'number' && status >= 500;
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    if (ENV.FRONTEND_ONLY) {
      return Promise.reject({
        isFrontendOnly: true,
        message: 'Frontend-only mode: API calls are disabled.',
        config,
      });
    }

    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if ((error as any)?.isFrontendOnly || ENV.FRONTEND_ONLY) {
      return Promise.reject({
        ...error,
        isFrontendOnly: true,
        message: 'Frontend-only mode: API calls are disabled.',
      });
    }

    if (!error.response) {
      const url = error.config?.url ?? 'unknown-url';
      const now = Date.now();
      const lastLoggedAt = networkErrorLogTimestamps.get(url) ?? 0;
      if (now - lastLoggedAt > NETWORK_ERROR_LOG_THROTTLE_MS) {
        logger.error('Network error while calling API', { url });
        networkErrorLogTimestamps.set(url, now);
      }

      return Promise.reject({
        ...error,
        isNetworkError: true,
        message: 'Unable to reach server. Please check your connection and try again.',
      });
    }

    if (error.response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }

    const message = error.response.data?.message || 'Something went wrong. Please try again.';
    return Promise.reject({ ...error, message });
  }
);

export default apiClient;