import type { ApiUser } from '../types/api';
import { apiClient } from './apiClient';

export const userService = {
  getAdminUsers: () => apiClient.get<ApiUser[]>('/api/admin/users'),
};
