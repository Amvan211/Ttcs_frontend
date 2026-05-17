import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/api';
import { apiClient } from './apiClient';

export const authService = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>('/api/auth/login', payload, { skipAuth: true }),

  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse>('/api/auth/register', payload, { skipAuth: true }),

  changePassword: (payload: { oldPassword: string; newPassword: string }) =>
    apiClient.put<string>('/api/auth/password', payload),
  updateProfile: (payload: { fullName?: string; mail?: string; phone?: string; storeName?: string; address?: string }) =>
    apiClient.put<string>('/api/auth/profile', payload),
};
