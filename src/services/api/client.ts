import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ENV } from '../../config/env';
import { store } from '../../store';
import { signOut } from '../../features/auth/store/authSlice';

const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach JWT from Redux (loaded from Keychain on startup — no disk I/O per request)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Auto sign-out on 401 — prevents stale-token usage
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      store.dispatch(signOut());
    }
    return Promise.reject(error);
  },
);

export default apiClient;
