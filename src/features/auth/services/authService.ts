import apiClient from '../../../services/api/client';
import type { User, SocialProvider, AllUsersPayload, AllUsersResponse } from '../../../types/api';
import { API_ENDPOINTS } from '../../../config/constants';

export type SocialLoginPayload = { provider: SocialProvider; token: string };

export type LoginPayload    = { emailId: string; password: string };
export type RegisterPayload = { userName: string; emailId: string; password: string; address: string };

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

type ApiUserEnvelope = {
  success: boolean;
  statusCode: number;
  message: string;
  data: User;
};

const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiAuthEnvelope>(API_ENDPOINTS.AUTH.LOGIN, payload);
    return data.data;
  },

  register: async (payload: RegisterPayload): Promise<{ message: string }> => {
    const { data } = await apiClient.post<ApiAuthEnvelope>(API_ENDPOINTS.AUTH.REGISTER, payload);
    return { message: data.message };
  },

  socialLogin: async (payload: SocialLoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiAuthEnvelope>(API_ENDPOINTS.AUTH.SOCIAL, payload);
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

  getProfile: async (tokenOverride?: string): Promise<User> => {
    const headers = tokenOverride ? { Authorization: `Bearer ${tokenOverride}` } : undefined;
    const { data } = await apiClient.get<ApiUserEnvelope>(API_ENDPOINTS.AUTH.ME, { headers });
    return data.data;
  },

  updateProfile: async (payload: Partial<User>): Promise<User> => {
    const { data } = await apiClient.put<User>(API_ENDPOINTS.AUTH.ME, payload);
    return data;
  },

  getUsers: async (payload: AllUsersPayload): Promise<AllUsersResponse> => {
    console.log("get member not prenet group",payload)
    const { data } = await apiClient.post<{ data: AllUsersResponse }>(API_ENDPOINTS.AUTH.USERS, payload);
    return data.data;
  },
};

export default authService;
