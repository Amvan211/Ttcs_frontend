import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/api';
import { apiClient } from './apiClient';

export const authService = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>('/api/auth/login', payload, { skipAuth: true }),

  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse>('/api/auth/register', payload, { skipAuth: true }),
};
