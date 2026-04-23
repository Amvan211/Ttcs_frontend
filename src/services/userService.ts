import type { AdminUserPayload, ApiUser } from '../types/api';
import { apiClient } from './apiClient';

export const userService = {
  getAdminUsers: () => apiClient.get<ApiUser[]>('/api/admin/users'),
  createAdminUser: (payload: AdminUserPayload) => apiClient.post<ApiUser>('/api/admin/users', payload),
  updateAdminUser: (id: number, payload: Partial<AdminUserPayload>) =>
    apiClient.put<ApiUser>(`/api/admin/users/${id}`, payload),
  deleteAdminUser: (id: number) => apiClient.delete<void>(`/api/admin/users/${id}`),
};
