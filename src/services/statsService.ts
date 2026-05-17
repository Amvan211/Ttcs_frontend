import type { AdminDashboardOverview } from '../types/admin';
import { apiClient } from './apiClient';

export const statsService = {
  getAdminDashboardOverview: () =>
    apiClient.get<AdminDashboardOverview>('/api/admin/dashboard/overview'),
};
