import apiClient from '../../../services/api/client';
import type { User } from '../../../types/api';
import { API_ENDPOINTS } from '../../../config/constants';

export type LoginPayload    = { emailId: string; password: string };
export type RegisterPayload = { name: string; email: string; password: string };

export type AuthResponse = {
  user: User;
  token: string;
  tokenExpiry: string;
};

type ApiAuthEnvelope = {
  success: boolean;
  statusCode: number;
  message: string;
  data: AuthResponse;
};

const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiAuthEnvelope>(API_ENDPOINTS.AUTH.LOGIN, payload);
    return data.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiAuthEnvelope>(API_ENDPOINTS.AUTH.REGISTER, payload);
    return data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email },
    );
    return data;
  },

  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      { token, password },
    );
    return data;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
    return data;
  },

  updateProfile: async (payload: Partial<User>): Promise<User> => {
    const { data } = await apiClient.put<User>(API_ENDPOINTS.AUTH.ME, payload);
    return data;
  },
};

export default authService;
